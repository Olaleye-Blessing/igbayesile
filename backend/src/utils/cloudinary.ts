import { DeliveryType } from 'cloudinary';
import { v2 as cloudinary } from 'cloudinary';

export const extractCloudinaryImgPublicId = (img: string) => {
  const parts = img.split('/');
  const publicId = parts.at(-1)?.split('.')[0];

  return publicId;
};

export const deleteCloudinaryImg = async (
  publicId: string,
  options?: {
    type?: DeliveryType;
    invalidate?: boolean;
  },
) => {
  await cloudinary.uploader.destroy(publicId, {
    ...options,
    resource_type: 'image',
  });
};
