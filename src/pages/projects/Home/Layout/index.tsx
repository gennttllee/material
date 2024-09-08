import React, { FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { StoreContext } from '../../../../context';
import { getBids, makeRequest } from '../../Helper';
import Header, { Path } from '../Components/Header';
import useRole, { UserRoles } from '../../../../Hooks/useRole';
import { useLocation } from 'react-router-dom';

interface Props {
  children: ReactNode;
  path?: Path;
}

const Layout: FC<Props> = ({ path, children }) => {
  const { isProfessional, role } = useRole();
  const { setContext, menuProjects } = useContext(StoreContext);
  const [errStatus, setErrStatus] = useState<number | null>(null);

  const fetchProjects = useCallback(async () => {
    await makeRequest(setContext, setErrStatus);
  }, [setContext]);

  const fetchBids = useCallback(async () => {
    await getBids(isProfessional, setContext, setErrStatus);
  }, [setContext, isProfessional]);

  useEffect(() => {
    if (menuProjects && !menuProjects[0]) {
      if (!isProfessional) {
        fetchProjects();
      } else {
        fetchBids();
      }
    }
  }, [isProfessional, menuProjects, fetchBids, fetchProjects]);
  let location = useLocation();
  let showNavs = useMemo(() => {
    let split = location.pathname.split('/');
    if (split[split.length - 1] === 'create') {
      return false;
    }
    return true;
  }, [location]);

  if (errStatus !== 404 && role === UserRoles.ProjectOwner && errStatus && errStatus > 299)
    return (
      <div className="flex h-full w-full flex-col justify-center items-center">
        <span className="w-4/5 text-center ">
          {errStatus === 401 || errStatus === 403
            ? 'You do not have access to this resource'
            : 'Server Error. Kindly reload the page'}
        </span>
      </div>
    );

  useEffect(() => {}, [location]);
  return (
    <div
      className={`h-screen min-h-full w-full  ${
        showNavs ? 'bg-bidsbg' : 'bg-white'
      } flex flex-col`}>
      <Header hideNavs={!showNavs} pathname={path} hideSearch={!showNavs} />
      <div className="relative z-0 px-2 sm:px-6 md:px-12 lg:px-24 xl:px-40 2xl:px-0 overflow-y-scroll flex-1 w-full no-scrollbar 2xl:max-w-[1440px] mx-auto pb-10">
        {children}
      </div>
    </div>
  );
};

export default Layout;
