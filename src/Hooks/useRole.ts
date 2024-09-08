import { es } from 'date-fns/locale';
import { useCallback } from 'react';
import { useAppSelector } from 'store/hooks';

export enum UserRoles {
  Guest = 'guest',
  Developer = 'developer',
  Consultant = 'consultant',
  Contractor = 'contractor',
  ProjectOwner = 'projectOwner',
  ProjectManager = 'projectManager',
  PortfolioManager = 'portfolioManager',
  BookKeeper = 'bookKeeper'
}

export const UserRoleConstants = {
  [UserRoles.Guest]: 'Guest',
  [UserRoles.Developer]: 'Developer',
  [UserRoles.Consultant]: 'Consultant',
  [UserRoles.Contractor]: 'Contractor',
  [UserRoles.ProjectOwner]: 'Project Owner',
  [UserRoles.ProjectManager]: 'Project Manager',
  [UserRoles.PortfolioManager]: 'Portfolio Manager',
  [UserRoles.BookKeeper]: 'Book Keeper'
};

const useRole = () => {
  const user = useAppSelector((state) => state.user);

  const { role: ReduxRole } = user;
  const role = ReduxRole || (localStorage.getItem('role') as UserRoles);
  const isOwner = [UserRoles.ProjectOwner].includes(role);
  const isManager = [UserRoles.ProjectManager, UserRoles.PortfolioManager].includes(role);
  const canAddTranch = [UserRoles.Consultant, UserRoles.Contractor].includes(role);
  const isProfessional = [UserRoles.Consultant, UserRoles.Contractor].includes(role);
  const canCreateBrief = [UserRoles.ProjectOwner, UserRoles.PortfolioManager].includes(role);
  const canRemoveTeamMember = [UserRoles.PortfolioManager, UserRoles.Developer].includes(role);
  const isCompany = [UserRoles.Developer, UserRoles.Contractor, UserRoles.Consultant].includes(
    role
  );
  const canUseBookKeeping = [
    UserRoles.PortfolioManager,
    UserRoles.Developer,
    UserRoles.BookKeeper
  ].includes(role);
  const canSeeSnapshot = [
    UserRoles.Developer,
    UserRoles.ProjectManager,
    UserRoles.PortfolioManager
  ].includes(role);

  const canDeleteCluster = [
    UserRoles.ProjectManager,
    UserRoles.PortfolioManager,
    UserRoles.Developer
  ].includes(role);

  const AddableRolesList = [
    UserRoles.Developer,
    UserRoles.ProjectOwner,
    UserRoles.BookKeeper,
    UserRoles.Guest
  ];

  const professionalList = [UserRoles.Consultant, UserRoles.Contractor];
  const isAProfessional = (x: UserRoles) => professionalList.includes(x);
  const isOfType = useCallback(
    (type: UserRoles) => {
      return role === type;
    },
    [role]
  );

  return {
    role,
    user,
    isProfessional,
    isOfType,
    canSeeSnapshot,
    isCompany,
    canCreateBrief,
    canAddTranch,
    canRemoveTeamMember,
    isOwner,
    isManager,
    canDeleteCluster,
    canUseBookKeeping,
    professionalList,
    isAProfessional,
    AddableRolesList
  } as const;
};

export default useRole;
