import React from "react";
import ImagePreview from ".";
import { Trash } from "lucide-react";

export interface ImgPreviewWithTrashProps {
  image: File;
  onRemoveImg: (img: File) => void;
}

export default function ImgPreviewWithTrash({
  image,
  onRemoveImg,
}: ImgPreviewWithTrashProps) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => onRemoveImg(image)}
        className="bg-red-200 text-red-800 absolute right-2 top-2 w-8 h-8 flex items-center justify-center p-1 rounded-full"
      >
        <Trash className="w-4" />
      </button>
      <ImagePreview
        image={image}
        className="max-w-96 max-h-80 overflow-hidden"
      />
    </div>
  );
}
