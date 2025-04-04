// src/app/_components/blog-image.tsx
"use client";

import Image from "next/image";

export default function BlogImage({
  src,
  alt,
  className,
  sizes,
  priority = false,
  fill = false,
  width,
  height
}: {
  src: string;
  alt: string;
  className?: string;
  sizes?: string;
  priority?: boolean;
  fill?: boolean;
  width?: number;
  height?: number;
}) {
  return (
    <Image
      src={src}
      alt={alt}
      fill={fill}
      width={width}
      height={height}
      className={className}
      sizes={sizes}
      priority={priority}
      onError={(e) => {
        const target = e.target as HTMLImageElement;
        target.onerror = null;
        target.src = "/assets/blog/default-cover.jpg";
      }}
    />
  );
}