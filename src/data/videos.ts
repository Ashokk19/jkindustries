/* ── Machine Video URLs for J.K. Industries Machinery ── */

export const MACHINE_VIDEOS: Record<string, string> = {
  'flatbed-label-printing-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/FlatbedLabelPrinting.mp4',
  'flatbed-screen-printing-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/FlatbedScreenPrinting.mp4',
  'tape-roll-screen-printing-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/TapeRollScreenPrinting.mp4',
  'label-ultrasonic-cutting-machine':
    'https://rrhxvbvwoflmcuambkic.supabase.co/storage/v1/object/public/machine-videos/UltrasonicLabelCutting.mp4',
};

export function getMachineVideo(slug: string): string | undefined {
  return MACHINE_VIDEOS[slug];
}
