import React, { HTMLProps, useState, FC, useContext, useMemo } from 'react';
import {
  ColumnDef,
  flexRender,
  useReactTable,
  getCoreRowModel,
  getFilteredRowModel,
  Row
} from '@tanstack/react-table';
import {
  ProjectTask,
  StatusColors,
  SubTask,
  SubTaskStatus,
  SubTaskStatusColors
} from '../../../types';
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
  DraggingStyle,
  NotDraggingStyle
} from 'react-beautiful-dnd';
import { flexer, hoverFade } from '../../../../../../constants/globalStyles';
import useRole, { UserRoles } from '../../../../../../Hooks/useRole';
import { TbDotsVertical, TbPlus } from 'react-icons/tb';
import Modal from '../../../../../shared/Modal';
import { PMStoreContext } from '../../../Context';
import { useParams } from 'react-router-dom';
import SubTaskForm from '../subTaskForm';
import randomColor from 'randomcolor';
import Moment from 'react-moment';
import moment from 'moment';
import SubTaskDateForm from '../DateForm';
import SubtaskPopUp from '../SubtaskPopUp';
import SubTaskNameColumn from '../Table/Columns/SubTaskNameColumn';

const getItemStyle = (
  isDragging: boolean,
  draggableStyle: DraggingStyle | NotDraggingStyle | undefined
) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  // background: isDragging ? "lightgray" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

const getListStyle = (isDraggingOver: boolean) => ({
  // background: isDraggingOver ? "whitesmoke" : "white",
  // padding: 0,
  // width: "100%"
});

const HeaderText = ({ label }: { label: string }) => (
  <div className={`py-4 px-2 ${label === 'Predecessors' && 'rounded-tr-lg'} `}>
    <p className="w-full text-left capitalize text-sm font-normal">{label}</p>
  </div>
);

const CellRowRender = ({ row }: { row: Row<SubTask> }) => {
  const { powId } = useParams() as { powId: string };
  const [showModal, setShowModal] = useState(false);
  const { tasks } = useContext(PMStoreContext);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const dependencies = useMemo(() => {
    const data: {
      name: string;
      taskIndex: number;
      subTaskIndex: number;
    }[] = [];
    for (const depId of row.original.dependencies) {
      for (let i = 0; i < tasks[powId].length; i++) {
        const task = tasks[powId][i];
        for (let j = 0; j < task.subTasks.length; j++) {
          const subT = task.subTasks[j];
          if (subT._id === depId) {
            data.push({ name: subT.name, taskIndex: i, subTaskIndex: j });
            break;
          }
        }
      }
    }
    return data;
  }, [row.original, tasks, powId]);

  const bgColors = useMemo(() => {
    return randomColor({
      count: dependencies.length,
      luminosity: 'dark',
      alpha: 0.1
    });
  }, [dependencies]);

  return (
    <div className={'px-2 py-4 flex items-center relative'}>
      {React.Children.toArray(
        dependencies && dependencies[0] ? (
          dependencies.map(({ taskIndex, subTaskIndex }, index) => (
            <div className={`px-2 py-1 relative w-fit mx-2 truncate `}>
              <p className="text-sm text-black font-Medium text-center">
                {taskIndex + 1}.{subTaskIndex + 1}
              </p>
              <div
                style={{ background: bgColors[index] }}
                className="absolute top-0 left-0 w-full h-full rounded-md opacity-50"
              />
            </div>
          ))
        ) : (
          <span
            className={`px-2 py-1 text-sm rounded-md bg-gray-100 font-Medium text-bash mx-2 truncate text-center`}>
            N/A
          </span>
        )
      )}
      <div className="mx-auto" />
      <TbDotsVertical onClick={toggleModal} className={'text-bash text-base ml-10' + hoverFade} />
      {showModal && (
        <SubtaskPopUp subtask={row.original} toggle={toggleModal} visible={showModal} />
      )}
    </div>
  );
};

