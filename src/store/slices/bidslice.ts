import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';

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

let initialState: any = {};

export const bidSlice = createSlice({
  name: 'bid',
  initialState,
  reducers: {
    addContractor: (state, object) => {
      return [...state, object.payload];
    },
    switchBid: (state, object) => {
      return object.payload;
    },
    updateField: (state, object) => {
      let newState = { ...state, ...object.payload };
      return newState;
    },
    clearBids: () => {
      return {};
    },
    refresh: async () => {}
  },
  extraReducers: (builder) => {
    builder.addCase(refreshBid.fulfilled, (state: any, object: any) => {
      if (object.payload !== null) {
        return object.payload;
      }
    });
  }
});

export const { addContractor, switchBid, updateField, clearBids } = bidSlice.actions;
export { refreshBid };
export const bid = (state: RootState) => state.bid;
export default bidSlice.reducer;
