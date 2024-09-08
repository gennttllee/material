import { POWStatus, ProjectTask, SubTaskStatus, TaskStatus } from '../../types';
import { UserRoles } from '../../../../../Hooks/useRole';

export const canEditSubTask = ({
  origin,
  role,
  dest
}: {
  origin: SubTaskStatus;
  role: UserRoles;
  dest: SubTaskStatus;
}) => {
  const ProfessionalActions =
    origin === SubTaskStatus.notStarted ||
    origin === SubTaskStatus.ongoing ||
    (origin === SubTaskStatus.completed && dest === SubTaskStatus.ongoing);

  const ProjectOwnerActions =
    (dest === SubTaskStatus.completed && origin === SubTaskStatus.verified) ||
    (dest === SubTaskStatus.verified && origin === SubTaskStatus.completed);

  const PortfolioManagerActions =
    (origin === SubTaskStatus.awaitingApproval && dest === SubTaskStatus.notStarted) ||
    (dest === SubTaskStatus.awaitingApproval && origin === SubTaskStatus.notStarted) ||
    (dest === SubTaskStatus.completed && origin === SubTaskStatus.verified) ||
    (dest === SubTaskStatus.verified && origin === SubTaskStatus.completed);

  switch (role) {
    case UserRoles.Consultant:
      return ProfessionalActions;
    case UserRoles.Contractor:
      return ProfessionalActions;
    case UserRoles.ProjectOwner:
      return ProjectOwnerActions;
    case UserRoles.ProjectManager:
      return ProjectOwnerActions || PortfolioManagerActions;
    case UserRoles.PortfolioManager:
      return PortfolioManagerActions;
    case UserRoles.Developer:
      return PortfolioManagerActions;
  }
};

export const TaskStatusColor = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.draft:
      return 'white';
    case TaskStatus.awaitingApproval:
      return '#77828D';
    case TaskStatus.notStarted:
      return '#A7194B';
    case TaskStatus.ongoing:
      return '#FF8A34';
    case TaskStatus.completed:
      return '#459A33';
    default:
      return '#437ADB';
  }
};

export const SubTaskStatusColor = (status: SubTaskStatus) => {
  switch (status) {
    case SubTaskStatus.awaitingApproval:
      return '#9099A8';
    case SubTaskStatus.notStarted:
      return '#A7194B';
    case SubTaskStatus.ongoing:
      return '#FF8A34';
    case SubTaskStatus.completed:
      return '#459A33';
    default:
      return '#437ADB';
  }
};

const timeToNumber = (date: Date | string) => {
  return new Date(new Date(date).getTime()).getTime();
};

export const SortTasksByDate = (tasks: ProjectTask[], key: 'endDate' | 'startDate') => {
  return tasks
    .filter((one) => one.status !== TaskStatus.draft) // removes drafts
    .sort((a, b) => timeToNumber(a[key]) - timeToNumber(b[key]));
};

export const isAwaiting = (status: SubTaskStatus | TaskStatus | POWStatus) =>
  status === SubTaskStatus.awaitingApproval || status === TaskStatus.awaitingApproval;
