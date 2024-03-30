// convert filters like
/**
 * { ratings: 2, price: { gte: '500', lte: '900' }, room: { lt: '2' } }
 * to
 * { ratings: 2, price: { '$gte': '500', '$lte': '900' }, room: { '$lt': '2' } }
 */
export const parseNumFilter = <Filter extends object>(
  filter: Filter,
  keys: (keyof Filter)[],
) => {
  const body = { ...filter };

  keys.forEach((key) => {
    const val = filter[key];

    if (!val) return;

    if (typeof val !== 'object') {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      body[key] = Number(val) as any;

      return;
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newVal = {} as any;

    Object.entries(val).forEach(([_key, _val]) => {
      const newKey = `$${_key}` as keyof typeof newVal;
      newVal[newKey] = Number(_val);
    });

    body[key] = newVal;
  });

  return body;
};
