import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { ClusterType, ClusterTypes } from 'types';

export interface Contractor {}

const refreshBid = createAsyncThunk('/bid', async (id: string) => {
  const { response } = await postForm('get', `bids/${id}`);
  if (response) {
    return response.data.data[0];
  } else {
    displayError("Couldn't refresh bid");
    return null;
  }
});

let initialState: {
  loading?: boolean;
  data: ClusterType[];
  current?: ClusterType;
  currentType?:ClusterTypes
} = {
  loading: false,
  data: []
};

export const clusterSlice = createSlice({
  name: 'cluster',
  initialState,
  reducers: {
    loadClusters: (state, action) => {
      let newState = state;
      for (let x in action.payload) {
        newState[x as keyof typeof initialState] = action.payload[x];
      }
      return newState;
    },
    updateCluster: (state, action) => {
      let newState = state;
      for (let x = 0; x < state.data.length; x++) {
        if (action.payload._id === newState.data[x]._id) {
          newState.data[x] = action.payload;
          break;
        }
      }
      return newState;
    },
    removeCluster: (state, action) => {
      let newState = state;
      newState.data = newState.data.filter((m) => m._id !== action.payload);
      return newState;
    }
  }
});

export const { loadClusters, updateCluster, removeCluster } = clusterSlice.actions;

export const cluster = (state: RootState) => state.cluster;
export default clusterSlice.reducer;
