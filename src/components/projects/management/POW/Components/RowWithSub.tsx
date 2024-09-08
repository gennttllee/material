import React, { Fragment } from 'react';
import { ProjectTask } from '../../types';
import { flexRender, Row } from '@tanstack/react-table';

interface Props {
  row: Row<ProjectTask>;
  renderSubComponent: any;
  subTaskHandle: () => void;
}

const RowWithSub = ({ row, renderSubComponent, subTaskHandle }: Props) => {
  return (
    <Fragment>
      <tr className="outline-0 border-t bg-white">
        {/* first row is a normal row */}
        {React.Children.toArray(
          row.getVisibleCells().map((cell) => {
            return <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
          })
        )}
      </tr>
      {row.getIsExpanded() && (
        <tr>
          {/* 2nd row is a custom 1 cell row */}
          <td colSpan={row.getVisibleCells().length}>
            {renderSubComponent({ row, subTaskHandle })}
          </td>
        </tr>
      )}
    </Fragment>
  );
};

export default RowWithSub;
