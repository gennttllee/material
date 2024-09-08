import React, { useState, useContext, useEffect, useMemo } from 'react';
import ChatsView from './Components/ChatsView';
import { StoreContext } from 'context';
import { Team } from './Components/ChatsView';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import PrivateChat from './Components/PrivateChat';
import { th } from 'date-fns/locale';
import { LoaderX } from 'components/shared/Loader';
import { TeamContext } from '..';
import noContentImg from 'assets/nocontent.svg';
import { useLocation, useNavigation, useParams } from 'react-router-dom';
import ChatGroups from './Components/ChatGroups';
import { setSelection } from 'store/slices/chatsSlice';
import { setChatModal } from 'store/slices/chatModalSlice';
import AddToGroupModal from './Components/AddToGroupModal';
import NewTaskModal from './Components/NewTaskModal';
import NewGroupModal from './Components/NewGroupModal';
import AddGroupMembers from './Components/AddGroupMembers';
function Chats() {
  const [showChatsModal, setChatsModal] = useState(true);
  const { data, selectedProjectIndex } = useContext(StoreContext);
  let isNav = useLocation();
  let params = useParams();
  let loading = useContext(TeamContext);
  const [showMessages, setShowMessages] = useState(false);
  const [activeChat, setActiveChat] = useState<string | null>(null);
  let token = useMemo(() => localStorage.getItem('token'), []);
  let user = useAppSelector((m) => m.user);
  let team = useAppSelector((m) => m.team);
  let chats = useAppSelector((m) => m.chats);
  let dispatch = useAppDispatch();
  const [theTeam, setTheTeam] = useState<string[]>([]);
  const togglChatsModal = () => {
    setChatsModal((prev) => !prev);
  };
  let _team = useMemo(() => {
    return Object.keys(team.data);
  }, [team]);
  let { isOpen, modalName } = useAppSelector((m) => m.chatModal);

  let projectId = useMemo(() => data[selectedProjectIndex]._id, []);

  let xteam = useMemo(() => {
    return Object.keys(team);
  }, [team]);
  useEffect(() => {
    let myTeam = Object.keys(team.data).filter((m) => m !== user._id);
    setTheTeam(myTeam);
  }, [team]);
  useEffect(() => {
    if (params?.userId) {
      dispatch(
        setSelection({
          id: params.userId,
          type: 'Direct Messages'
        })
      );
    }
  }, [theTeam]);

  const universalCloser = () => {
    dispatch(setChatModal({ isOpen: false, modalName: '' }));
  };

  return (
    <div className="w-full h-full  flex items-start gap-x-4 ">
      {isOpen && modalName === 'newGroupModal' && <NewGroupModal closer={universalCloser} />}
      {isOpen && modalName === 'newTaskModal' && <NewTaskModal closer={universalCloser} />}

      {isOpen && modalName === 'addGroupMemebersModal' && (
        <AddGroupMembers closer={universalCloser} />
      )}

      {loading || team.loading ? (
        <div className="w-full pt-20 col-auto flex items-center justify-center">
          <LoaderX color="blue" />
        </div>
      ) : _team.length < 2 ? (
        <div className="w-full h-full">
          <h2 className="mt-2 text-center">Seems you are the only one on this project</h2>
        </div>
      ) : (
        <>
          <div
            className={`overflow-y-scroll scrollbar max-h-full lg:w-2/5 lg:block ${
              !showMessages ? ' w-full block' : 'hidden'
            }`}>
            <ChatGroups toggle={() => setShowMessages(!showMessages)} />
          </div>
          <div
            className={`${
              showMessages ? ' w-full block' : 'hidden'
            } lg:w-3/5 h-full max-h-full lg:block `}>
            {chats.selection.id ? (
              <PrivateChat toggle={() => setShowMessages(!showMessages)} />
            ) : (
              <div className="w-full h-full rounded-md bg-white flex items-center justify-center">
                <img className="w-56 h-56 " src={noContentImg} />
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}

export default Chats;
