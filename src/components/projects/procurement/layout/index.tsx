import { flexer, hoverFade } from 'constants/globalStyles';
import { StoreContext } from 'context';
import React, { useContext } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { tabs } from './constants';
import MaterialHeader from '../material-schedule/components/MaterialHeader';

const Index = () => {
  const { data, selectedProjectIndex } = useContext(StoreContext);
  return (
    <div className=" flex-1 overflow-y-auto overflow-x-auto">
      <div className="flex-1 overflow-y-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default Index;
