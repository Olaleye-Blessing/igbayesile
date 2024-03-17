import { Schema, model } from 'mongoose';
import valdatior from 'validator';
import { hash } from 'bcrypt';
import { IUser } from '@/interfaces/user';

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
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await hash(this.password, 12);
  this.passwordConfirm = '';

  next();
});

const User = model('User', userSchema);

export default User;
