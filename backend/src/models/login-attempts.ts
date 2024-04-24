import { ILoginAttempt } from '@/interfaces/login-attempt';
import { model, Schema } from 'mongoose';

const schema = new Schema<ILoginAttempt>({
  user: {
    // type: Schema.ObjectId,
    // ref: 'User',
    type: String,
    default: null,
  },
  lastAttempt: {
    type: Date,
  },
  cookie: {
    type: String,
  },
  key: {
    type: String,
  },
  count: {
    type: Number,
    default: 0,
  },
  stage: {
    type: Number,
    default: 0,
  },
});

const LoginAttempt = model('LoginAttempt', schema, 'LoginAttempts');

export default LoginAttempt;