const columns: (taskIndex: number) => ColumnDef<SubTask>[] = (taskIndex) => [
  {
    id: 'select',
    accessorKey: 'label',
    header: ({ table }) => (
      <div className="px-4 py-4 rounded-tl-lg">
        <IndeterminateCheckbox
          {...{
            checked: table.getIsAllRowsSelected(),
            indeterminate: table.getIsSomeRowsSelected(),
            onChange: table.getToggleAllRowsSelectedHandler()
          }}
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="px-2 py-4">
        <IndeterminateCheckbox
          className="transform translate-x-3"
          {...{
            checked: row.getIsSelected(),
            disabled: !row.getCanSelect(),
            indeterminate: row.getIsSomeSelected(),
            onChange: row.getToggleSelectedHandler()
          }}
        />
      </div>
    )
  },
  {
    accessorKey: 'label',
    header: () => <HeaderText label="SN" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className=" py-[14px] transform -translate-x-1">
        <p className="text-center text-bash">
          {taskIndex + 1}.{row.index + 1}
        </p>
      </div>
    )
  },
  {
    accessorKey: 'label',
    header: () => <HeaderText label="Subtask Name" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => <SubTaskNameColumn {...{ row, taskIndex }} />
  },
  {
    accessorKey: 'schedule',
    header: () => <HeaderText label="Start date" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className="px-2 py-4 ">
        <Moment className="text-bash font-Medium text-sm flex-1 truncate" format="DD MMM YYYY">
          {row.original.startDate.value}
        </Moment>
      </div>
    )
  },
  {
    accessorKey: 'sch',
    header: () => <HeaderText label="End date" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className="px-2 py-4 ">
        <Moment className="text-bash font-Medium text-sm flex-1 truncate" format="DD MMM YYYY">
          {row.original.endDate}
        </Moment>
      </div>
    )
  },
  {
    accessorKey: 'sched',
    header: () => <HeaderText label="Duration" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className="px-2 py-4 ">
        <p className="text-bash font-Medium w-full text-sm flex-1 truncate">
          {row.original.duration.value} Days
        </p>
      </div>
    )
  },
  {
    accessorKey: 'subTasks',
    header: () => <HeaderText label="Predecessors" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => <CellRowRender row={row} />
  }
];

const IndeterminateCheckbox = ({
  indeterminate,
  className = '',
  ...rest
}: { indeterminate?: boolean } & HTMLProps<HTMLInputElement>) => {
  const ref = React.useRef<HTMLInputElement>(null!);

  React.useEffect(() => {
    if (typeof indeterminate === 'boolean') {
      ref.current.indeterminate = !rest.checked && indeterminate;
    }
  }, [ref, indeterminate, rest.checked]);

  return <input type="checkbox" ref={ref} className={className + ' cursor-pointer'} {...rest} />;
};

type TableProps<TData> = {
  task: ProjectTask;
  columns: ColumnDef<TData>[];
  getRowCanExpand: (row: Row<TData>) => boolean;
};

export type DateModalProps = {
  status: boolean;
  option?: DateFormProps;
};

export type DateFormProps = {
  direction: 'above' | 'below';
  initialValue: SubTask;
  destination: number;
  targetDate: Date;
  message: string;
  origin: number;
};

