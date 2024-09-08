import { Fetcher } from '../helpers/fetcher';

const { REACT_APP_API_PROJECTS: Base_URL_API } = process.env;

export const recordExpenditure = <T>(payload: {}) => {
  return Fetcher<T>(`${Base_URL_API}financials/expenditure/add`, 'PATCH', payload);
};
