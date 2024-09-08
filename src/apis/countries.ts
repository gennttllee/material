import { Fetcher } from 'helpers/fetcher';
import { Country } from 'react-app-env';

export const getStates = <T>(country: string) => {
  return Fetcher<T>(`https://countriesnow.space/api/v0.1/countries/states`, 'POST', { country });
};

export const getCities = <T>(payload: { country: string; state: string }) => {
  return Fetcher<T>(`https://countriesnow.space/api/v0.1/countries/state/cities`, 'POST', payload);
};

export const getAllCountries = () => {
  return Fetcher<Country[]>('https://restcountries.com/v3.1/all?fields=name,flag,cca2');
};
