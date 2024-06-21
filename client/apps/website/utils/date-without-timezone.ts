// https://dev.to/shubhampatilsd/removing-timezones-from-dates-in-javascript-46ah

export const dateWithoutTimezone = (date: Date) => {
  const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
  const withoutTimezone = new Date(date.valueOf() - tzoffset)
    .toISOString()
    .slice(0, -1);

  return withoutTimezone;
};
