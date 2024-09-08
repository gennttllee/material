import React, { useContext, useEffect, useState } from 'react';
import { postForm } from 'apis/postForm';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { loadNotifications, setNotificationSlice } from 'store/slices/notificationSlice';
import { StoreContext } from 'context';

function useNotifications() {
  let dispatch = useAppDispatch();
  let { data, selectedProjectIndex } = useContext(StoreContext);
  let user = useAppSelector((m) => m.user);
  const [loading, setLoading] = useState(false);
  const fetchNotification = async () => {
    return await postForm('get', 'notification/all');
  };

  const _notifications = async () => {
    dispatch(
      setNotificationSlice({
        loading: true,
        data: []
      })
    );

    let { response, e } = await fetchNotification();

    dispatch(
      setNotificationSlice({
        data: response && response?.data?.data ? response.data.data.reverse() : [],
        loading: false
      })
    );
  };

  useEffect(() => {
    _notifications();
  }, [user]);

  return { loading };
}

export default useNotifications;
