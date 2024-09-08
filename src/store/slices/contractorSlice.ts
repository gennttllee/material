import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';

export interface Contractor {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  city: string;
  role: string;
  _id: string;
}

let initialState: any[] = [];

export const contractorSlice = createSlice({
  name: 'contractor',
  initialState,
  reducers: {
    addContractor: (state, object) => {
      return [...state, object.payload];
    },
    removeContractor: (state, object) => {
      let newState = state.slice().filter((m) => m._id !== object.payload._id);
      return newState;
    },
    clearContractors: () => {
      return [];
    }
  }
});

export const { clearContractors, addContractor, removeContractor } = contractorSlice.actions;

export const contractor = (state: RootState) => state.contractor;
export default contractorSlice.reducer;
