export type IPaginatedResult<Data> = {
  limit: number;
  page: number;
  total: number;
  results: Data[];
};
