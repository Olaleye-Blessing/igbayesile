export interface ICountryUnicode {
  name: string;
  iso2: string;
  iso3: string;
  unicodeFlag: string;
}

export interface IState {
  name: string;
  state_code: string;
}

export interface IResult<T> {
  error: boolean;
  msg: string;
  data: T;
}
