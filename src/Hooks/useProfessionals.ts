import React, { useContext, useEffect, useState } from 'react';
import { postForm } from 'apis/postForm';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { loadNotifications, setNotificationSlice } from 'store/slices/notificationSlice';
import { StoreContext } from 'context';
import { loadProfessionals } from 'store/slices/professionals';
import { getAllProfessionals } from 'pages/projects/Home/Components/Snapshot';

function useProfessionals() {
  let dispatch = useAppDispatch();
  let { data, selectedProjectIndex } = useContext(StoreContext);
  //   const [loading, setLoading] = useState(false);
  let professionals = useAppSelector((m) => m.professionals);

  const loadAllProfessionals = async () => {
    dispatch(loadProfessionals({ loading: true, data: professionals.data }));
    await getAllProfessionals((data: any[]) =>
      dispatch(loadProfessionals({ loading: false, data }))
    );
  };
  useEffect(() => {
    loadAllProfessionals();
  }, [data]);

  return {};
}

export default useProfessionals;
