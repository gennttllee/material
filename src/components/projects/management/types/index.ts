import { User } from 'types';

export interface ProjectTask {
  dependencies: ProjectTask[];
  preConstructionStatus: ConstructionStatus;
  _id: string;
  name: string;
  messages: number;
  isCompleted: boolean;
  personnel: any[];
  subTasks: SubTask[];
  status: TaskStatus;
  note: any[];
  SNo: number;
  __v: number;
  powId: string;
  secondarySubTasks?: any[];
  budget?: number;
  duration: { value: number; timestamp: Date; state: SubTaskState };
  startDate: Date;
  endDate: Date;
}

export enum ConstructionStatus {
  Draft = 'draft',
  Approved = 'approved'
}

export enum SubTaskStatus {
  awaitingApproval = 'Awaiting Approval',
  notStarted = 'Not started',
  ongoing = 'In progress',
  completed = 'Completed',
  verified = 'Verified'
} // Not started, In progress, Completed, Verified

export enum TaskStatus {
  awaitingApproval = 'Awaiting Approval',
  notStarted = 'Not started',
  ongoing = 'In progress',
  completed = 'Completed',
  verified = 'Verified',
  draft = 'Draft'
}

export enum StatusColors {
  'Awaiting Approval' = 'text-bash',
  'Not started' = 'text-bred',
  'In progress' = 'text-borange',
  'Completed' = 'text-[##459A33]',
  'Verified' = 'text-bblue',
  'Draft' = 'text-black'
}

export enum SubTaskStatusColors {
  'Awaiting Approval' = 'text-bash',
  'Completed' = 'text-[##459A33]',
  'In progress' = 'text-byellow-0',
  'Verified' = 'text-bblue',
  'Not started' = 'text-bred',
  'Draft' = 'text-black'
}

export enum StatusBgs {
  'Awaiting Approval' = 'bg-bash',
  'In progress' = 'bg-byellow-1',
  'Completed' = 'bg-[##459A33]',
  'Verified' = 'bg-bblue',
  'Not started' = 'bg-bred',
  'Draft' = 'bg-black'
}

export enum SubTaskStatusBgs {
  'Awaiting Approval' = 'bg-bash',
  'In progress' = 'bg-byellow-1',
  'Completed' = 'bg-green-500',
  'Verified' = 'bg-blue-500',
  'Not started' = 'bg-bred',
  'Draft' = 'bg-black'
}

export enum SubTaskState {
  Pending = 'Pending',
  Approved = 'Approved'
}

export type SubtaskActivity = {
  _id: string;
  action: string;
  subTaskId: string;
  performedBy: string;
  date: string;
  __v: number;
};

export type TSubtaskUpdates = {
  user: string;
  name?: string;
  reason?: string;
  budget?: number;
  startDate?: Date;
  duration?: number;
  dependencies: string[];
  status: 'Rejected' | 'Pending';
};

export type SubtaskDeleteRequest = {
  user: string;
  action: string;
  reason: string;
  status: 'Rejected' | 'Pending';
};

export type SubTask = {
  activities?: SubtaskActivity[];
  budget: { value: number; timestamp: Date; state: SubTaskState };
  startDate: { value: Date; timestamp: Date; state: SubTaskState };
  duration: { value: number; timestamp: Date; state: SubTaskState };
  preConstructionStatus: ConstructionStatus;
  pendingUpdates?: TSubtaskUpdates;
  deletionRequest: SubtaskDeleteRequest;
  plannedStartDate: Date;
  dependencies: string[];
  status: SubTaskStatus;
  plannedEndDate: Date;
  weekDaysOff: any[];
  personnel: any[];
  phaseGate: false;
  endDate: Date;
  powId: string;
  name: string;
  task: string;
  user: string;
  SNo: number;
  _id: string;
  __v: number;
};

export type View = 'table' | 'calendar' | 'kanban';

export enum POWStatus {
  AwaitingApproval = 'Awaiting Approval',
  NotStarted = 'Not Started',
  InProgress = 'In progress',
  Completed = 'Completed',
  Verified = 'Verified'
}

export type POW = {
  _id: string;
  __v: number;
  name: string;
  project: string;
  professional: string;
  professionalInfo?: User;
  creator?: {
    icon: string;
    name: string;
  };
  bidId: string;
  role?: string;
  status: POWStatus;
  isCompleted?: boolean;
};
