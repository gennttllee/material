import React, { useMemo, useState, useEffect, useContext } from 'react';
import { TbChevronRight, TbChevronLeft, TbChevronDown } from 'react-icons/tb';
import NewGroupModal from './NewGroupModal';
import NewTaskModal from './NewTaskModal';
import { useAppDispatch, useAppSelector } from 'store/hooks';
export const types = ['Direct Messages', 'Groups', 'Tasks'];
import UsePending, { countPending } from './UsePending';
import moment from 'moment';
import { LoaderX } from 'components/shared/Loader';
import SimpleImage from './SimpleImage';
import { centered } from 'constants/globalStyles';
import { StoreContext } from 'context';
import { number } from 'yup';
import { setSelection } from 'store/slices/chatsSlice';
import axios from 'axios';
import { setChatModal } from 'store/slices/chatModalSlice';
function ChatGroups({ toggle }: { toggle: () => void }) {
  return (
    <div className="w-full flex flex-col max-h-full overflow-y-auto bg-white gap-y-0.5 rounded-md">
      {types.map((m, i) => (
        <List toggle={toggle} key={m} type={m as ListProps['type']} />
      ))}
    </div>
  );
}

export interface ListProps {
  type: 'Direct Messages' | 'Groups' | 'Tasks';
  toggle: () => void;
}
const TitleMap = {
  'Direct Messages': 'Direct Messages',
  Tasks: 'Task-based Messages',
  Groups: 'Group Messages'
};
const List = ({ type, toggle }: ListProps) => {
  const [open, setOpen] = useState(false);
  let user = useAppSelector((m) => m.user);
  const toggleList = () => {
    setOpen(!open);
  };
  let dispatch = useAppDispatch();

  const handleSelection = (type: ListProps['type'], id: string) => () => {
    dispatch(setSelection({ type, id }));
  };
  let chats = useAppSelector((m) => m.chats);

  const list = useMemo(() => {
    let { groups } = chats[type];
    let ids = Object.keys(groups);
    return ids;
  }, [chats, type, chats.groups]);

  const pending = useMemo(() => {
    let acc: { [key: string]: number } = {};
    let count = 0;
    let groups = Object.keys(chats[type].groups);
    for (let group of groups) {
      count += countPending(chats[type]?.groups[group], user._id as string);
    }
    return count;
  }, [chats]);

  // const totalUnreadMessages = useMemo(() => {
  //   let count = 0;
  //   for (let acc of Object.values(pending)) {
  //     count += acc;
  //   }
  //   return count;
  // }, [pending]);

  return (
    <div className="w-full">
      <div
        onClick={toggleList}
        className="w-full bg-ashShade-0 cursor-pointer flex items-center justify-between py-2.5 px-4">
        <span className=" flex items-center">
          {open ? (
            <TbChevronDown className=" text-ashShade-2" />
          ) : (
            <TbChevronRight className=" text-ashShade-2" />
          )}
          <span className="ml-2 text-bblack-1 text-sm"> {TitleMap[type]}</span>
        </span>
        <span className=" flex items-center gap-4">
          {' '}
          {type !== 'Direct Messages' && (
            <span
              onClick={(e) => {
                e.stopPropagation();
                dispatch(
                  setChatModal({
                    isOpen: true,
                    modalName: type === 'Groups' ? 'newGroupModal' : 'newTaskModal'
                  })
                );
              }}
              className="w-5 h-5 cursor-pointer text-white flex items-center justify-center rounded-lg bg-ashShade-2">
              +
            </span>
          )}
          {!(open || pending < 1) && (
            <span className=" bg-borange px-1.5 min-w-[20px] text-center rounded-lg text-white text-xs">
              {pending}
            </span>
          )}
        </span>
      </div>
      {open && (
        <div className="">
          {list.map((m, i) => (
            <Contact
              toggle={toggle}
              key={m}
              id={m}
              Onclick={handleSelection(type, m)}
              isFirst={i === 0}
              type={type}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export const ChatNotification = (val: number = 0, classes: string = '') => {
  return (
    <span
      className={
        ' bg-borange px-1.5 min-w-[20px] text-center rounded-lg text-white text-xs ' + classes
      }>
      {val}
    </span>
  );
};

interface ContactProps {
  name?: string;
  id: string;
  _id?: string;
  isFirst?: boolean;
  isLast?: boolean;
  unread?: number;
  Onclick?: any;
  selected?: boolean;
  type: ListProps['type'];
  classes?: string;
  hideDetails?: boolean;
  toggle?: () => void;
  makewhite?: boolean;
}

export const Contact = ({
  id,
  Onclick,
  selected,
  type,
  classes,
  hideDetails,
  toggle,
  makewhite
}: ContactProps) => {
  let [image, setImage] = useState('');

  let { selectedProjectIndex, selectedData } = useContext(StoreContext);
  const [initials, setInitials] = useState('');
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState('');
  let chat = useAppSelector((m) => m.chats);
  let user = useAppSelector((m) => m.user);
  let team = useAppSelector((m) => m.team);

  const lastMessage = useMemo(() => {
    if (Array.isArray(chat[type].groups[id])) {
      let mychats = chat[type].groups[id];
      let lastChat = mychats[mychats.length - 1];
      return lastChat;
    }
    return null;
  }, [chat]);

  const countPending = UsePending(id, type);

  const getUserDetails = async () => {
    setLoading(true);

    if (type === 'Direct Messages') {
      let details = team.data[id];
      setImage(details?.logo || '');
      setNames(details?.name || '');
      setInitials(details?.initials || '');
    } else {
      if (id === selectedData._id) {
        setImage('');
        setNames('General');
        setInitials('G');
      } else {
        let name = chat.groups[type === 'Tasks' ? 'tasks' : 'groups'][id]?.name;
        if (name) {
          setNames(name || '');
          setInitials(name.slice(0, 2)?.toUpperCase() ?? '');
          setImage('');
        }
      }
    }
    setLoading(false);
  };
  useEffect(() => {
    getUserDetails();
  }, [chat]);

  return (
    <div
      onClick={() => {
        if (Onclick) Onclick();
        if (toggle) toggle();
      }}
      className={` p-4 hover:bg-lightblue gap-x-4 cursor-pointer w-full flex items-center text-black ${
        chat.selection.type === type && chat.selection.id === id && !makewhite
          ? ' bg-lightblue'
          : 'bg-white '
      } ${!(image || names || initials) ? '' : ''} `}>
      {image ? (
        <SimpleImage
          className={
            'w-14 h-14 object-cover shadow-inner rounded-full overflow-hidden border-2 ' + classes
          }
          url={image}
        />
      ) : (
        <div
          className={
            ' w-14 h-14 text-white bg-redShade-1 rounded-full flex items-center justify-center border-2 border-bash ' +
            classes
          }>
          {loading ? <LoaderX /> : <p className=" text-2xl">{initials}</p>}
        </div>
      )}
      <div className="flex-1">
        <div className={`w-full flex flex-col gap-y-1 justify-between`}>
          <div className=" w-full flex items-center justify-between ">
            <p className="font-semibold text-base">{names}</p>
            {!hideDetails && (
              <p className="text-xs text-bblack-1">
                {lastMessage?.message?.createdAt
                  ? moment(new Date(lastMessage?.message.createdAt)).fromNow()
                  : ''}
              </p>
            )}
          </div>
          <div className=" w-full flex items-center justify-between h-full">
            {!hideDetails && (
              <p className="font-Medium text-sm truncate w-full">
                {lastMessage ? lastMessage?.message.body.slice(0, 30) + '...' : ''}
              </p>
            )}

            {countPending > 0 && !hideDetails && (
              <strong
                className={'text-white text-sm bg-orange-500 rounded-full w-5 h-5 mt-2' + centered}>
                {countPending}
              </strong>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatGroups;
