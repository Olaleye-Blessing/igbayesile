export interface ILoginAttempt {
  user?: string;
  lastAttempt: Date;
  cookie?: string;
  key: string;
  count: number;
  stage: number;
}
