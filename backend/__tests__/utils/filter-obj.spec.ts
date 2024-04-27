// TODO: Find a way to use baseUrl
import { filterObj } from '../../src/utils/filter-obj';

interface IBody {
  name: string | undefined;
  age: number;
  alive: true;
}
describe('filter objects', () => {
  it('should return only the allowed keys', () => {
    const body: IBody = { name: 'Blessing', age: 12, alive: true };
    const allowedKeys: (keyof IBody)[] = ['age', 'name'];

    const returnedBody: Partial<IBody> = { ...body };
    delete returnedBody.alive;

    expect(filterObj(body, allowedKeys)).toEqual(returnedBody);
  });

  it('returns the allowed keys even if their value is undefined', () => {
    const body = { name: undefined, age: 12, alive: true };
    const allowedKeys: (keyof IBody)[] = ['age', 'name'];

    const returnedBody: Partial<typeof body> = { ...body };
    delete returnedBody.alive;

    expect(filterObj(body, allowedKeys)).toEqual(returnedBody);
  });
});
