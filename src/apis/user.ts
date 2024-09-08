import { UserRoles } from 'Hooks/useRole';
import { Fetcher } from '../helpers/fetcher';

let Base_URL = process.env.REACT_APP_API_IAM;
Base_URL = Base_URL?.slice(0, Base_URL.length - 1);

export type ResetPasswordPayload = {
  password: string;
  currentPassword: string;
  persona: 'professionals' | 'users';
};

export const loginAPI = <T>(payload: {}) => {
  return Fetcher<T>(`${Base_URL}/auth/login`, 'POST', payload);
};

export const changePasswordAPI = <T>({
  password,
  currentPassword,
  persona
}: ResetPasswordPayload) => {
  return Fetcher<T>(`${Base_URL}/${persona}/update`, 'PATCH', {
    password,
    currentPassword
  });
};

export const resetPasswordAPI = <T>(
  token: string,
  payload: { password: string; confirmPassword: string }
) => {
  return Fetcher<T>(`${Base_URL}/misc/reset-password/${token}`, 'PATCH', payload);
};

export const setDeveloperInfoAPI = <T>(token: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL}/misc/reset-password/${token}`, 'PATCH', payload);
};

export const getAContractor = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/professionals/contractor/filter/id/${id}`, 'GET');
};

export const getProfessional = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/professionals/professional/${id}`, 'GET');
};

export const getUser = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/users/filter/id/${id}`, 'GET');
};

export const getAllProfessionalByType = <T>(role: UserRoles) => {
  return Fetcher<T>(`${Base_URL}/professionals/${role}/filter/all`, 'GET');
};

export const getAllUsersByType = <T>(role: UserRoles) => {
  return Fetcher<T>(`${Base_URL}/users/filter/all/${role}`, 'GET');
};

export const updateUserProfile = <T>(id: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL}/profile/update/${id}`, 'PATCH', payload);
};

export const updateUserPreferences = <T>(payload: {}) => {
  return Fetcher<T>(`${Base_URL}/profile/preference/update`, 'PATCH', payload);
};

export const getProfessionalOrManager = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/users/user-and-professional/${id}`);
};

export const ResumeDisabledManager = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/users/resume-disabled-manager?userId=${id}`, 'PATCH');
};

export const DisableManager = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/users/disable?userId=${id}`, 'PATCH');
};

export const ResumeSuspendedManager = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/users/resume-suspended-manager?userId=${id}`, 'PATCH');
};

export const SuspendManager = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/users/suspend?userId=${id}`, 'PATCH');
};

export const ResumeDisabledDeveloper = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/professionals/resume?professionalId=${id}`, 'PATCH');
};

export const DisableDeveloper = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/professionals/disable?professionalId=${id}`, 'PATCH');
};

export const ResumeSuspendedDeveloper = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/professionals/resume-suspended?professionalId=${id}`, 'PATCH');
};

export const SuspendDeveloper = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/professionals/suspend?professionalId=${id}`, 'PATCH');
};
