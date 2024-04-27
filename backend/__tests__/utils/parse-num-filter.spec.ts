import { parseNumFilter } from '../../src/utils/parseNumFilter';

describe('parseNumFilter', () => {
  it('transforms query object to mogodb filter object type', () => {
    const filter = {
      ratings: 2,
      price: { gte: '500', lte: '900' },
      room: { lt: '2' },
    };

    const filteredBody = parseNumFilter(filter, ['ratings', 'price', 'room']);
    const expectedResult = {
      ratings: 2,
      price: { $gte: 500, $lte: 900 },
      room: { $lt: 2 },
    };

    expect(filteredBody).toEqual(expectedResult);
  });

  it('leaves non-number unchanged', () => {
    const filter = {
      ratings: 2,
      price: { gte: '500', lte: '900' },
      room: { lt: '2' },
      name: 'Blessing',
    };

    const filteredBody = parseNumFilter(filter, ['ratings', 'price', 'room']);

    const expectedResult = {
      ratings: 2,
      price: { $gte: 500, $lte: 900 },
      room: { $lt: 2 },
      name: 'Blessing',
    };

    expect(filteredBody).toEqual(expectedResult);
  });
});
