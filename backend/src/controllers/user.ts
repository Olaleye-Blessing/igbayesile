import User from '@/models/user';
import catchAsync from '@/utils/catchAsync';

export const userExists = async (userId: string) => {
  try {
    return Boolean(await User.exists({ _id: userId }));
  } catch (error) {
    return false;
  }
};

export const getMe = catchAsync(async (req, res) => {
  console.log(req.query);

  const fields = ((req.query?.fields as string)?.split(',') || []) as string[];
  const user = req.user!;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let formattedUser = {} as { [key: string]: any };

  if (fields.length > 0) {
    fields.forEach((field) => {
      formattedUser[field] = user[field as keyof typeof user];
    });
  } else {
    delete user.passwordResetAt;
    delete user.passwordResetExpires;
    delete user.passwordResetExpires;

    formattedUser = { ...user };
  }

  return res.status(200).json({
    status: 'success',
    data: {
      user: formattedUser,
    },
  });
});
