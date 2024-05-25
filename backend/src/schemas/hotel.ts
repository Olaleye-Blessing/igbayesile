import { z } from 'zod';
import { nonEmptyStringSchema } from '@/utils/validate-data';

export const BaseSchema = z.object({
  name: nonEmptyStringSchema,
  description: nonEmptyStringSchema,
  // check country and state asynchroniously
  country: nonEmptyStringSchema,
  state: nonEmptyStringSchema,
  city: z.string(),
  location_description: nonEmptyStringSchema,
  amenities: z
    .string({ message: 'Provide at least 3 amenities' })
    .array()
    .min(3, { message: 'Provide at least 3 amenities' }),
  images: z
    .array(
      z.object({
        mimetype: z.string(),
        size: z.number(),
      }),
    )
    .min(3, { message: 'Provide minimum of 3 images' })
    .max(5, { message: 'Provide maximum of 5 images' })
    .superRefine((imgs, ctx) => {
      const supportedTypes = ['jpg', 'jpeg', 'png'];
      const oneMB = 1024 * 1024;

      if (
        imgs.some(
          (img) => !supportedTypes.some((type) => img.mimetype.endsWith(type)),
        )
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: `Image type not supported. Only ${supportedTypes.join(', ')} are supported!`,
          path: ['images'],
        });
      }

      if (imgs.some((img) => img.size > oneMB)) {
        ctx.addIssue({
          code: z.ZodIssueCode.too_big,
          maximum: oneMB,
          type: 'number',
          inclusive: true,
          message: 'Each image must be less than 1 MB',
        });
      }
    }),
});

export type IBaseHotel = z.infer<typeof BaseSchema>;
