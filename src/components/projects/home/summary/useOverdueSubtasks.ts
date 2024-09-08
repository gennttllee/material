import { postForm } from 'apis/postForm';
import { getSubTasks } from 'apis/tasks';
import { StoreContext } from 'context';
import React, { useContext, useEffect } from 'react';
import { useAppDispatch } from 'store/hooks';
import { loadSubTasks } from 'store/slices/subTasks';

const useOverdueSubtasks = () => {
  let dispatch = useAppDispatch();
  let { activeProject } = useContext(StoreContext);

  const getSubTasks = async () => {
    dispatch(
      loadSubTasks({
        loading: true
      })
    );
    let { e, response } = await postForm(
      'get',
      `sub-tasks/overdue?projectId=${activeProject?._id}`
    );
    if (response?.data?.data) {
      let data = response.data.data;

      dispatch(
        loadSubTasks({
          data
        })
      );
    }

    dispatch(
      loadSubTasks({
        loading: false
      })
    );
  };
  useEffect(() => {
    getSubTasks();
  }, []);

  return { getSubTasks };
};

export default useOverdueSubtasks;
