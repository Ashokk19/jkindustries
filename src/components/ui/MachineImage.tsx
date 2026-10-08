import type { Product } from '@/types/product';
import { getMachineImage } from '@/utils/imageResolver';
import MachinePlaceholder from './MachinePlaceholder';

interface MachineImageProps {
  product: Product;
  className?: string;
  aspectRatio?: string;
  imgClassName?: string;
}

/**
 * Renders a machine image, or falls back to MachinePlaceholder.
 * Image resolution is automatic via imageResolver.
 */
export default function MachineImage({
  product,
  className = '',
  aspectRatio = '16/10',
  imgClassName = 'w-full h-full object-contain',
}: MachineImageProps) {
  const imageUrl = getMachineImage(product.category, product.slug);

  if (!imageUrl) {
    return (
      <MachinePlaceholder
        machineName={product.name}
        className={className}
        aspectRatio={aspectRatio}
      />
    );
  }

  // Support both CSS ratio strings ("16/10") and Tailwind aspect classes ("aspect-[16/10]", "aspect-square")
  const isTailwindAspect = aspectRatio ? aspectRatio.startsWith('aspect-') : false;
  const styleAspect = isTailwindAspect ? undefined : aspectRatio || undefined;
  const aspectClass = isTailwindAspect ? aspectRatio : '';

  return (
    <div
      className={`overflow-hidden bg-white flex items-center justify-center ${aspectClass} ${className}`}
      style={styleAspect ? { aspectRatio: styleAspect } : undefined}
    >
      <img
        src={imageUrl}
        alt={product.name}
        className={imgClassName}
        loading="lazy"
      />
    </div>
  );
}
