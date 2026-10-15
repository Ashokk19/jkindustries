/* ── Machine Video URLs for J.K. Industries Machinery ── */

/**
 * MACHINE_VIDEOS Map:
 * Key: machine slug (matches product.slug in src/data/products.ts or Supabase DB)
 * Value: single video URL string OR an array of video URL strings for multiple videos.
 *
 * Example (single video):
 *   'tape-roll-screen-printing-machine': 'https://.../TapeRollScreenPrinting.mp4'
 *
 * Example (multiple videos):
 *   'tape-roll-screen-printing-machine': [
 *     'https://.../TapeRollScreenPrinting_Overview.mp4',
 *     'https://.../TapeRollScreenPrinting_Operation.mp4'
 *   ]
 */
export const MACHINE_VIDEOS: Record<string, string | string[]> = {
  'flatbed-label-printing-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/FlatbedLabelPrinting.mp4',
  'flatbed-screen-printing-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/FlatbedScreenPrinting.mp4',
  'tape-roll-screen-printing-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/TapeRollScreenPrinting.mp4',
  'label-ultrasonic-cutting-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/UltrasonicLabelCutting.mp4',
};

/**
 * Returns an array of video URLs for a machine slug.
 * Always returns an array (empty if no video exists).
 */
export function getMachineVideos(slug: string): string[] {
  const item = MACHINE_VIDEOS[slug];
  if (!item) return [];
  return Array.isArray(item) ? item : [item];
}

/**
 * Returns the primary (first) video URL for a machine slug, or undefined.
 */
export function getMachineVideo(slug: string): string | undefined {
  const videos = getMachineVideos(slug);
  return videos[0];
}
