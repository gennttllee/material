import { PayloadAction, createSlice, current } from '@reduxjs/toolkit';
import { RootState } from '../index';
import { ListProps } from 'components/projects/Team/Views/Components/ChatGroups';

export type MessageEvent = {
  origin: string;
  destination: string;
  message: {
    body: string;
    projectId: string;
    taskId?: string;
    groupId?: string;
    createdAt?: string;
    status?: 'pending' | 'read' | 'delivered';
  };
  type?: 'Message' | 'Notification';
  _id?: string;
  __v?: number;
  reads?: {
    _id?: string;
    userId: string;
    status: 'pending' | 'read' | 'delivered';
  }[];
  createdAt: string;
  updatedAt: string;
};

export interface Group {
  _id: string;
  projectId: string;
  name: string;
  taskId?: string;
  members: Member[];
  createdBy: string;
  createdAt: string;
  __v: number;
}

export interface Member {
  userId: string;
  role: string;
  _id: string;
}

type GroupType = {
  groups: {
    [key: string]: MessageEvent[];
  };
};

type MessageBuckets = 'Direct Messages' | 'Groups' | 'Tasks';

type ChatType = {
  socket?: any;
  'Direct Messages': GroupType;
  Groups: GroupType;
  Tasks: GroupType;
  groups: {
    tasks: { [key: string]: Group };
    groups: { [key: string]: Group };
  };
  currentUser?: string;
  selection: {
    type?: ListProps['type'] | '';
    id?: string;
  };
};

const emptyGroup = {
  groups: {}
};

let initialState: ChatType = {
  groups: { tasks: {}, groups: {} },
  'Direct Messages': { ...emptyGroup },
  Groups: { ...emptyGroup },
  Tasks: { ...emptyGroup },
  selection: {
    type: '',
    id: ''
  }
};

const handleGroup = (m: Group, newState: ChatType) => {
  let bucket: 'tasks' | 'groups' = m?.taskId ? 'tasks' : 'groups';
  let id = bucket === 'tasks' ? m.taskId ?? '' : m._id;
  let group = (bucket === 'tasks' ? 'Tasks' : 'Groups') as ListProps['type'];
  newState.groups[bucket][id] = m;
  if (!newState[group].groups[id]) {
    newState[group].groups[id] = [];
  }
};

const handleMessage = (m: MessageEvent, newState: ChatType, currentUser: string = '') => {
  const isTask = Boolean(m.message?.taskId);
  let isGeneral = m.message.projectId === m.destination;
  const isGroup = m.message?.groupId || isGeneral;
  const isDM = !isTask && !isGroup;
  let correspondent = m.destination === currentUser ? m.origin : m.destination;

  let group = (isTask ? 'Tasks' : isDM ? 'Direct Messages' : 'Groups') as ListProps['type'];
  const receiver = (
    isTask
      ? m.message.taskId
      : isDM
        ? correspondent
        : isGeneral
          ? m.message.projectId
          : m.message.groupId
  ) as string;

  if (newState[group]['groups'][receiver]) {
    newState[group]['groups'][receiver].push(m);
  } else {
    newState[group]['groups'][receiver] = [m];
  }
};

export const chatsSlice = createSlice({
  name: 'chats',
  initialState,
  reducers: {
    addMessage: (state, object) => {
      let newState = state;
      let m = object.payload;
      handleMessage(m, newState, current(state).currentUser);
      return newState;
    },
    loadMessages: (state, object) => {
      let newState = state;
      for (let m of object.payload as MessageEvent[]) {
        handleMessage(m, newState, current(state).currentUser);
      }
      return newState;
    },
    update: (state, object) => {
      let newState = state;
      let { destination, origin } = object.payload;
      let correspondent = destination === state.currentUser ? origin : destination;
      let m = object.payload;
      const isTask = Boolean(m.message?.taskId);
      let isGeneral = m.message.projectId === m.destination;
      const isGroup = m.message?.groupId || isGeneral;
      const isDM = !isTask && !isGroup;
      let Group = isDM ? 'Direct Messages' : isTask ? 'Tasks' : 'Groups';

      newState[Group as ListProps['type']].groups[correspondent] = newState[
        Group as ListProps['type']
      ].groups[correspondent].map((m) => {
        if (m._id === object.payload._id) {
          return object.payload;
        }
        return m;
      });
      return newState;
    },

    loadGroups: (state, object: PayloadAction<Group[]>) => {
      let newState = state;
      let groups = object.payload;
      for (let m of groups) {
        handleGroup(m, newState);
      }
      return newState;
    },
    addGroupOrTasks: (state, object: PayloadAction<Group>) => {
      let newState = state;
      let m = object.payload;
      handleGroup(m, newState);
      return newState;
    },
    reset: (state) => {
      let newState = state;
      for (let key in initialState) {
        let m = key as keyof ChatType;
        newState[m] = initialState[m];
      }

      return newState;
    },
    clearMessages: (state) => {
      let newState = state;
      let groups = ['Direct Messages', 'Tasks', 'Groups'] as MessageBuckets[];
      for (let x of groups) {
        newState[x] = initialState[x];
      }
      return newState;
    },
    updateChatGroup: (state, object) => {
      let newState = state;
      newState.groups.groups[object.payload._id] = object.payload;

      return newState;
    },
    setUser: (state, object) => {
      let newState = state;
      newState.currentUser = object.payload;
      return newState;
    },
    initialise: (state, object: PayloadAction<{ DMS: { [key: string]: [] }; general: string }>) => {
      let newState = state;
      let { DMS, general } = object.payload;
      newState['Direct Messages'].groups = DMS;
      newState['Groups'].groups[general] = [];
      return newState;
    },

    setSelection: (state, object) => {
      let newState = state;
      newState.selection = object.payload;
    },
    switchBid: (state, object) => {
      return object.payload;
    }
  }
});

export const {
  switchBid,
  addMessage,
  update,
  reset,
  setUser,
  loadMessages,
  setSelection,
  initialise,
  loadGroups,
  addGroupOrTasks,
  updateChatGroup,
  clearMessages
} = chatsSlice.actions;
export const chats = (state: RootState) => state.chats;
export default chatsSlice.reducer;
