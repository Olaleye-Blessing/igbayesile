export type TPaginatedFetch<Data = {}> = {
  total: number;
  page: number;
  limit: number;
} & Data;
