import { PayloadAction, createSlice } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { object } from 'yup';

export interface Contractor {
  email: string;
  firstName: string;
  lastName: string;
  password: string;
  phoneNumber: string;
  city: string;
  role: string;
  _id: string;
}
type State = {
  loading: boolean;
  data: Contractor[];
};
let initialState: State = {
  loading: false,
  data: []
};

export const ProfessionalSlice = createSlice({
  name: 'professionals',
  initialState,
  reducers: {
    loadProfessionals: (state, object: PayloadAction<State>) => {
      return object.payload;
    },
    updateProfessional: (state, object: PayloadAction<Contractor>) => {
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

export const { loadProfessionals, updateProfessional } = ProfessionalSlice.actions;

export const professionals = (state: RootState) => state.professionals;
export default ProfessionalSlice.reducer;
