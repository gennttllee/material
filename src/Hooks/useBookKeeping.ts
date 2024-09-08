import { displayError } from 'Utils';
import { postForm } from 'apis/postForm';
import { StoreContext } from 'context';
import React, { useContext, useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { loadRecords } from 'store/slices/bookKeepingSlice';
import { display } from 'store/slices/contractorProfileSlice';

const useBookKeeping = (wait: boolean = false) => {
  let { selectedProject } = useContext(StoreContext);
  let dispatch = useAppDispatch();
  const getRecords = async () => {
    dispatch(loadRecords({ loading: true }));
    let { e, response } = await postForm(
      'get',
      `financials/bookkeeping/list?project=${selectedProject?._id}`
    );

    if (response) {
      dispatch(loadRecords({ data: response.data.data, loading: false }));
    } else {
      dispatch(loadRecords({ loading: false }));
      displayError(e?.message || 'Could not fetch records');
    }
  };

  useEffect(() => {
    if (!wait) {
      getRecords();
    }
  }, []);

  useEffect(() => {
    getRecords();
  }, [selectedProject?._id]);

  return { getRecords };
};

export default useBookKeeping;
