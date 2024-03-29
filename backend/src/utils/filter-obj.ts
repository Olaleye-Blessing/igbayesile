export const filterObj = <Data extends object>(
  data: Data,
  allowedKeys: (keyof Data)[],
) => {
  const body = {
    ...data,
  };

  Object.keys(data).forEach((key) => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    if (!allowedKeys.includes(key as keyof Data)) delete (body as any)[key];
  });

  return body;
};
