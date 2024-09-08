import { configureStore } from '@reduxjs/toolkit';
import Counter from './slices/counterSlice';
import User from './slices/userSlice';
import newProject from './slices/newprojectSlice';
import ProfilePage from './slices/profileSlice';
import Contractor from './slices/contractorSlice';
import Bid from './slices/bidslice';
import ContractorModal from './slices/contractorProfileSlice';
import Folder from './slices/folderSlice';
import Finance from './slices/financeSlice';
import Chats from './slices/chatsSlice';
import Team from './slices/teamSlice';
import Notification from './slices/notificationSlice';
import Professionals from './slices/professionals';
import developerSlice from './slices/developerSlice';
import projectManagerSlice from './slices/projectManagerSlice';
import messageModal from './slices/taskMessagesModalSlice';
import ChatModal from './slices/chatModalSlice';
import clusterSlice from './slices/clusterSlice';
import bookKeepingSlice from './slices/bookKeepingSlice';
import subTaskSlice from './slices/subTasks';
import supplySlice from './slices/supplySlice';
import dashboardSlice from './slices/dashboard';
import inventorySlice from './slices/inventorySlice';
import materialScheduleSlice from './slices/materialScheduleSlice';

const store = configureStore({
  reducer: {
    counter: Counter,
    user: User,
    newProject: newProject,
    profilepage: ProfilePage,
    contractor: Contractor,
    bid: Bid,
    contractorModal: ContractorModal,
    folder: Folder,
    finance: Finance,
    chats: Chats,
    team: Team,
    notification: Notification,
    professionals: Professionals,
    developers: developerSlice,
    projectManagers: projectManagerSlice,
    messageModal: messageModal,
    chatModal: ChatModal,
    cluster: clusterSlice,
    bookKeeping: bookKeepingSlice,
    subTask: subTaskSlice,
    supply: supplySlice,
    dashboard: dashboardSlice,
    materialSchedule: materialScheduleSlice,
    inventoryRegister: inventorySlice
  }
});

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export default store;
