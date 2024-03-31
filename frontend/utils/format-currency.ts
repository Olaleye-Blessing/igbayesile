export const formatCurrency = ({
  amount,
  locales = "en-US",
  options = {},
}: {
  amount: number;
  locales?: Intl.LocalesArgument;
  options?: Intl.NumberFormatOptions;
}) => {
  if (!options.trailingZeroDisplay)
    options.trailingZeroDisplay = "stripIfInteger";
  if (!options.currency) options.currency = "USD";

  return new Intl.NumberFormat(locales, {
    ...options,
    style: "currency",
  }).format(amount);
};
