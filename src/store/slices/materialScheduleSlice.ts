import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { ClusterType, ClusterTypes } from 'types';
import { MaterialScheduleRecord } from 'components/projects/procurement/material-schedule/types';

export interface Contractor {}

let initialState: {
  loading?: boolean;
  data: MaterialScheduleRecord[];
} = {
  loading: false,
  data: []
};

export const materialScheduleSlice = createSlice({
  name: 'materialSchedule',
  initialState,
  reducers: {
    loadRecords: (state, action) => {
      let newState = state;
      for (let x in action.payload) {
        newState[x as keyof typeof initialState] = action.payload[x];
      }
      return newState;
    },

    addRecord: (state, action) => {
      let newState = state;
      newState.data.push(action.payload);
      return newState;
    },

    addMaterialRecord: (state, action) => {
      return {
        ...state,
        data: state.data.map((material) => {
          if (material._id === action.payload.materialId) {
            return {
              ...material,
              materials: [...material.materials, action.payload.material]
            };
          }
          return material;
        })
      };
    },

    updateRecord: (state, action) => {
      let newState = state;
      newState.data = newState.data.map((m) => {
        if (m._id === action.payload._id) {
          return action.payload;
        }
        return m;
      });
      return newState;
    },
  
    updateMaterialRecord: (state, action) => {
      return {
        ...state,
        data: state.data.map((material) => {
          if (material._id === action.payload.inventoryId) {
            return {
              ...material,
              materials: material.materials.map((material:any) => {
                if (material._id === action.payload.materialId) {
                  console.log(action.payload);
                  return action.payload.material;
                }
                return material;
              })
            };
          }
          return material;
        })
      };
    },


    removeRecord: (state, action) => {
      let newState = state;
      newState.data = newState.data.filter((m) => m._id !== action.payload);
      return newState;
    },

    removeMaterialRecord: (state, action) => {
      return {
        ...state,
        data: state.data.map((material) => {
          if (material._id === action.payload.inventoryId) {
            return {
              ...material,
              materials: material.materials.filter((m:any) => m._id !== action.payload.materialId)
            };
          }
          return material;
        })
      };
    }
  }
});

  

export const { loadRecords, updateRecord, updateMaterialRecord, removeRecord, removeMaterialRecord, addRecord, addMaterialRecord } = materialScheduleSlice.actions;

export const record = (state: RootState) => state.materialSchedule;
export default materialScheduleSlice.reducer;
