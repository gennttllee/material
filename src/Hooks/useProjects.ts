import { StoreContext } from 'context';
import { makeRequest } from 'pages/projects/Helper';
import React, { useCallback, useContext } from 'react';

const useProjects = () => {
  const { selectedProjectIndex, handleContext, menuProjects, setContext } =
    useContext(StoreContext);
  const fetchProjects = useCallback(async () => {
    await makeRequest(setContext);
  }, []);

  return { fetchProjects };
};

export default useProjects;
