import { Fetcher } from '../helpers/fetcher';

export const getAllCurrencies = <T>() => {
  return Fetcher<T>('https://openexchangerates.org/api/currencies.json?show_alternative=1');
};
