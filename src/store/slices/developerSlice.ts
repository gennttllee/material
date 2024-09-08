import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { object } from 'yup';
import { Persona } from 'types';

type State = {
  loading: boolean;
  data: Persona[];
};

let initialState: State = {
  loading: false,
  data: []
};

export const developerSlice = createSlice({
  name: 'developers',
  initialState,
  reducers: {
    loadDevelopers: (_, object: PayloadAction<State>) => {
      return object.payload;
    },
    updateDeveloper: (state, object: PayloadAction<Persona>) => {
      let newState = state;
      newState.data = newState.data.map((m) => {
        if (m._id === object.payload._id) {
          return object.payload;
        }
        return m;
      });

      return newState;
    }
  }
});

export const { loadDevelopers, updateDeveloper } = developerSlice.actions;

export const professionals = (state: RootState) => state.developers;
export default developerSlice.reducer;