function Table({ getRowCanExpand, columns, task }: TableProps<SubTask>): JSX.Element {
  const { role, isOfType } = useRole();
  const { _id: taskId, powId } = task;
  const [rowSelection, setRowSelection] = React.useState({});
  const [showModal, setModal] = useState<DateModalProps>({ status: false });

  const data = useMemo(() => {
    return task.subTasks.sort(
      (a, b) => new Date(a.startDate.value).getTime() - new Date(b.startDate.value).getTime()
    );
  }, [task]);

  const toggleModal = (props?: DateModalProps['option']) => {
    setModal((prev) => ({ status: !prev.status, option: props }));
  };

  const table = useReactTable<SubTask>({
    data,
    columns,
    state: {
      rowSelection
    },
    enableRowSelection: true, //enable row selection for all rows
    // enableRowSelection: row => row.original.age > 18, // or enable row selection conditionally per row
    getRowCanExpand,
    getCoreRowModel: getCoreRowModel(),
    onRowSelectionChange: setRowSelection,
    getFilteredRowModel: getFilteredRowModel()
  });
  // it can done after the staging
  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    let message: string = '',
      direction: 'above' | 'below' | undefined;
    const origin = data[result.source.index],
      destination = data[result.destination.index];

    // check the start dates before reordering
    if (origin.startDate.value < destination.startDate.value) {
      message = `after the ${moment(destination.startDate.value).format('DD MMM YYYY')}`;
      direction = 'above';
    } else if (origin.startDate.value > destination.startDate.value) {
      message = `before the ${moment(destination.startDate.value).format('DD MMM YYYY')}`;
      direction = 'below';
    } else {
      // the dates are good to go
    }

    if (message && direction)
      toggleModal({
        message,
        direction,
        initialValue: origin,
        origin: result.source.index,
        destination: result.destination.index,
        targetDate: new Date(destination.startDate.value)
      });
  };

  const Header = () => (
    <thead>
      {React.Children.toArray(
        table.getHeaderGroups().map((headerGroup) => (
          <tr className="outline-0 border-l-0 bg-pbg">
            {React.Children.toArray(
              headerGroup.headers.map((header, index) => {
                const isLast = headerGroup.headers.length - 1 === index;
                return (
                  <th
                    colSpan={header.colSpan}
                    className={`
                      ${index === 0 && ' rounded-tl-md '}
                      ${isLast && ' rounded-tr-md '} 
                      outline-0 border-0 bg-transparent
                    `}>
                    {header.isPlaceholder ? null : (
                      <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
                    )}
                  </th>
                );
              })
            )}
          </tr>
        ))
      )}
    </thead>
  );

  const DateForm = showModal.option ? (
    <SubTaskDateForm {...{ toggleModal, taskId, powId }} option={showModal.option} />
  ) : null;

  const ModalView = (
    <div className="bg-white absolute cursor-auto w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg z-10">
      {!showModal.option ? <SubTaskForm {...{ toggleModal, taskId }} /> : DateForm}
    </div>
  );

  return (
    <div className="w-full h-full">
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <table
              {...provided.droppableProps}
              ref={provided.innerRef}
              style={getListStyle(snapshot.isDraggingOver)}
              className="w-full">
              <Header />

              {React.Children.toArray(
                table.getRowModel().rows.map((row, index) => (
                  <Draggable
                    key={row.id}
                    index={index}
                    draggableId={row.id}
                    isDragDisabled={!isOfType(UserRoles.Contractor)}>
                    {(provided, snapshot) => (
                      <tbody
                        ref={provided.innerRef}
                        {...provided.draggableProps}
                        {...provided.dragHandleProps}
                        style={
                          getItemStyle(snapshot.isDragging, provided.draggableProps.style) as any
                        }
                        className="w-full !py-0">
                        <tr
                          className={`outline-0 border-b ${
                            row.original.status === SubTaskStatus.awaitingApproval
                              ? '!bg-pbg'
                              : '!bg-white'
                          }`}>
                          {/* first row is a normal row */}
                          {React.Children.toArray(
                            row.getVisibleCells().map((cell) => {
                              return (
                                <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>
                              );
                            })
                          )}
                        </tr>
                      </tbody>
                    )}
                  </Draggable>
                ))
              )}
            </table>
          )}
        </Droppable>
      </DragDropContext>
      <div className="h-2" />
      <div className={flexer}>
        <div />
        <button
          onClick={() => toggleModal()}
          className={
            `flex items-center ml-auto w-fit mt-4  ${role !== 'contractor' && 'hidden'}` + hoverFade
          }>
          <TbPlus className="text-borange mr-1" />
          <strong className="text-borange text-sm font-Medium">Add subtask</strong>
        </button>
      </div>
      <Modal
        toggle={toggleModal}
        visible={showModal.status}
        overlayClassName="opacity-50 backdrop-blur-0"
        className="backdrop-blur-0 drop-shadow-lg">
        {ModalView}
      </Modal>
    </div>
  );
}

interface Props {
  taskIndex: number;
  task: ProjectTask;
}

const SubTaskTable: FC<Props> = ({ taskIndex, task }) => (
  <Table task={task} columns={columns(taskIndex)} getRowCanExpand={() => true} />
);

export default SubTaskTable;
