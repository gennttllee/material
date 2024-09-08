import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { ClusterType, ClusterTypes } from 'types';
import { Record } from 'components/projects/financials/book-keeping/types';

export interface Contractor {}

let initialState: {
  loading?: boolean;
  data: Record[];
} = {
  loading: false,
  data: []
};

export const bookKeepingSlice = createSlice({
  name: 'bookKeeping',
  initialState,
  reducers: {
    loadRecords: (state, action) => {
      let newState = state;
      for (let x in action.payload) {
        newState[x as keyof typeof initialState] = action.payload[x];
      }
      return newState;
    },
    addRecord: (state, action) => {
      let newState = state;
      newState.data.push(action.payload);
      return newState;
    },
    updateRecord: (state, action) => {
      let newState = state;
      newState.data = newState.data.map((m) => {
        if (m._id === action.payload._id) {
          return action.payload;
        }
        return m;
      });
      return newState;
    },
    removeRecord: (state, action) => {
      let newState = state;
      newState.data = newState.data.filter((m) => m._id !== action.payload);
      return newState;
    }
  }
});

export const { loadRecords, updateRecord, removeRecord, addRecord } = bookKeepingSlice.actions;

export const record = (state: RootState) => state.bookKeeping;
export default bookKeepingSlice.reducer;
