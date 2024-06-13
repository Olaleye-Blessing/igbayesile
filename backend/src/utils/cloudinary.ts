import {
  DeliveryType,
  UploadApiOptions,
  UploadApiResponse,
  UploadResponseCallback,
  v2 as cloudinary,
} from 'cloudinary';

export const uploadCloudinaryAssest = async ({
  uri,
  options,
  callback,
}: {
  uri: string;
  options?: UploadApiOptions;
  callback?: UploadResponseCallback;
}): Promise<UploadApiResponse> => {
  return cloudinary.uploader.upload(
    uri,
    {
      ...options,
      tags: (process.env.NODE_ENV || 'development').toLowerCase(),
    },
    callback,
  );
};

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
