import { FilterQuery, QueryWithHelpers } from 'mongoose';
import { parseNumFilter } from './parseNumFilter';

interface QueryObj {
  sort?: string;
  fields?: string;
  page?: string;
  limit?: string;
}

type FQuery<T> = QueryWithHelpers<T[], T, object, T, 'find'>;

export default class FilterFeatures<T> {
  query: FQuery<T>;
  queryObj: QueryObj & object;
  queryFilter: QueryObj & object = {};

  constructor(query: FQuery<T>, queryObj = {}) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter() {
    let filter: FilterQuery<T> = { ...this.queryObj };
    const excludedParams = ['page', 'sort', 'fields', 'limit', 'igbayesile'];

    filter = parseNumFilter(filter, filter.igbayesile?.filterNumKeys || []);

    excludedParams.forEach((param) => delete filter[param]);

    this.queryFilter = { ...filter };
    this.query = this.query.find({ ...filter });

    return this;
  }

  fields() {
    let fields = this.queryObj.fields || '-__v';

    if (typeof fields === 'object') fields = (fields as string[]).join(',');

    fields = fields.replace(/,/g, ' ');

    this.query = this.query.select(fields);

    return this;
  }

  sort() {
    let sort = this.queryObj.sort || 'createdAt';
    if (typeof sort === 'object') sort = (sort as string[]).join(',');

    sort = sort.replace(/,/g, ' ');

    this.query = this.query.sort(sort);

    return this;
  }

  paginate() {
    const page = +(this.queryObj.page || 1);
    const perPage = +(this.queryObj.limit || 10);
    const skip = (page - 1) * perPage;

    this.query = this.query.skip(skip).limit(perPage);

    return this;
  }
}
