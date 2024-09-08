import { displaySuccess } from 'Utils';
import { postForm } from 'apis/postForm';
import { StoreContext } from 'context';
import { makeRequest } from 'pages/projects/Helper';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { loadClusters } from 'store/slices/clusterSlice';
import { display } from 'store/slices/contractorProfileSlice';

const useClusters = (wait = false) => {
  let dispatch = useAppDispatch();
  const { setContext, menuProjects } = useContext(StoreContext);
  const getClusters = async () => {
    dispatch(loadClusters({ data: [], loading: true }));
    let { e, response } = await postForm('get', 'clusters');
    if (e) {
      dispatch(loadClusters({ loading: false }));
    } else {
      dispatch(loadClusters({ data: response.data.data, loading: false }));
    }
  };

  const refreshproject = async () => {
    makeRequest(setContext);
  };

  useEffect(() => {
    if (!wait) {
      getClusters();
    }
  });

  return { getClusters, refreshproject };
};

export default useClusters;
