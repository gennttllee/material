import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { _NotificationResponse } from 'pages/projects/Home/Components/Notifications';

interface NotificationSlice {
  data: _NotificationResponse[];
  loading: boolean;
}

let initialState: NotificationSlice = { data: [], loading: false };
export const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    loadNotifications: (state, action: PayloadAction<_NotificationResponse[]>) => {
      let newState = state;
      newState.data = action.payload;
      return newState;
    },
    updateNotification: (state, action: PayloadAction<_NotificationResponse>) => {
      let newState = state;
      newState.data = newState.data.map((m) => {
        if (m._id === action.payload._id) {
          return action.payload;
        }
        return m;
      });

      return newState;
    },
    setNotificationSlice: (state, action: PayloadAction<NotificationSlice>) => {
      return action.payload;
    }
  }
});

export const { loadNotifications, updateNotification, setNotificationSlice } =
  notificationSlice.actions;

export const selectNotification = (state: RootState) => state.notification;
export default notificationSlice.reducer;
