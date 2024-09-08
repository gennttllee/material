import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';

export type TExpenditure = {
  title: string;
  taskId: string;
  amount: number;
  status: string;
  description: string;
  _id: string;
  createdAt: Date;
};

export type TPayment = {
  file: {
    bucket: string;
    key: string;
  };
  amount: number;
  createdAt: Date;
  isConfirmed: boolean;
  date: string;
  _id: string;
};

export type TDisbursements = {
  _id: string;
  amount: number;
  dueDate: string;
  createdAt: string;
  isConfirmed: boolean;
};

export type TFinance = {
  bidId?: string;
  bidName?: string;
  payments?: TPayment[];
  estimatedBudget?: number;
  expenditure?: TExpenditure[];
  disbursements?: TDisbursements[];
  projectId?: string;
  __v?: 0;
  _id?: string;
  contractor?: string;
};

interface FinanceState {
  data: TFinance;
  modal: {
    isEditing: boolean;
    name?: 'budget' | 'payment' | 'tranch' | 'expenditure';
    open: boolean;
    _id?: string;
  };
}

let initialState: FinanceState = {
  data: {},
  modal: {
    isEditing: false,
    name: undefined,
    open: false
  }
};
export const FinanceSlice = createSlice({
  name: 'finance',
  initialState,
  reducers: {
    populate: (state, object: PayloadAction<TFinance>) => {
      return { data: { ...state.data, ...object.payload }, modal: state.modal };
    },
    updateField: (state, object) => {
      let newState: any = state;
      newState.data[object.payload.field] = object.payload.data;
      return newState;
    },
    closeModal: (state) => {
      let newState: any = state;
      newState.modal = {
        isEditing: false,
        name: undefined,
        open: false
      };

      return newState;
    },
    openModal: (state, object) => {
      let newState: any = state;
      newState.modal = { open: true, ...object.payload };
      return newState;
    }
  }
});

export const { populate, updateField, closeModal, openModal } = FinanceSlice.actions;

export const selectFinance = (state: RootState) => state.finance;
export default FinanceSlice.reducer;
