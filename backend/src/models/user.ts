import crypto from 'crypto';
import { Schema, model, Model } from 'mongoose';
import valdatior from 'validator';
import { hash, compare } from 'bcrypt';
import { IUser } from '@/interfaces/user';

interface IUserMethods {
  correctPassword(
    incomingPassword: string,
    dbPassword: string,
  ): Promise<boolean>;
  setPasswordResetToken(): string;
  credentialsChangedAfterTokenIssued(tokenIssuedAt: number): string;
}

interface UserModel extends Model<IUser, object, IUserMethods> {
  // myStaticMethod(): number;
}

const userSchema = new Schema<IUser>({
  name: {
    type: String,
    required: [true, 'Please provide your name'],
    trim: true,
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    validate: [valdatior.isEmail, 'Please provide a valid email'],
    unique: true,
  },
  emailChangedAt: Date,
  role: {
    type: String,
    required: [true, 'Please select the type of user you are.'],
    enum: {
      values: ['guest', 'manager'],
      message: 'You can only be a guest or manager',
    },
  },
  password: {
    type: String,
    required: [true, 'Please provide a password'],
    minLength: [5, 'Password is too short'],
    select: false,
  },
  passwordConfirm: {
    type: String,
    required: [true, 'Please confirm your password'],
    validate: [
      function validate(confirmPasword: string) {
        // TODO: Properly type `this`
        // @ts-expect-error This is not an error
        return this.password === confirmPasword;
      },
      `Passwords are not the same`,
    ],
    select: false,
  },
  createdAt: {
    type: Date,
    default: new Date(),
  },
  updatedAt: Date,
  passwordResetToken: {
    type: String,
    default: null,
  },
  passwordResetExpires: {
    type: Date,
    default: null,
  },
  passwordResetAt: Date,
});

userSchema.methods.correctPassword = async function (
  incomingPassword: string,
  dbPassword: string,
) {
  return await compare(incomingPassword, dbPassword);
};

userSchema.methods.setPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');
  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = new Date(Date.now() + 1 * 60 * 60 * 1000);

  return resetToken;
};

userSchema.methods.credentialsChangedAfterTokenIssued = function (
  tokenIssuedAt: number,
) {
  const fields: (keyof IUser)[] = ['passwordResetAt', 'emailChangedAt'];

  const fieldValues = fields.map((field) => this[field]).filter((val) => val);

  return fieldValues.some((val) => val.getTime() > tokenIssuedAt * 1000);
};

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await hash(this.password, 12);
  this.passwordConfirm = '';

  next();
});

userSchema.pre('save', async function (next) {
  if (this.isNew) return next();

  if (this.isModified('password')) {
    this.passwordResetAt = new Date(Date.now() - 1000);
  } else if (this.isModified('email')) {
    this.emailChangedAt = new Date(Date.now() - 1000);
  }

  next();
});

const User = model<IUser, UserModel>('User', userSchema);

export default User;
