import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Inventory } from 'components/projects/procurement/inventory/types';
import { inventoryData } from 'components/projects/procurement/inventory/constants';

export interface Contractor {}

let initialState: {
  loading?: boolean;
  data: Inventory[];
} = {
  loading: false,
  data: inventoryData
};

export const inventorySlice = createSlice({
  name: 'inventoryRegister',
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

export const { loadRecords, updateRecord, removeRecord, addRecord } = inventorySlice.actions;

export const record = (state: RootState) => state.bookKeeping;
export default inventorySlice.reducer;
