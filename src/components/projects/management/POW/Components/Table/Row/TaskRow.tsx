import { Row, flexRender } from '@tanstack/react-table';
import { ProjectTask, TaskStatus } from 'components/projects/management/types';
import React from 'react';
import { Draggable, DraggingStyle, NotDraggingStyle } from 'react-beautiful-dnd';
import SubTable from '../../SubTable';

const getItemStyle = (draggableStyle: DraggingStyle | NotDraggingStyle | undefined) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  // background: isDragging ? "lightgray" : "white",

  // styles we need to apply on draggables
  ...draggableStyle
});

interface TaskRowProps {
  index: number;
  row: Row<ProjectTask>;
}

const TaskRow = ({ row, index }: TaskRowProps) => {
  return (
    <>
      <Draggable isDragDisabled key={row.id} draggableId={row.id} index={index}>
        {(provided) => (
          <tr
            ref={provided.innerRef}
            {...provided.draggableProps}
            {...provided.dragHandleProps}
            style={getItemStyle(provided.draggableProps.style) as any}
            className={`w-full !py-0 outline-0 border-t ${
              row.original.status === TaskStatus.awaitingApproval ? 'bg-pbg' : 'bg-white'
            }`}
          >
            {/* first row is a normal row */}
            {React.Children.toArray(
              row.getVisibleCells().map((cell) => {
                return <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
              })
            )}
          </tr>
        )}
      </Draggable>
      <tr
        className={`bg-white ${
          row.getIsExpanded() ? 'zero-height  overflow-hidden' : 'auto-height  overflow-y-scroll'
        }`}
      >
        {/* 2nd row is a custom 1 cell row */}
        <td colSpan={row.getVisibleCells().length}>
          <SubTable {...row} />
        </td>
      </tr>
    </>
  );
};

export default TaskRow;
