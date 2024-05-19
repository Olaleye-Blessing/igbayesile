import { Resend } from 'resend';
import type { CreateEmailRequestOptions, Payload } from './interface';

const resend = new Resend(process.env.RESEND_KEY);

export const sendEmail = async (
  payload: Payload,
  options?: CreateEmailRequestOptions,
) => {
  if (!payload.type) payload.type = 'noreply';

  const { data, error } = await resend.emails.send(
    {
      from: `Igbayesile <${payload.type}@igbayesile.xyz>`,
      ...payload,
    },
    options,
  );

  return { data, error };
};
