import { UseFormReturn } from "react-hook-form";
import RHFImgPreviewWithTrash from "@website/components/custom/image-preview/rhf-with-trash";

interface ImagesPreviewProps {
  images: File[];
  form: UseFormReturn<any, any, undefined>;
}

export default function ImagesPreview({ images, form }: ImagesPreviewProps) {
  return (
    <RHFImgPreviewWithTrash
      images={images}
      form={form}
      callback={(files) => {
        files.length >= 3
          ? form.clearErrors("images")
          : form.setError("images", { type: "required" });
      }}
    />
  );
}
