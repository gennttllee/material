import { displayError, displaySuccess } from 'Utils';
import { postForm } from 'apis/postForm';
import { StoreContext } from 'context';
import React, { useContext, useEffect, useState } from 'react';
import { useAppDispatch } from 'store/hooks';
import { loadRecords } from 'store/slices/materialScheduleSlice';

// interface createScheduleProps {
//   name: string;
//   projectId: string;
//   description: string;
// }

const useMaterialSchedule = (wait: boolean = false) => {
  let { selectedProject } = useContext(StoreContext);
  const [data, setData] = useState<any[]>([]);
  const [scheduleMaterials, setScheduleMaterials] = useState<any[]>([]);
  const [scheduleMaterialsId, setScheduleMaterialsId] = useState<string | null>(null);
  let dispatch = useAppDispatch();

  const getRecords = async () => {
    dispatch(loadRecords({ loading: true }));
    let { e, response } = await postForm(
      'get',
      `procurements/material-schedule/list?projectId=${selectedProject?._id}`
    );

    console.log(response, 'response');

    if (response) {
      dispatch(loadRecords({ data: response.data.data, loading: false }));
    } else {
      dispatch(loadRecords({ loading: false }));
      displayError(e?.message || 'Could not fetch records');
    }
  };

  const getScheduleMaterials = async (scheduleId: string) => {
    if (!scheduleId) {
      displayError('Schedule ID is required and cannot be empty.');
      return;
    }

    let { e, response } = await postForm(
      'get',
      `procurements/material-schedule/find?scheduleId=${scheduleId}`
    );


    if (response) {
      console.log(response.data.data);
      setScheduleMaterials(response.data.materials);
    } else {
      displayError(e?.message || 'Could not fetch schedule materials');
    }
  };

  useEffect(() => {
    getRecords();
  }, []);

  // useEffect(() => {
  //   if (!wait) {
  //     getRecords();
  //   }
  // }, [wait, selectedProject?._id]);

  useEffect(() => {
    if (scheduleMaterialsId) {
      getScheduleMaterials(scheduleMaterialsId);
    } else {
      displayError('No valid schedule ID found.');
    }
  }, [scheduleMaterialsId]);

  // triggerRefresh
  return { getRecords, getScheduleMaterials, scheduleMaterials, setScheduleMaterialsId };
};

export default useMaterialSchedule;
