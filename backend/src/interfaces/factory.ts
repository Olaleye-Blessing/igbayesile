import { Model, PopulateOptions } from 'mongoose';

export interface ICache {
  maxAge: number;
  directives?: string[];
}

export interface IFindAll<IDoc> {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  model: Model<IDoc, any>;
  populateOpts?: PopulateOptions[];
  // Check MDN for response directives: https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Cache-Control#response_directives
  cache?: ICache;
}
