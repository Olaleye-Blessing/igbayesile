export const convertDateToLocale = ({
  date,
  locales,
  options,
}: {
  date: Date | string | null;
  locales?: Intl.LocalesArgument;
  options?: Intl.DateTimeFormatOptions;
}) => {
  if (!date) return "-";

  if (typeof date === "string") date = new Date(date);

  if (!isValidDate) return "Invalid date";

  return date.toLocaleDateString(locales, {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
    ...options,
  });
};

const isValidDate = (date: Date) => isNaN(date as any);
