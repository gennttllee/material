import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { User } from 'types';

export const userSlice = createSlice({
  name: 'user',
  initialState: {} as User,
  reducers: {
    setUser: (state, object: PayloadAction<User | undefined>) => {
      return { ...state, ...object.payload };
    }
  }
});

export const { setUser } = userSlice.actions;

export const selectUser = (state: RootState) => state.user;
export default userSlice.reducer;
