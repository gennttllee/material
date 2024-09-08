import { StoreContext } from 'context';
import React, { useCallback, useContext, useEffect, useLayoutEffect, useState } from 'react';
import { Brief, Prototype } from 'types';
// import TutorialCard, { GettingStartedProps } from "./Components/TutorialCard";
import ProjectCard from './Components/ProjectCard';
import PrototypeCard from './Components/PrototypeCard';
import Layout from './Layout';
import GridItems from './Layout/GridItems';
// import whiteguy from "../../../assets/whiteguy.svg";
// import construction-site from "../../../assets/constructionsite.svg";
import { useNavigate } from 'react-router-dom';
// import lock from "../../../assets/lock.svg";
import useFetch from 'Hooks/useFetch';
import { Outlet } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import { getAllPrototypes } from 'apis/prototypes';
import useRole, { UserRoles } from 'Hooks/useRole';
import useProfessionals from 'Hooks/useProfessionals';

const ProjectsHome = () => {
  useProfessionals();
  return (
    <Layout path="home">
      <Outlet />
    </Layout>
  );
};

const ProjectHomeIndex = () => {
  const navigate = useNavigate();
  const [rowItems, setRowItems] = useState(4);
  const { isProfessional, isOfType } = useRole();
  const { menuProjects, prototypes, handleContext } = useContext(StoreContext);
  const { load, isLoading } = useFetch<Prototype[]>({
    initialData: [],
    onSuccess: (prototypes) => handleContext('prototypes', prototypes)
  });
  // useNotifications();
  const isContractor = !isOfType(UserRoles.Contractor);

  useEffect(() => {
    if (isContractor) load(getAllPrototypes());
    // eslint-disable-next-line
  }, []);

  const resizeHandler = useCallback(() => {
    if (window.innerWidth > 1500) {
      if (rowItems !== 4) setRowItems(4);
    } else if (window.innerWidth > 1280) {
      if (rowItems !== 3) setRowItems(3);
    } else if (rowItems !== 2) {
      setRowItems(2);
    }
  }, [rowItems]);

  useLayoutEffect(() => {
    window.addEventListener('resize', resizeHandler);
    resizeHandler();
    return () => {
      window.removeEventListener('resize', resizeHandler);
    };
  }, [rowItems]);

  const Children = (
    <>
      <GridItems<Brief>
        handleMore={() => navigate('/projects/all')}
        data={[...menuProjects].slice(0, isProfessional ? rowItems : rowItems - 1)}
        showMore={menuProjects.length > rowItems}
        Card={ProjectCard}
        label="all"
      />
      {/* <GridItems<GettingStartedProps>
        handleMore={() => navigate("/projects/tutorials")}
        gridClassName="!grid-cols-3"
        data={GettingStartedData}
        label="Getting started"
        Card={TutorialCard}
      /> */}
      {isContractor && (
        <GridItems<Prototype>
          handleMore={() => {
            navigate('/projects/prototypes');
          }}
          showMore={prototypes.length > rowItems}
          gridClassName="xl:!grid-cols-3"
          Card={PrototypeCard}
          label="prototypes"
          {...{ isLoading }}
          data={prototypes}
        />
      )}
    </>
  );

  return Children;
};

export { ProjectHomeIndex };
export default ProjectsHome;
