interface Attachment {
  /** Content of an attached file. */
  content?: string | Buffer;
  /** Name of attached file. */
  filename?: string | false | undefined;
  /** Path where the attachment file is hosted */
  path?: string;
}

type Tag = {
  /**
   * The name of the email tag. It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-). It can contain no more than 256 characters.
   */
  name: string;
  /**
   * The value of the email tag. It can only contain ASCII letters (a–z, A–Z), numbers (0–9), underscores (_), or dashes (-). It can contain no more than 256 characters.
   */
  value: string;
};

export interface Payload {
  // https://resend.com/docs/api-reference/emails/send-email#body-parameters
  type?: 'onboarding' | 'noreply';
  to: string | string[];
  subject: string;
  html: string;
  attachments?: Attachment[];
  bcc?: string | string[];
  cc?: string | string[];
  headers?: Record<string, string>;
  reply_to?: string | string[];
  tags?: Tag[];
}

interface PostOptions {
  query?: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
  };
}

export interface CreateEmailRequestOptions extends PostOptions {}
