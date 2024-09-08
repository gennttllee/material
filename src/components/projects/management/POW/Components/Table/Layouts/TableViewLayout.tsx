import React, { useContext } from 'react';
import { ProjectTask } from 'components/projects/management/types';
import { useParams } from 'react-router-dom';
import { PMStoreContext } from 'components/projects/management/Context';
import {
  flexRender,
  useReactTable,
  getCoreRowModel,
  getExpandedRowModel
} from '@tanstack/react-table';
import TaskRow from '../Row/TaskRow';
import { columns } from '../Columns';
import { DragDropContext, DropResult, Droppable } from 'react-beautiful-dnd';

// a little function to help us with reordering the result
const reorder = (list: ProjectTask[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'whitesmoke' : 'white',
  width: '100%',
  padding: 0
});

interface ITableViewLayout {
  label: String;
  data: ProjectTask[];
}

const TableViewLayout = ({ label, data }: ITableViewLayout) => {
  const { powId } = useParams() as { powId: string };
  const { tasks, handleContext } = useContext(PMStoreContext);

  const table = useReactTable<ProjectTask>({
    data,
    columns,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getExpandedRowModel: getExpandedRowModel()
  });

  const onDragEnd = (result: DropResult) => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(data, result.source.index, result.destination.index);

    handleContext('tasks', { ...tasks, [powId]: items });
  };

  const Header = () => (
    <thead>
      {React.Children.toArray(
        table.getHeaderGroups().map((headerGroup) => (
          <tr className="outline-0 border-l-0 bg-white">
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

  return (
    <>
      <p className="font-Demibold  my-6">
        {data.length} {label}
        {data.length > 1 ? 's' : ''}
      </p>
      <DragDropContext onDragEnd={onDragEnd}>
        <Droppable droppableId="droppable">
          {(provided, snapshot) => (
            <table
              style={getListStyle(snapshot.isDraggingOver)}
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="w-full mt-5 pb-10">
              <Header />
              {React.Children.toArray(
                table.getRowModel().rows.map((row, index) => <TaskRow {...{ row, index }} />)
              )}
            </table>
          )}
        </Droppable>
      </DragDropContext>
    </>
  );
};

export default TableViewLayout;
