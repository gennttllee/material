import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { DashboardResponse } from 'components/projects/procurement/dashboard/types';

export interface Contractor {}

let initialState: {
  loading?: boolean;
  data: DashboardResponse[];
} = {
  loading: false,
  data: []
};

export const dashboardSlice = createSlice({
  name: 'dashboard',
  initialState,
  reducers: {
    loadRecords: (state, action) => {
      let newState = state;
      for (let x in action.payload) {
        newState[x as keyof typeof initialState] = action.payload[x];
      }
      console.log(newState, 1234);
      console.log(newState.data.length, 222);

      return newState;
    }
  }
});

export const { loadRecords } = dashboardSlice.actions;

export const record = (state: RootState) => state.bookKeeping;
export default dashboardSlice.reducer;
