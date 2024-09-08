import SubTaskTable from './Components';
import { Row } from '@tanstack/react-table';
import { ProjectTask, TaskStatus } from 'components/projects/management/types';

const SubTable = (row: Row<ProjectTask>) => {
  const bgTheme = () => {
    switch (row.original.status) {
      case TaskStatus.awaitingApproval:
        return 'bg-gray-200 shadow-gray-200 border-gray-500';
      case TaskStatus.notStarted:
        return 'bg-red-100 shadow-red-200 border-red-500';
      case TaskStatus.ongoing:
        return 'bg-yellow-100 shadow-yellow-200 border-yellow-500';
      case TaskStatus.completed:
        return 'bg-green-100 shadow-green-200 border-green-500';
      case TaskStatus.verified:
        return 'bg-blue-100 shadow-blue-200 border-blue-500';
    }
  };
  return (
    <div
      className={`shadow-inner border-l-4
          ${
            !row.getIsExpanded() ? 'zero-height  overflow-hidden' : 'auto-height  overflow-y-scroll'
          }
          ${bgTheme()}
        `}
    >
      <div className="px-6 py-4">
        <SubTaskTable task={row.original} taskIndex={row.index} />
      </div>
    </div>
  );
};

export default SubTable;
