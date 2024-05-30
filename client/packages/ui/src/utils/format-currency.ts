export const formatCurrency = ({
  amount,
  locales = "en-US",
  options = {},
}: {
  amount: number;
  // locales?: Intl.LocalesArgument;
  locales?: any;
  options?: Intl.NumberFormatOptions;
}) => {
  options.minimumFractionDigits = options.maximumFractionDigits ?? 0;
  options.currency = options.currency ?? "USD";

  return new Intl.NumberFormat(locales, {
    ...options,
    style: "currency",
  }).format(amount);
};
