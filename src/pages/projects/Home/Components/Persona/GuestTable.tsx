import {
  ColumnDef,
  Table,
  flexRender,
  getCoreRowModel,
  useReactTable
} from '@tanstack/react-table';
import React from 'react';
import { Persona } from 'types';
import StatusColumn from './StatusColumn';
import { UserRoles } from 'Hooks/useRole';
import { centered } from 'constants/globalStyles';

const HeaderText = ({ label }: { label: string }) => (
  <p className={`py-3 !w-full text-left !text-sm ${label === 'Name' && 'pl-3'}`}>{label}</p>
);

const columns = (UserRole: UserRoles): ColumnDef<Persona>[] => [
  {
    accessorKey: 'name',
    header: () => <HeaderText label="Name" />,
    footer: (props) => props.column.id,
    cell: ({ row }) => (
      <div className="flex items-center gap-3 p-3">
        <div
          className={
            'w-10 h-10 rounded-full bg-bblue uppercase font-Demibold text-white' + centered
          }>
          {row.original.firstName ? row.original.firstName.charAt(0) : ''}
          {row.original.lastName ? row.original.lastName.charAt(0) : ''}
        </div>
        <p className="text-lg font-Medium capitalize flex-1 truncate">
          {row.original.firstName || ''} {row.original.lastName || ''}
        </p>
      </div>
    )
  },
  {
    accessorKey: 'companyName',
    footer: (props) => props.column.id,
    header: () => <HeaderText label="Company Name" />,
    cell: ({ row }) => (
      <p className={` ${row.original.companyName ? 'text-bash' : 'text-black'} font-Medium`}>
        {row.original.companyName || 'Not set'}
      </p>
    )
  },
  {
    accessorKey: 'state',
    footer: (props) => props.column.id,
    header: () => <HeaderText label="State / Province" />,
    cell: ({ row }) => (
      <p className={` ${row.original.state ? 'text-bash' : 'text-black'} font-Medium`}>
        {row.original.state || 'Not set'}
      </p>
    )
  },
  {
    accessorKey: 'city',
    footer: (props) => props.column.id,
    header: () => <HeaderText label="City" />,
    cell: ({ row }) => (
      <p className={` ${row.original.city ? 'text-bash' : 'text-black'} font-Medium`}>
        {row.original.city || 'Not set'}
      </p>
    )
  },
  {
    accessorKey: 'phone',
    footer: (props) => props.column.id,
    header: () => <HeaderText label="Phone number" />,
    cell: ({ row }) => (
      <p className={` ${row.original.phoneNumber ? 'text-bash' : 'text-black'} font-Medium`}>
        {row.original.phoneNumber || 'Not set'}
      </p>
    )
  },
  {
    accessorKey: 'email',
    footer: (props) => props.column.id,
    header: () => <HeaderText label="Email address" />,
    cell: ({ row }) => (
      <p className={` ${row.original.email ? 'text-bash' : 'text-black'} font-Medium`}>
        {row.original.email || 'Not set'}
      </p>
    )
  },
  {
    accessorKey: 'status',
    footer: (props) => props.column.id,
    header: () => <HeaderText label="Status" />,
    cell: ({ row }) => <StatusColumn {...{ row, UserRole }} />
  }
];

const Header = ({ table }: { table: Table<Persona> }) => (
  <thead>
    {React.Children.toArray(
      table.getHeaderGroups().map((headerGroup) => (
        <tr className="outline-0 bg-[#F9FAFB] border-[#EAECF0] ">
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

const GuestTable = ({ data, UserRole }: { data: Persona[]; UserRole: UserRoles }) => {
  const table = useReactTable<Persona>({
    data,
    columns: columns(UserRole),
    getCoreRowModel: getCoreRowModel()
  });
  return (
    <table className="w-full pb-10">
      <Header {...{ table }} />
      {React.Children.toArray(
        table.getRowModel().rows.map((row) => (
          <tr className="w-full !py-0 outline-0 border-t bg-white border-[#EAECF0]">
            {/* first row is a normal row */}
            {React.Children.toArray(
              row.getVisibleCells().map((cell) => {
                return <td>{flexRender(cell.column.columnDef.cell, cell.getContext())}</td>;
              })
            )}
          </tr>
        ))
      )}
    </table>
  );
};

export default GuestTable;
