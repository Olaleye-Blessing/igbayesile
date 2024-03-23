export interface IPage<Params = {}, Search = {}> {
  params: Params;
  searchParams: Search;
}
