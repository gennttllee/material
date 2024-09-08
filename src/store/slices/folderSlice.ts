import { RootState } from '../index';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { LatestDoc, NewDoc } from 'components/projects/documents/document-repo/SingleDocModal';
import { Doc } from 'components/projects/documents/drawings/DocModal';
import { FileFolder } from 'components/projects/documents/types';

type Saved = { projectId: string; folder: string };
type folder = {
  folder: any;
  current: string;
  all: LatestDoc[];
  files: LatestDoc[];
  previewing: number;
  modal: boolean;
  projectId: string;
  fileFolders: FileFolder[];
  loading?: boolean;
};

let initialState: folder = {
  folder: {},
  current: '',
  files: [],
  previewing: 0,
  all: [],
  modal: false,
  projectId: '',
  fileFolders: [],
  loading: false
};
export const counterSlice = createSlice({
  name: 'folder',
  initialState,
  reducers: {
    addFolders: (state, action) => {
      let newState = { ...state };
      let folders = localStorage.getItem('folders');
      let data = action.payload.data;
      if (folders) {
        let _folders: Saved[] = JSON.parse(folders);
        for (let i of _folders) {
          if (!data[i.folder] && i.projectId === action.payload.projectId) data[i.folder] = [];
        }
      }
      newState.folder = data;
      newState.projectId = action.payload.projectId;
      return newState;
    },
    setCurrentFolder: (state, action) => {
      let newState = { ...state };
      newState.current = action.payload;
      return newState;
    },
    setFiles: (state, action) => {
      let newState = { ...state };
      newState.files = action.payload;

      return newState;
    },
    addFiles: (state, action) => {
      let newState = { ...state };
      newState.files = [...newState.files, ...action.payload];

      return newState;
    },
    changeFieldValue: (state, action) => {
      let newState: any = { ...state };
      let keys = Object.keys(action.payload);
      for (let i = 0; i < keys.length; i++) {
        newState[keys[i]] = action.payload[keys[i]];
      }
      return newState;
    },
    resetFolders: () => {
      return initialState;
    },

    includeFolder: (state, action) => {
      let newState = state;
      let folders = localStorage.getItem('folders');
      let _folders: Saved[] = [];
      if (folders) {
        _folders = [...JSON.parse(folders)];
        let isAlreadyIn = _folders.filter(
          (m) => m.folder === action.payload && m.projectId === newState.projectId
        );
        if (isAlreadyIn.length < 1) {
          _folders.push({
            projectId: newState.projectId,
            folder: action.payload
          });
        }
      } else {
        _folders.push({
          projectId: newState.projectId,
          folder: action.payload
        });
      }
      localStorage.setItem('folders', JSON.stringify(_folders));
      if (!newState.folder[action.payload]) {
        newState.folder[action.payload] = [];
      }
      return newState;
    },

    addFileFolders: (state, action) => {
      let newState = state;
      newState.fileFolders = action.payload;

      return newState;
    },

    updateFolder: (state, action) => {
      let newState = state;
      newState.fileFolders = newState.fileFolders.map((m) => {
        if (m._id === action.payload._id) {
          return action.payload;
        } else return m;
      });

      return newState;
    },

    updateFile: (state, action) => {
      let newState = state;
      newState.files = newState.files.map((m) => {
        if (m._id === action.payload._id) {
          return action.payload;
        } else return m;
      });

      return newState;
    },

    removeFolder: (state, action: PayloadAction<string>) => {
      let newState = state;
      newState.fileFolders = newState.fileFolders.filter((m) => m._id !== action.payload);

      return newState;
    }
  }
});

export const {
  addFolders,
  resetFolders,
  setCurrentFolder,
  setFiles,
  changeFieldValue,
  includeFolder,
  addFileFolders,
  removeFolder,
  updateFolder,
  updateFile,
  addFiles
} = counterSlice.actions;

export const selectCount = (state: RootState) => state.folder;
export default counterSlice.reducer;
