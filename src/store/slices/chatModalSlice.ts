import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface ChatModal {
  isOpen: boolean;
  modalName?: string;
}

let initialState: ChatModal = {
  isOpen: false,
  modalName: ''
};
export const chatModalSlice = createSlice({
  name: 'chatModal',
  initialState,
  reducers: {
    setChatModal: (state, object) => {
      let newState = state;
      newState = object.payload;
      return newState;
    }
  }
});

export const { setChatModal } = chatModalSlice.actions;

export const selectCount = (state: RootState) => state.chatModal;
export default chatModalSlice.reducer;
