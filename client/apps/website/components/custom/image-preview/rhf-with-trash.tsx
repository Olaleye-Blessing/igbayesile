import React from "react";
import { FieldValues, UseFormReturn } from "react-hook-form";
import ImgPreviewWithTrash from "./with-trash";

export interface RHFImgPreviewWithTrashProps {
  images: File[];
  form: UseFormReturn<FieldValues, any, undefined>;
  name?: keyof FieldValues;
  callback?: (files: File[]) => void;
}

// Use with React Hook Form
export default function RHFImgPreviewWithTrash({
  images,
  form,
  name = "images",
  callback,
}: RHFImgPreviewWithTrashProps) {
  const removeImg = (file: File) => {
    const files = Array.from(images).filter((img) => img.name !== file.name);

    form.setValue(name, files);

    callback?.(files);
  };

  return (
    <output>
      <ul className="grid gap-4 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
        {Object.values(images).map((file) => {
          return (
            <ImgPreviewWithTrash
              key={file.name}
              image={file}
              onRemoveImg={removeImg}
            />
          );
        })}
      </ul>
    </output>
  );
}
