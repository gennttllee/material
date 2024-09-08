import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { Persona } from 'types';

type State = {
  loading: boolean;
  data: Persona[];
};
let initialState: State = {
  loading: false,
  data: []
};

export const projectManagerSlice = createSlice({
  name: 'projectManagers',
  initialState,
  reducers: {
    loadProjectManagers: (_, object: PayloadAction<State>) => {
      return object.payload;
    },
    updateProjectManager: (state, object: PayloadAction<Persona>) => {
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

export const { loadProjectManagers, updateProjectManager } = projectManagerSlice.actions;

export const professionals = (state: RootState) => state.projectManagers;
export default projectManagerSlice.reducer;
