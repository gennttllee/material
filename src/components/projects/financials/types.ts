interface ProjectCardProps {
  submissionId: string;
  name: string;
  start?: string | Date;
  end?: string | Date;
  status?: string;
  bid: string;
  bidType: string;
  index: number;
  register: (x: boolean) => void;
  autoload?:boolean
}

interface GroupCardProps {
  title: string;
  amount?: string | number;
  btn?: boolean;
  btntitle?: string;
  icon: any;
  bgColor: string;
  iconColor: string;
  modalToggle?: any;
}
interface ScheduleItemProps {
  amount: string | number;
  date: string;
  isfirst?: boolean;
  isConfirmed: boolean;
  islast?: boolean;
  _id?: string;
}

interface TransactionProps {
  label: string;
  amount: number | string;
  last_updated: string;
}

interface RecentPaymentsModalProps {
  setter: (x: boolean) => void;
}

interface TranchProps {
  amount: number;
  dueDate: string;
  _id: string;
  isConfirmed?: boolean;
}
interface TranchesProps {
  modalToggler: () => void;
  tranches: TranchProps[];
}

interface TranchModalProps {
  setter: (x: boolean) => void;
  executor: (x: TranchProps) => void;
}
export type {
  ProjectCardProps,
  GroupCardProps,
  ScheduleItemProps,
  TransactionProps,
  RecentPaymentsModalProps,
  TranchesProps,
  TranchModalProps,
  TranchProps
};
