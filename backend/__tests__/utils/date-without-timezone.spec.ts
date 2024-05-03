import { dateWithoutTimezone } from '../../src/utils/date-without-timezone';

describe('Date', () => {
  it('returns date without timezone', () => {
    const date = new Date();
    const convertedDate = dateWithoutTimezone(date);

    expect(convertedDate.endsWith('Z')).toBe(false);

    expect(date.toISOString().endsWith('Z')).toBe(true);
  });
});
