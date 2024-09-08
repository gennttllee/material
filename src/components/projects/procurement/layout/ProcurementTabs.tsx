import React from 'react';
import { flexer, hoverFade } from 'constants/globalStyles';
import { StoreContext } from 'context';
import { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { tabs } from './constants';

interface ProcurementTabsProps {
  buttons?: React.ReactElement;
}

const ProcurementTabs = ({ buttons }: ProcurementTabsProps) => {
  const { data, selectedProjectIndex } = useContext(StoreContext);
  return (
    <div className=" w-full h-full flex flex-col ">
      <div className={flexer}>
        <h1 className="text-2xl font-Medium">Procurement</h1>
      </div>
      <div className="flex w-full items-center mt-2 mb-8 justify-between border-b border-b-ashShade-4">
        <div className="flex gap-x-6">
          {tabs.map((m) => (
            <NavLink
              className={({ isActive }) =>
                ` ${
                  isActive && 'text-blue-500 border-b-2 border-b-bblue'
                } pb-2 text-base ${hoverFade}`
              }
              to={`/projects/${data[selectedProjectIndex]._id}/procurement/${m.path}`}>
              {m.name}
            </NavLink>
          ))}
        </div>
        {buttons}
      </div>
    </div>
  );
};

export default ProcurementTabs;
