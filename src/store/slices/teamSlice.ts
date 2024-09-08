import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

type team = {
  data: {
    [key: string]: {
      [key: string]: any;
    };
  };
  loading: boolean;
};

let initialState: team = {
  data: {},
  loading: false
};
export const counterSlice = createSlice({
  name: 'team',
  initialState,
  reducers: {
    addMember: (state, object) => {
      let newState = state;
      newState.data[object.payload._id] = object.payload;
    },
    setLoading: (state, object) => {
      let newState = state;
      newState.loading = object.payload;
    },
    addAllMembers: (state, object) => {
      let newState = state;
      newState.data = object.payload;
    },
    clear: (state) => {
      return initialState;
    },
    setExact: (state, object) => {
      return object.payload;
    }
  }
});

export const { addMember, clear, setLoading, addAllMembers, setExact } = counterSlice.actions;

export const teamState = (state: RootState) => state.team;
export default counterSlice.reducer;
