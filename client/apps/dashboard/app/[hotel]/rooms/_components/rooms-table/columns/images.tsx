/* eslint-disable @next/next/no-img-element */
import { Row } from "@tanstack/react-table";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@ui/components/ui/carousel";
import { ITableRoom } from "./types";

interface IImages {
  row: Row<ITableRoom>;
}

export default function Images({ row }: IImages) {
  const images: Array<string> = row.getValue("images");

  return (
    <Carousel className="w-32">
      <CarouselContent>
        {images.map((img) => (
          <CarouselItem key={img}>
            <figure className="rounded-lg overflow-hidden max-w-max">
              <img
                src={img}
                alt=""
                className="rounded-lg overflow-hidden w-[7.8rem]"
              />
            </figure>
          </CarouselItem>
        ))}
      </CarouselContent>
      <CarouselPrevious className=" w-6 h-6 left-[-1.5rem]" />
      <CarouselNext className=" w-6 h-6 right-[-1.3rem]" />
    </Carousel>
  );
}
