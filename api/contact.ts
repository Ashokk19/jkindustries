import type { VercelRequest, VercelResponse } from '@vercel/node';
import { Resend } from 'resend';

// On Windows local development environments, Node.js uses a bundled certificate store
// that may fail with UNABLE_TO_GET_ISSUER_CERT_LOCALLY. Relaxing TLS only in non-production.
if (process.env.NODE_ENV !== 'production' && !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
  process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
}

// Simple in-memory rate limiting (per serverless instance)
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const RATE_LIMIT_MAX_REQUESTS = 5; // max 5 submissions per window

function isRateLimited(ip: string): boolean {
  const now = Date.now();
  const record = rateLimitMap.get(ip);

  // Clean expired records periodically
  if (rateLimitMap.size > 500) {
    for (const [key, value] of rateLimitMap.entries()) {
      if (now > value.resetAt) {
        rateLimitMap.delete(key);
      }
    }
  }

  if (!record || now > record.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return false;
  }

  if (record.count >= RATE_LIMIT_MAX_REQUESTS) {
    return true;
  }

  record.count += 1;
  return false;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function isValidEmail(email: string): boolean {
  if (!email || email.length > 254) return false;
  const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
  return emailRegex.test(email);
}

export interface ContactRequestBody {
  name?: string;
  company?: string;
  phone?: string;
  email?: string;
  machine?: string;
  machineName?: string;
  notes?: string;
  _gotcha?: string; // honeypot field
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // 1. Only allow POST requests
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Only POST requests are accepted.',
    });
  }

  try {
    // 2. Parse and validate body
    let body: ContactRequestBody;
    if (typeof req.body === 'string') {
      try {
        body = JSON.parse(req.body);
      } catch {
        return res.status(400).json({
          success: false,
          error: 'Invalid JSON payload.',
        });
      }
    } else if (req.body && typeof req.body === 'object') {
      body = req.body;
    } else {
      return res.status(400).json({
        success: false,
        error: 'Missing request body.',
      });
    }

    // 3. Payload size check
    const rawSize = JSON.stringify(body).length;
    if (rawSize > 50000) {
      return res.status(413).json({
        success: false,
        error: 'Payload size exceeds the allowable limit.',
      });
    }

    // 4. Honeypot check (silent drop for automated bots)
    if (body._gotcha && body._gotcha.trim().length > 0) {
      return res.status(200).json({
        success: true,
        message: 'Specification received successfully.',
      });
    }

    // 5. Rate limiting
    const forwarded = req.headers['x-forwarded-for'];
    const ip = typeof forwarded === 'string'
      ? forwarded.split(',')[0].trim()
      : (req.socket?.remoteAddress || 'unknown');

    if (ip !== 'unknown' && isRateLimited(ip)) {
      return res.status(429).json({
        success: false,
        error: 'Too many quote requests submitted. Please wait a few minutes or contact us directly at +91 9865238680.',
      });
    }

    // 6. Validate required fields
    const name = (body.name || '').trim();
    const company = (body.company || '').trim();
    const phone = (body.phone || '').trim();
    const email = (body.email || '').trim().toLowerCase();
    const machine = (body.machine || '').trim();
    const machineName = (body.machineName || '').trim();
    const notes = (body.notes || '').trim();

    if (!name || name.length < 2 || name.length > 100) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid contact person name (2 to 100 characters).',
      });
    }

    if (!company || company.length < 1 || company.length > 150) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid company or mill name.',
      });
    }

    if (!phone || phone.length < 7 || phone.length > 30) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid phone number with country/area code.',
      });
    }

    if (!isValidEmail(email)) {
      return res.status(400).json({
        success: false,
        error: 'Please provide a valid email address.',
      });
    }

    if (!machine) {
      return res.status(400).json({
        success: false,
        error: 'Please select a machine model or requirement.',
      });
    }

    if (notes.length > 3000) {
      return res.status(400).json({
        success: false,
        error: 'Substrate details and notes must not exceed 3,000 characters.',
      });
    }

    // 7. Verify environment configuration
    const apiKey = process.env.RESEND_API_KEY || process.env.VITE_RESEND_API_KEY;
    const toEmail = process.env.RESEND_TO_EMAIL || process.env.VITE_RESEND_TO_EMAIL;
    const fromEmail =
      process.env.RESEND_FROM_EMAIL ||
      process.env.VITE_RESEND_FROM_EMAIL ||
      'JK Industries Website <website@jkindustriestup.co.in>';

    if (!apiKey) {
      const relatedKeys = Object.keys(process.env).filter(
        (k) => k.includes('RESEND') || k.includes('EMAIL')
      );
      console.error(
        '[Resend Error] RESEND_API_KEY environment variable is not configured. Detected related keys:',
        relatedKeys
      );
      return res.status(500).json({
        success: false,
        error: 'Email service is currently unavailable. Please reach us directly at jkindustries1905@gmail.com or +91 9865238680.',
      });
    }

    if (!toEmail) {
      console.error('[Resend Error] RESEND_TO_EMAIL environment variable is not configured.');
      return res.status(500).json({
        success: false,
        error: 'Email service destination is not configured. Please contact the administrator.',
      });
    }

    // 8. Prepare email content
    const displayMachine = machineName ? `${machineName} (${machine})` : machine;
    const subject = `New Machinery Quote Enquiry: ${company} – ${machineName || machine}`;

    const plainText = [
      '==================================================',
      'NEW MACHINERY QUOTATION ENQUIRY - JK INDUSTRIES',
      '==================================================',
      '',
      `Contact Person:  ${name}`,
      `Company / Mill:  ${company}`,
      `Phone Number:    ${phone}`,
      `Email Address:   ${email}`,
      `Machine Model:   ${displayMachine}`,
      '',
      'Substrate Details & Production Requirements:',
      notes || 'None provided.',
      '',
      '--------------------------------------------------',
      `Submitted: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
      'Origin: https://jkindustriestup.co.in',
      `Reply directly to this email to respond to ${name} (${email}).`,
      '==================================================',
    ].join('\n');

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>New Website Enquiry</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      line-height: 1.6;
      color: #1a1a1a;
      background-color: #f4f4f5;
      margin: 0;
      padding: 24px;
    }
    .container {
      max-width: 640px;
      margin: 0 auto;
      background: #ffffff;
      border: 1px solid #e4e4e7;
      border-top: 4px solid #ea580c;
    }
    .header {
      padding: 24px 28px 20px;
      background: #09090b;
      color: #ffffff;
    }
    .badge {
      display: inline-block;
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.05em;
      text-transform: uppercase;
      padding: 3px 8px;
      background: #ea580c;
      color: #ffffff;
      margin-bottom: 8px;
    }
    .header h1 {
      margin: 0;
      font-size: 20px;
      font-weight: 700;
      letter-spacing: -0.02em;
      text-transform: uppercase;
    }
    .header p {
      margin: 4px 0 0;
      font-size: 13px;
      color: #a1a1aa;
    }
    .content {
      padding: 28px;
    }
    .field-table {
      width: 100%;
      border-collapse: collapse;
      margin-bottom: 24px;
    }
    .field-table th {
      width: 32%;
      padding: 10px 12px;
      background: #f8fafc;
      border: 1px solid #e2e8f0;
      font-size: 12px;
      text-transform: uppercase;
      color: #64748b;
      font-weight: 600;
      text-align: left;
      vertical-align: top;
    }
    .field-table td {
      padding: 10px 12px;
      border: 1px solid #e2e8f0;
      font-size: 14px;
      color: #0f172a;
      font-weight: 500;
    }
    .notes-box {
      background: #f8fafc;
      border-left: 3px solid #ea580c;
      border-top: 1px solid #e2e8f0;
      border-right: 1px solid #e2e8f0;
      border-bottom: 1px solid #e2e8f0;
      padding: 16px;
      margin-top: 16px;
    }
    .notes-title {
      font-size: 12px;
      font-weight: 700;
      text-transform: uppercase;
      color: #64748b;
      margin-bottom: 6px;
    }
    .notes-text {
      font-size: 14px;
      color: #0f172a;
      white-space: pre-wrap;
      word-break: break-word;
      margin: 0;
    }
    .footer {
      padding: 20px 28px;
      background: #fafafa;
      border-top: 1px solid #e4e4e7;
      font-size: 12px;
      color: #71717a;
      text-align: center;
    }
    .reply-badge {
      display: inline-block;
      margin-top: 8px;
      font-size: 12px;
      color: #ea580c;
      font-weight: 600;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">J.K. Industries // Technical Sales</div>
      <h1>Machinery Quotation Enquiry</h1>
      <p>Direct submission from jkindustriestup.co.in</p>
    </div>
    <div class="content">
      <table class="field-table">
        <tr>
          <th>Contact Person</th>
          <td><strong>${escapeHtml(name)}</strong></td>
        </tr>
        <tr>
          <th>Company / Mill</th>
          <td>${escapeHtml(company)}</td>
        </tr>
        <tr>
          <th>Phone Number</th>
          <td><a href="tel:${escapeHtml(phone)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(phone)}</a></td>
        </tr>
        <tr>
          <th>Email Address</th>
          <td><a href="mailto:${escapeHtml(email)}" style="color: #0284c7; text-decoration: none;">${escapeHtml(email)}</a></td>
        </tr>
        <tr>
          <th>Machine Model</th>
          <td><strong>${escapeHtml(displayMachine)}</strong></td>
        </tr>
      </table>

      <div class="notes-box">
        <div class="notes-title">Substrate Details &amp; Production Speed Target</div>
        <p class="notes-text">${notes ? escapeHtml(notes) : '<em>No additional substrate details provided.</em>'}</p>
      </div>
    </div>
    <div class="footer">
      <div>Received on ${escapeHtml(new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' }))} IST</div>
      <div class="reply-badge">&crarr; Simply click Reply to respond directly to ${escapeHtml(email)}</div>
    </div>
  </div>
</body>
</html>
    `.trim();

    // 9. Send via Resend Node SDK
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: fromEmail,
      to: [toEmail],
      replyTo: email,
      subject,
      text: plainText,
      html: htmlContent,
    });

    if (error) {
      console.error('[Resend Error]', error);
      return res.status(502).json({
        success: false,
        error: 'Unable to send enquiry email at this time. Please contact us directly by phone at +91 9865238680.',
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Quotation request received successfully. Our engineering department in Tirupur will follow up promptly.',
      id: data?.id,
    });
  } catch (err) {
    console.error('[Unhandled Contact API Error]', err);
    return res.status(500).json({
      success: false,
      error: 'An unexpected error occurred while processing your request. Please try again later.',
    });
  }
}
