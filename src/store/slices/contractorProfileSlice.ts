import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';

export interface Contractor {
  display: boolean;
  profId: string;
  type: string;
}

let initialState: Contractor = {
  display: false,
  profId: '',
  type: ''
};

export const contractorModalSlice = createSlice({
  name: 'contractorModal',
  initialState,
  reducers: {
    setModal: (state, object) => {
      let copy = { ...state };
      copy.display = object.payload;
      return copy;
    },
    setContractorId: (state, object) => {
      let copy = { ...state };
      copy.profId = object.payload;
      return copy;
    },
    display: (state, object) => {
      return { display: true, profId: object.payload.profId, type: object.payload.type };
    },
    close: (state) => {
      return { ...state, display: false };
    }
  }
});

export const { display, close, setContractorId, setModal } = contractorModalSlice.actions;

export const contractorModal = (state: RootState) => state.contractorModal;
export default contractorModalSlice.reducer;
