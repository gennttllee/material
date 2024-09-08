import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { RootState } from '../index';

interface MessageModal {
  isOpen: boolean;
  taskId?: string;
}

let initialState: MessageModal = {
  isOpen: false,
  taskId: ''
};
export const messageModalSlice = createSlice({
  name: 'messageModal',
  initialState,
  reducers: {
    setMessageModal: (state, object) => {
        let newState = state
        newState = object.payload
      return newState
    }
  }
});

export const { setMessageModal } = messageModalSlice.actions;

export const selectCount = (state: RootState) => state.messageModal;
export default messageModalSlice.reducer;
