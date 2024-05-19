import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().min(3000),
  MONGO_DB_URL: z.string().url(),

  REDIS_URL: z.string().url(),

  JWT_LOGIN_SECRET: z.string(),
  JWT_LOGGED_IN_EXPIRES: z.string(),
  JWT_REFRESH_LOGIN_SECRET: z.string(),
  JWT_REFRESH_LOGIN_EXPIRES: z.string(),
  JWT_LOGGEDIN_DEVICE_SECRET: z.string(),
  JWT_DEVICE_SECRET: z.string(),

  NODE_ENV: z
    .union([
      z.literal('development'),
      z.literal('test'),
      z.literal('production'),
    ])
    .default('development'),

  FRONTEND_URL: z.string(),

  CLOUDINARY_CLOUD_NAME: z.string(),
  CLOUDINARY_API_KEY: z.string(),
  CLOUDINARY_API_SECRET: z.string(),

  PAYSTACK_PUBLIC_KEY: z.string(),
  PAYSTACK_SECRET_KEY: z.string(),

  RESEND_KEY: z.string(),
});

export type Environment = z.infer<typeof envSchema>;

export const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
  console.log('There is an error with the server environment variables');
  console.error(parsedEnv.error.issues);
  process.exit(1);
}

export const envData = parsedEnv.data;
