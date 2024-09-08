import { ColumnDef } from '@tanstack/react-table';
import { ProjectTask, StatusColors, TaskStatus } from 'components/projects/management/types';
import { flexer } from 'constants/globalStyles';
import { BsFillCheckCircleFill, BsFillCircleFill } from 'react-icons/bs';
import { TiWarning } from 'react-icons/ti';
import Moment from 'react-moment';
import StatusColumn from './StatusColumn';
import SerialNumberColumn from './SerialNumberColumn';

export const TableHeaderText = ({
  label,
  isFirstColumn
}: {
  label: string;
  isFirstColumn?: boolean;
}) => (
  <div
    className={`py-3 bg-white ${isFirstColumn ? 'rounded-tl-lg px-5' : 'px-2'} ${
      label === 'Status' && 'rounded-tr-lg'
    } `}>
    <p className="w-full text-left capitalize text-sm font-normal">{label}</p>
  </div>
);

export const columns: ColumnDef<ProjectTask>[] = [
  {
    accessorKey: 'name',
    header: () => <TableHeaderText label="SN" isFirstColumn />,
    footer: (props) => props.column.id,
    cell: ({ row }) => <SerialNumberColumn {...row} />
  },
  {
    accessorKey: 'name',
    header: () => <TableHeaderText label="Name" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className={flexer + 'min-w-[250px]  py-[16px]'}>
        {row.original.status === TaskStatus.completed ? (
          <div className="bg-white rounded-full p-1px mr-2">
            <BsFillCheckCircleFill className="text-green-500 text-[10px]" />
          </div>
        ) : row.original.status === TaskStatus.awaitingApproval ? (
          <TiWarning className={`${StatusColors[row.original.status]} text-base mr-2`} />
        ) : (
          <BsFillCircleFill className={`${StatusColors[row.original.status]} text-[10px] mr-2`} />
        )}
        <p
          className={`${
            row.original.status === TaskStatus.awaitingApproval ? 'text-bash' : 'text-black'
          } font-Medium text-sm flex-1 truncate capitalize`}>
          {row.original.name}
        </p>
      </div>
    )
  },
  {
    accessorKey: 'schedule',
    header: () => <TableHeaderText label="date" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className="py-4 px-2">
        {row.original.duration ? (
          <Moment className="text-bash font-Medium text-sm flex-1 truncate" format="DD MMM YYYY">
            {row.original.startDate}
          </Moment>
        ) : (
          <p className="text-bash font-Medium text-sm flex-1 truncate">Not Set</p>
        )}
      </div>
    )
  },
  {
    accessorKey: 'sch',
    header: () => <TableHeaderText label="date" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className="py-4 px-2">
        {row.original.duration ? (
          <Moment className="text-bash font-Medium text-sm flex-1 truncate" format="DD MMM YYYY">
            {row.original.endDate}
          </Moment>
        ) : (
          <p className="text-bash font-Medium text-sm flex-1 truncate">Not Set</p>
        )}
      </div>
    )
  },
  {
    accessorKey: 'sched',
    header: () => <TableHeaderText label="Duration" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className="py-4 px-2">
        {row.original.duration ? (
          <p className="text-bash font-Medium w-full text-sm flex-1 truncate">
            {Number(row.original.duration.value).toFixed(0)} Days
          </p>
        ) : (
          <p className="text-bash font-Medium w-full text-sm flex-1 truncate">Not Scheduled</p>
        )}
      </div>
    )
  },
  // {
  //   accessorKey: "subTasks",
  //   header: () => <TableHeaderText label="Predecessors" />,
  //   footer: (props) => props.column.id,
  //   cell: ({ row }) => <DependencyColumn {...row} />,
  // },
  {
    accessorKey: 'messages',
    header: () => <TableHeaderText label="Status" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => <StatusColumn {...row} />
  }
];
