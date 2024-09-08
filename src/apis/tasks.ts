import { Fetcher } from '../helpers/fetcher';

export type ResetPasswordPayload = {
  password: string;
  currentPassword: string;
  persona: 'professionals' | 'users';
};

export type ActivateTaskReq = {
  taskInputs: { taskId: string }[];
};

const { REACT_APP_API_PROJECTS: Base_URL_API } = process.env;

export const createTask = <T>(payload: {}) => {
  return Fetcher<T>(`${Base_URL_API}tasks/add`, 'POST', payload);
};

export const editTask = <T>(id: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL_API}tasks/task/${id}`, 'PATCH', payload);
};

export const deleteTask = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}tasks/task/${id}`, 'DELETE');
};

export const getTasks = <T>() => {
  return Fetcher<T>(`${Base_URL_API}tasks`);
};

export const getTasksByProject = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}tasks/project-tasks?projectId=${id}`);
};

export const getOneTasks = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}tasks?type=single&id=${id}`);
};

export const createSubTask = <T>(payload: {}) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/add`, 'POST', payload);
};

export const deleteSubTask = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/subTask/${id}`, 'DELETE');
};

export const editSubTask = <T>(id: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/subTask/${id}`, 'PATCH', payload);
};

export const getSubTasks = <T>() => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks`);
};

export const getOneSubTask = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/subTask/${id}`);
};

export const requestSubTaskChange = <T>(id: string, body: {}) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/subTask/requestUpdate/${id}`, 'PATCH', body);
};

export const cancelEditSubTaskReq = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/subTask/cancelUpdateRequest/${id}`, 'PATCH', {});
};

export const cancelDeleteSubTaskReq = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/subTask/cancelDeleteRequest/${id}`, 'PATCH', {});
};

export const requestSubTaskDeletion = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/subTask/requestDelete/${id}`, 'PATCH');
};

export const rejectSubTaskChange = <T>(id: string, reason: string) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/subTask/rejectUpdate/${id}`, 'PATCH', { reason });
};

export const rejectSubTaskDeletion = <T>(id: string, reason: string) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/subTask/requestDelete/${id}`, 'PATCH', { reason });
};

export const getSubTasksByStatus = <T>(status: string) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/filter/status/${status}`);
};

export const getSubTasksByDates = <T>({
  startDate,
  endDate
}: {
  startDate: Date;
  endDate: Date;
}) => {
  return Fetcher<T>(`${Base_URL_API}sub-tasks/dates/${startDate}/${endDate}`);
};

export const getTasksByPOW = <T>(powId: string) => {
  return Fetcher<T>(`${Base_URL_API}tasks?type=pow&id=${powId}`);
};

export const activateTasks = <T>(payload: ActivateTaskReq) => {
  return Fetcher<T>(`${Base_URL_API}tasks/activate`, 'PATCH', payload);
};
