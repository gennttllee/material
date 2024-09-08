import { Fetcher } from '../helpers/fetcher';

const { REACT_APP_API_PROJECTS: Base_URL } = process.env;

export const createPow = <T>(payload: { name: string; projectId: string; bidId?: string }) => {
  return Fetcher<T>(`${Base_URL}pows/add`, 'POST', payload);
};

export type BidDocumentType = {
  name: string;
  key: string;
  meta: {
    size: number;
    type: string;
    name: string;
  };
};

export type ExpressSchema = {
  name: string;
  projectId: string;
  professional: string;
  type: string;
  description: string;
  docs: BidDocumentType[];
};
export const createExpressPow = <T>(payload: ExpressSchema) => {
  return Fetcher<T>(`${Base_URL}pows/add-express-pow`, 'POST', payload);
};
export const editPow = <T>(id: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL}pows/${id}`, 'PATCH', payload);
};

export const deletePow = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}pows/${id}`, 'DELETE');
};

export const getPowsByProject = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}pows/project/${id}`);
};

export const getOnePow = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}pows/${id}`);
};
