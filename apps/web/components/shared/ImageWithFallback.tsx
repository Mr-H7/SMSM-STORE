"use client";

import Image, { ImageProps } from "next/image";
import { useEffect, useState } from "react";

type Props = Omit<ImageProps, "src" | "alt"> & {
  src: string;
  fallbackSrc: string;
  alt: string;
};

export function ImageWithFallback({ src, fallbackSrc, alt, onError, ...props }: Props) {
  const [currentSrc, setCurrentSrc] = useState(src);

  useEffect(() => {
    setCurrentSrc(src);
  }, [src]);

  return (
    <Image
      {...props}
      src={currentSrc}
      alt={alt}
      onError={(event) => {
        if (currentSrc !== fallbackSrc) setCurrentSrc(fallbackSrc);
        onError?.(event);
      }}
    />
  );
}
