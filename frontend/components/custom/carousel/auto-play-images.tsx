/* eslint-disable @next/next/no-img-element */
"use client";

import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface AutoPlayImagesProps {
  images: string[];
  className?: string;
  imgContClassName?: string;
  nextClassName?: string;
  prevClassName?: string;
}

export default function AutoPlayImages({
  images,
  className,
  imgContClassName,
  nextClassName,
  prevClassName,
}: AutoPlayImagesProps) {
  return (
    <Carousel
      plugins={[
        Autoplay({
          delay: 2000,
        }),
      ]}
      className={className}
    >
      <CarouselContent>
        {images.map((img) => (
          <CarouselItem key={img} className="">
            <figure
              className={cn(
                "flex items-center justify-center max-h-[30rem] overflow-hidden rounded-md",
                imgContClassName,
              )}
            >
              <img src={img} alt="" className="rounded-md overflow-hidden" />
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className={prevClassName} />
      <CarouselNext className={nextClassName} />
    </Carousel>
  );
}
