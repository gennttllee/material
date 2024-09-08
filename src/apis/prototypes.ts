import { Fetcher } from '../helpers/fetcher';

const { REACT_APP_API_PROJECTS: Base_URL_API } = process.env;

export const createProtoType = <T>(payload: {}) => {
  return Fetcher<T>(`${Base_URL_API}prototypes/add`, 'POST', payload);
};

export const editProtoType = <T>(id: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL_API}prototypes/update/${id}`, 'PATCH', payload);
};

export const deleteProtoType = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}prototypes/delete/${id}`, 'DELETE');
};

export const getAllPrototypes = <T>() => {
  return Fetcher<T>(`${Base_URL_API}prototypes/`);
};

export const getOnePrototypes = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}prototypes/find/${id}`);
};

export const protoTypeAddItem = <T>(id: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL_API}prototypes/add-item/${id}`, 'POST', payload);
};

export const protoTypeRemoveItem = <T>({
  protyopeId,
  itemId
}: {
  protyopeId: string;
  itemId: string;
}) => {
  return Fetcher<T>(`${Base_URL_API}prototypes/remove-item/${protyopeId}/item/${itemId}`, 'DELETE');
};
