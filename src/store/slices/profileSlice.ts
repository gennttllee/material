import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';

type Profile = boolean;

let initialState: Profile = false;
export const profileSlice = createSlice({
  name: 'profile',
  initialState,
  reducers: {
    toggle: (state) => {
      return !state;
    }
  }
});

export const { toggle } = profileSlice.actions;

export const selectCount = (state: RootState) => state.counter.value;
export default profileSlice.reducer;
