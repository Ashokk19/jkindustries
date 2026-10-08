/**
 * Machine Image Resolver
 *
 * Resolves machine images from the asset directory structure:
 *   src/assets/machines/<category>/<slug>/main.webp
 *
 * Uses Vite's import.meta.glob for static asset resolution.
 * Falls back to undefined if no image is found (components
 * should render MachinePlaceholder in that case).
 */

// Eagerly import all machine images at build time
const machineImages = import.meta.glob<{ default: string }>(
  '/src/assets/machines/**/*.{webp,jpg,jpeg,png,svg}',
  { eager: true }
);

/**
 * Get the main image URL for a machine by its category and slug.
 * Returns undefined if no matching image exists.
 */
export function getMachineImage(
  category: string,
  slug: string,
  filename: string = 'main'
): string | undefined {
  // Try common extensions
  const extensions = ['webp', 'jpg', 'jpeg', 'png', 'svg'];

  for (const ext of extensions) {
    const path = `/src/assets/machines/${category}/${slug}/${filename}.${ext}`;
    const mod = machineImages[path];
    if (mod) {
      return mod.default;
    }
  }

  return undefined;
}

/**
 * Get all gallery images for a machine (files named 01.*, 02.*, etc.)
 */
export function getMachineGallery(
  category: string,
  slug: string
): string[] {
  const prefix = `/src/assets/machines/${category}/${slug}/`;
  const gallery: { name: string; url: string }[] = [];

  for (const [path, mod] of Object.entries(machineImages)) {
    if (path.startsWith(prefix)) {
      const filename = path.replace(prefix, '').split('.')[0];
      // Skip "main" — it's the primary image, not gallery
      if (filename !== 'main') {
        gallery.push({ name: filename, url: mod.default });
      }
    }
  }

  // Sort by filename (01, 02, 03, etc.)
  gallery.sort((a, b) => a.name.localeCompare(b.name, undefined, { numeric: true }));
  return gallery.map((g) => g.url);
}
