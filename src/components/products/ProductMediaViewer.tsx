import { useState, useEffect, useRef, useMemo } from 'react';
import type { Product } from '@/types/product';
import MachineImage from '@/components/ui/MachineImage';
import { getMachineImage, getMachineGallery } from '@/utils/imageResolver';
import { getMachineVideos } from '@/data/videos';

export interface ProductMediaViewerProps {
  product: Product;
  viewportHeightClass?: string;
  footnoteLeft?: string;
  footnoteRight?: string;
  className?: string;
}

type ActiveMedia =
  | { type: 'video'; index: number }
  | { type: 'image'; index: number };

/**
 * Interactive Media Viewer (Machine Video + Image Gallery)
 *
 * Displays machine video by default if available (with autoplay, loop, muted, controls).
 * Supports single or multiple videos per machine.
 * Displays mini image thumbnails at the bottom (video thumbnails + photos).
 * Clicking any secondary image thumbnail switches the main viewport to that photo.
 * Clicking any video thumbnail switches back to that video.
 */
export default function ProductMediaViewer({
  product,
  viewportHeightClass = 'h-[360px] md:h-[460px]',
  footnoteLeft = 'PRECISION FABRICATION: TIRUPUR FACILITY',
  footnoteRight = '100% PRE-DISPATCH TRIAL RUN',
  className = '',
}: ProductMediaViewerProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const videos = getMachineVideos(product.slug);
  const mainImage = getMachineImage(product.category, product.slug);
  const galleryImages = getMachineGallery(product.category, product.slug);

  // Build the list of all image thumbnails (main image first, followed by gallery)
  const allImages = useMemo(() => {
    const imgs: string[] = [];
    if (mainImage) imgs.push(mainImage);
    imgs.push(...galleryImages);
    return imgs;
  }, [mainImage, galleryImages]);

  // Active media state: video (by index) or image (by index)
  const [activeMedia, setActiveMedia] = useState<ActiveMedia>(() =>
    videos.length > 0
      ? { type: 'video', index: 0 }
      : { type: 'image', index: 0 }
  );

  // Reset to first video (if available) or first image whenever product changes
  useEffect(() => {
    setActiveMedia(
      videos.length > 0
        ? { type: 'video', index: 0 }
        : { type: 'image', index: 0 }
    );
  }, [product.slug, videos.length]);

  const activeVideoUrl =
    activeMedia.type === 'video' ? videos[activeMedia.index] : undefined;

  // Ensure video plays when switching back to video view or changing videos
  useEffect(() => {
    if (activeMedia.type === 'video' && videoRef.current) {
      videoRef.current.currentTime = 0;
      videoRef.current.play().catch(() => {
        // Handle browser autoplay policy gracefully
      });
    }
  }, [activeMedia, activeVideoUrl]);

  // Show thumbnails if there is at least 1 video OR multiple images
  const showThumbnails = Boolean(videos.length > 0 || allImages.length > 1);

  return (
    <div
      className={`lg:col-span-7 bg-[var(--color-surface-container)] border-b lg:border-b-0 lg:border-r border-[var(--color-surface-variant)] p-[var(--spacing-md)] flex flex-col justify-between ${className}`}
    >
      {/* Main Media Area */}
      <div
        className={`relative w-full ${viewportHeightClass} bg-white border border-[var(--color-surface-variant)] overflow-hidden flex items-center justify-center`}
      >
        {activeMedia.type === 'video' && activeVideoUrl ? (
          <video
            ref={videoRef}
            key={activeVideoUrl}
            src={activeVideoUrl}
            autoPlay
            loop
            muted
            controls
            playsInline
            className="w-full h-full object-contain bg-black"
          />
        ) : activeMedia.type === 'image' && allImages[activeMedia.index] ? (
          <img
            src={allImages[activeMedia.index]}
            alt={`${product.name} — view ${activeMedia.index + 1}`}
            className="w-full h-full object-contain p-4"
          />
        ) : (
          <MachineImage
            product={product}
            className="w-full h-full bg-white"
            imgClassName="w-full h-full object-contain p-4"
          />
        )}
      </div>

      {/* Thumbnail Strip */}
      {showThumbnails && (
        <div className="mt-4 flex flex-wrap gap-2">
          {/* Video thumbnail buttons (for each video) */}
          {videos.map((vidUrl, vIdx) => {
            const isActive =
              activeMedia.type === 'video' && activeMedia.index === vIdx;
            const label = videos.length > 1 ? `Video ${vIdx + 1}` : 'Video';
            return (
              <button
                type="button"
                key={`video-${vIdx}-${vidUrl}`}
                onClick={() => setActiveMedia({ type: 'video', index: vIdx })}
                className={`relative w-16 h-16 sm:w-20 sm:h-20 bg-black border-2 overflow-hidden flex items-center justify-center transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30'
                    : 'border-[var(--color-surface-variant)] hover:border-[var(--color-primary)]/50'
                }`}
                title={`Play ${label}`}
                aria-label={`Play ${label}`}
              >
                {mainImage && (
                  <img
                    src={mainImage}
                    alt={`${label} poster`}
                    className="w-full h-full object-contain p-1 opacity-60"
                  />
                )}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-[var(--color-primary)] flex items-center justify-center shadow-lg">
                    <span className="material-symbols-outlined text-[18px] sm:text-[20px] text-white ml-0.5">
                      play_arrow
                    </span>
                  </div>
                </div>
                <span className="absolute bottom-0.5 left-0.5 right-0.5 text-center font-label-badge text-[8px] sm:text-[9px] uppercase tracking-wider text-white bg-black/75 px-1 py-0.5 truncate">
                  {label}
                </span>
              </button>
            );
          })}

          {/* Image thumbnails */}
          {allImages.map((img, idx) => {
            const isActive =
              activeMedia.type === 'image' && activeMedia.index === idx;
            return (
              <button
                type="button"
                key={`img-${idx}`}
                onClick={() => setActiveMedia({ type: 'image', index: idx })}
                className={`w-16 h-16 sm:w-20 sm:h-20 bg-white border-2 overflow-hidden flex items-center justify-center p-1 transition-all flex-shrink-0 cursor-pointer ${
                  isActive
                    ? 'border-[var(--color-primary)] ring-2 ring-[var(--color-primary)]/30'
                    : 'border-[var(--color-surface-variant)] hover:border-[var(--color-primary)]/50'
                }`}
                title={`View image ${idx + 1}`}
                aria-label={`View image ${idx + 1}`}
              >
                <img
                  src={img}
                  alt={`${product.name} — thumbnail ${idx + 1}`}
                  className="w-full h-full object-contain"
                />
              </button>
            );
          })}
        </div>
      )}

      {/* Viewport Footnote */}
      <div className="flex items-center justify-between pt-[var(--spacing-sm)] mt-2">
        <span className="font-label-technical text-[var(--color-secondary)] uppercase tracking-wider">
          {footnoteLeft}
        </span>
        <span className="font-label-technical text-[var(--color-primary)] uppercase">
          {footnoteRight}
        </span>
      </div>
    </div>
  );
}
