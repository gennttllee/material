import { RsvpStatus } from '../types';
import { UserRoles } from 'Hooks/useRole';
import { Fetcher } from '../helpers/fetcher';

let Base_URL = process.env.REACT_APP_API_PROJECTS;
Base_URL = Base_URL?.slice(0, Base_URL.length - 1);

export const createProjectBrief = <T>(payload: {}) => {
  return Fetcher<T>(`${Base_URL}/projects/briefs`, 'POST', payload);
};

export const updateProjectBrief = <T>(id: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL}/projects/briefs/${id}`, 'PATCH', payload);
};

export const getOneProjectBrief = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/projects/briefs/${id}`, 'GET');
};

export const deleteProjectBrief = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/projects/briefs/${id}`, 'DELETE');
};

export const getProjectBids = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/bids/project/${id}`);
};

export const invitationApi = <T>(id: string, rsvpStatus: RsvpStatus) => {
  return Fetcher<T>(`${Base_URL}/bids/invites/${id}/manageRsvp`, 'PATCH', {
    rsvpStatus
  });
};

export const submitDocsApi = <T>(payload: {}) => {
  return Fetcher<T>(`${Base_URL}/submissions/add`, 'POST', payload);
};

export const getSubmitDocsApi = <T>(id: string) => {
  return Fetcher<T>(`${Base_URL}/submissions/bid/${id}`);
};

export const submitAdditionalDocsApi = <T>(id: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL}/submissions/${id}`, 'PATCH', payload);
};

export const updateBidInvite = <T>(bidId: string, bidWinnerId: string, payload: {}) => {
  const link = `bids/manage-winner-invites/${bidId}/winning-bid/${bidWinnerId}`;
  return Fetcher<T>(`${Base_URL}/${link}`, 'PATCH', payload);
};

export const updateBid = <T>(id: string, payload: {}) => {
  return Fetcher<T>(`${Base_URL}/bids/${id}`, 'PATCH', payload);
};
//projects/briefs/persona/invite
export const addProjectManagerToTeam = <T>(payload: {
  projectId: string;
  team: { role: string; id: string }[];
}) => {
  return Fetcher<T>(`${Base_URL}/projects/briefs/team/add`, 'PATCH', payload);
};

export const addDeveloperToTeam = <T>(payload: {
  projectId: string;
  team: { role: string; email: string }[];
}) => {
  return Fetcher<T>(`${Base_URL}/projects/briefs/persona/invite`, 'PATCH', payload);
};

export const addProjectManagerToBnkle = <T>(users: { type: string; email: string }[]) => {
  return Fetcher<T>(`${process.env.REACT_APP_API_IAM}persona`, 'POST', { users });
};

export const addGuestToTeam = <T>(payload: {
  projectId: string;
  team: {
    email: string;
  }[];
}) => {
  return Fetcher<T>(`${Base_URL}/projects/briefs/teams/invite`, 'PATCH', payload);
};

export const removeProjectMember = <T>(payload: {
  projectId: string;
  team: { id: string; role: UserRoles }[];
}) => {
  return Fetcher<T>(`${Base_URL}/projects/briefs/team/remove`, 'PATCH', payload);
};

export const getUserProjects = <T>(userId: string) => {
  return Fetcher<T>(`${Base_URL}/projects/user/briefs?userId=${userId}`, 'GET');
};
