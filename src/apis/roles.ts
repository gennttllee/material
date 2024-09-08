import { Fetcher } from '../helpers/fetcher';

let Base_URL = process.env.REACT_APP_API_IAM;
Base_URL = Base_URL?.slice(0, Base_URL.length - 1);

export const getOneRoleById = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/roles/${id}`, 'GET');
};
