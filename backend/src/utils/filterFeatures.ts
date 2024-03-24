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

  constructor(query: FQuery<T>, queryObj = {}) {
    this.query = query;
    this.queryObj = queryObj;
  }

  filter(numberFields = [''], options = {}) {
    let filter: FilterQuery<T> = { ...this.queryObj };
    const excludedParams = ['page', 'sort', 'fields', 'limit', 'igbayesile'];
    excludedParams.forEach((param) => delete filter[param]);

    filter = parseNumFilter(filter, numberFields);

    this.query = this.query.find({ ...filter, ...options });

    return this;
  }

  fields() {
    const fields = (this.queryObj.fields || '-__v').replace(/,/g, ' ');

    this.query = this.query.select(fields);

    return this;
  }

  sort() {
    const sort = (this.queryObj.sort || 'createdAt').replace(/,/g, ' ');

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
