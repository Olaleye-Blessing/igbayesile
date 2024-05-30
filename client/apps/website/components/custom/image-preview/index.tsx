"use client";

import { cn } from "@ui/lib/utils";
import Image from "next/image";
import { useEffect, useState } from "react";

interface ImagesPreviewsProps {
  image: File;
  className?: string;
}

export default function ImagePreview({
  image,
  className,
}: ImagesPreviewsProps) {
  const [preview, setPreview] = useState<string | null>(null);

  useEffect(() => {
    if (!image) return;

    const imageUrl = URL.createObjectURL(image);

    setPreview(imageUrl);

    return () => {
      URL.revokeObjectURL(imageUrl);
    };
  }, [image]);

  if (!preview) return null;

  // TODO: Add a button such that when the button is clicked,
  // a modal with the full image view will pop up.
  return (
    <figure
      className={cn("flex items-center justify-center rounded-md", className)}
    >
      <Image
        src={preview}
        alt=""
        width={30}
        height={30}
        className="w-full h-full"
      />
    </figure>
  );
}
