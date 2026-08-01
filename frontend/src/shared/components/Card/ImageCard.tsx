import { ReactNode } from 'react';

import { Card } from './Card';

type ImageCardProps = Readonly<{
  children?: ReactNode;
  imageSrc?: string;
  className?: string;
  altText?: string;
}>;

export function ImageCard({
  children,
  imageSrc,
  className,
  altText,
}: ImageCardProps) {
  return (
    <Card
      className={`overflow-hidden rounded-4xl w-full mx-4 ${className || ''}`}
    >
      {imageSrc && (
        <img
          src={imageSrc}
          alt={altText || 'Card'}
          className="w-full object-cover"
        />
      )}
      <div className="p-4 pb-6">{children}</div>
    </Card>
  );
}
