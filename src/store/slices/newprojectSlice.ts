import { createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';

export interface NewProject {
  id: string;
}

let initialState: NewProject = {
  id: ''
};
export const newProjectSlice = createSlice({
  name: 'newProject',
  initialState,
  reducers: {
    setNewProject: (state, object) => {
      return { id: object.payload };
    }
  }
});

export const { setNewProject } = newProjectSlice.actions;

export const selectUser = (state: RootState) => state.newProject;
export default newProjectSlice.reducer;
