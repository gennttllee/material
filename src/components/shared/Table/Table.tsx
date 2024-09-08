import {
  ColumnDef,
  PaginationState,
  flexRender,
  getCoreRowModel,
  getExpandedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable
} from '@tanstack/react-table';
import { flexer, hoverFade } from 'constants/globalStyles';
import React, { Fragment, useMemo, useState } from 'react';
import { FiChevronLeft, FiChevronRight } from 'react-icons/fi';

interface ITableProps<T> {
  data: T[];
  label: String;
  columns: ColumnDef<T, any>[];
}

function Table<T>({ data, columns }: ITableProps<T>) {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10
  });

  const table = useReactTable<T>({
    data,
    columns,
    paginateExpandedRows: true,
    getRowCanExpand: () => true,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    onPaginationChange: setPagination,
    //no need to pass pageCount or rowCount with client-side pagination as it is calculated automatically
    state: {
      pagination
    }
    // autoResetPageIndex: false, // turn off page index reset when sorting or filtering
  });

  let pageCount = useMemo(() => {
    return table.getPageCount();
  }, [table]);

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

  const Body = () => (
    <>
      {table.getRowModel().rows.map((row, index) => (
        <tr key={index} className="w-full !py-0 outline-0 border-t bg-pbg">
          {/* first row is a normal row */}
          {React.Children.toArray(
            row.getVisibleCells().map((cell) => {
              return <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
            })
          )}
        </tr>
      ))}
    </>
  );

  const PaginationWrapper = () => (
    <div className={flexer + 'my-5'}>
      <button
        className={'flex items-center gap-2' + hoverFade}
        onClick={() => table.previousPage()}
        type="button"
        disabled={!table.getCanPreviousPage()}>
        <FiChevronLeft className="text-bash" />
        <p className={`${table.getCanPreviousPage() ? 'text-black' : 'text-bash'} font-Medium`}>
          Previous
        </p>
      </button>
      <div className="flex gap-2 max-w-[300px] items-center overflow-x-scroll">
        {Array.from({ length: table.getPageCount() }).map((_, index) => (
          <button
            className={` ${
              pagination.pageIndex === index ? 'bg-bblue text-white' : 'text-black hover:bg-pbg'
            } font-Medium py-1 px-3 rounded `}
            onClick={(ev) => {
              ev?.stopPropagation();
              setPagination((prev) => ({ ...prev, pageIndex: index }));
            }}
            type="button">
            {index + 1}
          </button>
        ))}
      </div>
      <button
        type="button"
        onClick={() => table.nextPage()}
        className={'flex items-center gap-2' + hoverFade}
        disabled={!table.getCanNextPage()}>
        <p className={` ${table.getCanNextPage() ? 'text-black' : 'text-bash'} font-Medium`}>
          Next
        </p>
        <FiChevronRight className="text-bash" />
      </button>
    </div>
  );

  return (
    <Fragment>
      <table className="w-full mt-5 pb-10">
        <Header />
        <Body />
      </table>
      {pageCount > 1 && <PaginationWrapper />}
    </Fragment>
  );
}

export default Table;
