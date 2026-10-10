import { defineConfig, loadEnv, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'
import contactHandler from './api/contact'

function localApiPlugin(): Plugin {
  return {
    name: 'local-api-contact-handler',
    configureServer(server) {
      server.middlewares.use('/api/contact', async (req, res, next) => {
        if (req.method !== 'POST') {
          return next()
        }

        // On Windows local development, Node.js uses a bundled CA store that may reject
        // local network / ISP certificates with UNABLE_TO_GET_ISSUER_CERT_LOCALLY.
        // Relaxing TLS verification only in local development server fixes this.
        if (process.env.NODE_ENV !== 'production' && !process.env.NODE_TLS_REJECT_UNAUTHORIZED) {
          process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        }

        // Dynamically reload environment variables so newly saved .env changes apply instantly
        const liveEnv = loadEnv(server.config.mode || 'development', process.cwd(), '')
        for (const [key, value] of Object.entries(liveEnv)) {
          process.env[key] = value
        }

        let body = ''
        req.on('data', (chunk) => {
          body += chunk
        })

        req.on('end', async () => {
          try {
            let parsedBody: unknown = {}
            if (body) {
              try {
                parsedBody = JSON.parse(body)
              } catch {
                res.statusCode = 400
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify({ success: false, error: 'Invalid JSON payload' }))
                return
              }
            }

            const vercelReq = Object.assign(req, {
              body: parsedBody,
              query: {},
              cookies: {},
            })

            const vercelRes = Object.assign(res, {
              status(code: number) {
                res.statusCode = code
                return vercelRes
              },
              json(data: unknown) {
                res.setHeader('Content-Type', 'application/json')
                res.end(JSON.stringify(data))
                return vercelRes
              },
              send(data: unknown) {
                res.end(data)
                return vercelRes
              },
            })

            await contactHandler(vercelReq as any, vercelRes as any)
          } catch (err) {
            console.error('[Local Dev API Error]', err)
            res.statusCode = 500
            res.setHeader('Content-Type', 'application/json')
            res.end(JSON.stringify({ success: false, error: 'Internal server error in dev API' }))
          }
        })
      })
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Ensure non-VITE env variables like RESEND_API_KEY from .env are available in Node during dev
  for (const [key, value] of Object.entries(env)) {
    if (!process.env[key]) {
      process.env[key] = value
    }
  }

  return {
    plugins: [
      react(),
      tailwindcss(),
      localApiPlugin(),
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
  }
})
