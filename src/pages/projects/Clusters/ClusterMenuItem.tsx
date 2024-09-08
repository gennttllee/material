import React from 'react';
import { IconType } from 'react-icons';
import {
  TbBuildingCottage,
  TbEdit,
  TbFileInvoice,
  TbReportMoney,
  TbTicket,
  TbUsers
} from 'react-icons/tb';

interface ClusterMenuItemProps {
  active?: boolean;
  name: string;
  path?: string;
  icon?: IconType;
  setter: () => void;
}
const ClusterMenuItem = ({ active, name, icon, setter, path }: ClusterMenuItemProps) => {
  return (
    <div
      onClick={() => {
        if (path) {
          setter();
        }
      }}
      className={` hover:bg-ashShade-0 rounded-md flex cursor-pointer ${
        active ? 'text-black' : 'text-bash'
      } items-center py-2.5 px-4 whitespace-nowrap `}>
      {icon &&
        React.createElement(icon, {
          className: ' mr-2',
          color: active ? 'black' : '#77828D'
        })}{' '}
      {name}
    </div>
  );
};

const clusterMenuItemsList = [
  {
    name: 'Projects',
    icon: TbEdit,
    path: 'projects'
  },
  {
    name: 'Financials',
    icon: TbFileInvoice,
    // path: 'financials'
  },
  {
    name: 'Reports and Summary',
    icon: TbReportMoney,
    // path: 'reports-and-summary'
  },
  {
    name: 'Members',
    icon: TbUsers,
    path: 'members'
  }
];

export { clusterMenuItemsList };

export default ClusterMenuItem;
