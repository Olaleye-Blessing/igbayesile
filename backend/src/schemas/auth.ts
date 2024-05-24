import { nonEmptyStringSchema } from '@/utils/validate-data';
import { z } from 'zod';

const BaseSchema = z.object({
  name: nonEmptyStringSchema,
  email: z.string().email({ message: 'is invalid' }),
  password: z.string().min(5, { message: 'should be minimum of 5' }),
  passwordConfirm: z.string().min(5, { message: 'should be minimum of 5' }),
  role: z.enum(['guest', 'manager'], {
    message: "can only be 'guest' or 'manager'",
  }),
});

export type IBaseUser = z.infer<typeof BaseSchema>;

export const signUpShema = BaseSchema.superRefine(
  ({ password, passwordConfirm }, ctx) => {
    if (passwordConfirm !== password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: 'passwords did not match',
        path: ['confirmPassword'],
      });
    }
  },
);

export const loginShema = BaseSchema.pick({ email: true, password: true });

export const forgotPwdSchema = BaseSchema.pick({ email: true });

export const resetPwdSchema = z.object({
  token: z.string(),
});

export const updatePwdShema = BaseSchema.pick({
  password: true,
  passwordConfirm: true,
}).extend({
  currentPassword: nonEmptyStringSchema,
});

export const updateEmailSchema = BaseSchema.pick({ email: true });

export const updateAvatarSchema = z
  .object({
    mimetype: z.string(),
    size: z.number(),
  })
  .superRefine((data, ctx) => {
    const supportedTypes = ['jpg', 'jpeg', 'png'];
    if (!supportedTypes.some((type) => data.mimetype.endsWith(type))) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Image type not supported. Only ${supportedTypes.join(',')} are supported!`,
        path: ['mimetype'],
      });
    }

    const oneMb = 1024 * 1024;

    if (data.size >= oneMb) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: `Avatar must be less than 1 MB`,
        path: ['size'],
      });
    }
  });
