import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { ClusterType, ClusterTypes } from 'types';
import { SubTaskType } from 'Hooks/useProjectTasks';
import { SubTask } from 'components/projects/management/types';

let initialState: {
  loading?: boolean;
  data: SubTask[];
} = {
  loading: false,
  data: []
};

export const subTaskSlice = createSlice({
  name: 'subtask',
  initialState,
  reducers: {
    loadSubTasks: (state, action) => {
      let newState = state;
      for (let x in action.payload) {
        newState[x as keyof typeof initialState] = action.payload[x];
      }
      return newState;
    }
    // updateCluster: (state, action) => {
    //   let newState = state;
    //   for (let x = 0; x < state.data.length; x++) {
    //     if (action.payload._id === newState.data[x]._id) {
    //       newState.data[x] = action.payload;
    //       break;
    //     }
    //   }
    //   return newState;
    // },
    // removeCluster: (state, action) => {
    //   let newState = state;
    //   newState.data = newState.data.filter((m) => m._id !== action.payload);
    //   return newState;
    // }
  }
});

export const { loadSubTasks } = subTaskSlice.actions;

export const subTask = (state: RootState) => state.subTask;
export default subTaskSlice.reducer;
