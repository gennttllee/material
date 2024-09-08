import React, {
  useState,
  useEffect,
  useContext,
  useRef,
  useMemo,
  useCallback,
  forwardRef
} from 'react';
import { BsSend } from 'react-icons/bs';
import { TbChevronDown, TbUser } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { HiArrowLongLeft } from 'react-icons/hi2';
import { IoEllipsisVertical } from 'react-icons/io5';
import SimpleImage from './SimpleImage';
import { postForm } from 'apis/postForm';
import useContractorDetails from 'Hooks/useContractorDetails';
import { isProfessional } from './MemberList';
import { LoaderX } from 'components/shared/Loader';
import Message from './Message';
import noContentImg from 'assets/nocontent.svg';
import { centered, flexer, hoverFade, spacer } from 'constants/globalStyles';
import { MESSAGING_REST } from 'apis/postForm';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { StoreContext } from 'context';
import { addMessage, chats } from 'store/slices/chatsSlice';
import moment from 'moment';
import DateGroup from './DateGroup';
import { MessageEvent } from 'store/slices/chatsSlice';
import { useClickOutSideComponent } from './OnScreen';
import { display } from 'store/slices/contractorProfileSlice';
import { DropDownOptions } from 'components/shared/SelectBox';
import AddToGroupModal from './AddToGroupModal';
import AddGroupMembers from './AddGroupMembers';
import { Contact, ListProps } from './ChatGroups';
import { purge, removeemptyFields } from 'pages/projectform/utils';
import { setChatModal } from 'store/slices/chatModalSlice';
import GroupMemberList from './GroupMemberList';
import { FetchImage } from 'components/shared/FetchImage';
import { cleanError, displayError } from 'Utils';

interface PrivateChatProps {
  // userId: string;
  // selected: number;
  toggle: () => void;
}

const _format = (date: Date | string | number) => moment(new Date(date)).format('MMMM Do YYYY');

const PrivateChat = ({ toggle }: PrivateChatProps) => {
  const { data, selectedProjectIndex } = useContext(StoreContext);
  let chat = useAppSelector((m) => m.chats);
  let user = useAppSelector((m) => m.user);
  let team = useAppSelector((m) => m.team);
  const { _id } = useAppSelector((m) => m.user);
  const [isLoading, setIsLoading] = useState(false);
  const [value, setValue] = useState('');
  const [sending, setSending] = useState(false);
  const [date, setDate] = useState('');
  const [modal, setModal] = useState(false);
  const [showGroups, setShowGroups] = useState(false);
  const [groupValue, setGroupValue] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [addMembersModal, setAddMembersModal] = useState(false);
  const [showMembers, setShowMemebers] = useState(false);
  let userId = chat.selection.id as string;
  let type = chat.selection.type as ListProps['type'];

  useEffect(() => {
    setDate('');
    setValue('');
  }, [chat.selection.id]);

  useEffect(() => {
    let callback = async (e: KeyboardEvent) => {
      if (e.code === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSendMessage(inputRef?.current?.value ?? '');
        inputRef.current?.focus();
      }
    };
    document.addEventListener('keydown', callback);
    return () => {
      document.removeEventListener('keydown', callback);
    };
  }, [userId]);
  let currentGroup = useMemo(() => {
    return chat[chat.selection.type as ListProps['type']]?.groups[userId];
  }, [chat.selection, chat[chat.selection.type as ListProps['type']]]);
  let isProf = useMemo(() => {
    let xs = ['contractor', 'consultant'].includes(team.data[userId]?.rolename);
    return xs;
  }, [userId, chat]);

  let dispatch = useAppDispatch();
  let firstPending = useMemo(() => {
    let first: MessageEvent | undefined;
    if (chat[chat.selection.type as ListProps['type']]?.groups[userId]) {
      let list = chat[chat.selection.type as ListProps['type']].groups[userId];

      for (let m of list) {
        if (m.destination === m.message.projectId) {
          let unread = m?.reads?.find(
            (r) => r.userId === user._id && r.status !== 'read' && m.origin !== user._id
          );
          if (unread) {
            first = m;
            break;
          }
        } else {
          if (m.message.status !== 'read' && m.origin !== user._id) {
            first = m;
            break;
          }
        }
      }
    }

    return first;
  }, [userId, currentGroup]);
  let ref = useRef<HTMLDivElement>(null);
  let inputRef = useRef<HTMLTextAreaElement>(null);
  let scrollRef = useRef<HTMLDivElement>(null);
  let _userIdo = userId;
  useEffect(() => {
    // setIsLoading(false);
    scrollToBottom();
    inputRef.current?.focus();
  }, []);
  const scrollToBottom = () => {
    if (ref.current && !firstPending) {
      ref.current.scrollIntoView({});
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [type, userId]);

  let isGeneral = useMemo(() => userId === data[selectedProjectIndex]._id, [userId]);

  let allUsers = useMemo(() => {
    let { id, type } = chat.selection;
    if (type !== 'Direct Messages' && id) {
      if (id === data[selectedProjectIndex]._id) {
        return data[selectedProjectIndex].team.map((m) => {
          let isMe = m.id === user._id;
          return { userId: m.id, status: isMe ? 'read' : 'pending' };
        });
      } else {
        let quickMap = { Groups: 'groups', Tasks: 'tasks' };
        let members = chat.groups[quickMap[type as keyof typeof quickMap] as 'tasks' | 'groups'][
          id as string
        ]?.members?.map((m) => {
          let isMe = m.userId === user._id;
          return { userId: m.userId, status: isMe ? 'read' : 'pending' };
        });
        return members;
      }
    }

    return undefined;
  }, [chat.selection]);

  const handleSendMessage = async (message: string) => {
    if (message.length < 1) return;
    setSending(true);

    // let allUsers = data[selectedProjectIndex].team.map((m) => {
    //   let isMe = m.id === user._id;
    //   return { userId: m.id, status: isMe ? 'read' : 'pending' };
    // });

    let { selection, Tasks, groups } = chat;
    let _group =
      groups[selection.type === 'Tasks' ? 'tasks' : 'groups'][selection.id || '']?._id ?? undefined;
    let messageBody = {
      body: message,
      projectId: data[selectedProjectIndex]._id,
      groupId: selection.type === 'Direct Messages' ? undefined : _group,
      taskId: selection.type === 'Tasks' ? selection?.id : undefined
    };

    messageBody = removeemptyFields(messageBody);
    let token = localStorage.getItem('token');
    try {
      let res = await axios.post(
        MESSAGING_REST + '/events/add',
        {
          origin: user._id,
          message: messageBody,
          destination: selection.id,
          type: 'Message',
          reads: allUsers
        },
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      dispatch(addMessage(res.data.data));
      setValue((_) => '');
      ref?.current?.scrollIntoView({ behavior: 'auto' });
    } catch (_error: any) {
      displayError(cleanError(_error));
      console.error({ _error });
    }
    setSending((_) => false);
    inputRef.current?.focus();
  };

  let groups = useMemo(() => {
    let list = chat[type].groups[userId];

    let grouped: { [key: string]: MessageEvent[] } = {};
    list?.forEach((m) => {
      //(new Date(message.createdAt)).format("MMMM Do YYYY h:mm a")
      let title = '';
      let today = _format(new Date());
      let yesterday = _format(new Date(Date.now() - 24 * 60 * 60 * 1000));
      let created = _format(new Date(m.createdAt));
      title = today === created ? 'Today' : yesterday === created ? 'Yesterday' : created;
      if (grouped[title]) {
        grouped[title].push(m);
      } else {
        grouped[title] = [m];
      }
    });
    return grouped;
  }, [chat, userId, chat.selection]);

  let keys = useMemo(() => {
    return Object.keys(groups);
  }, [chat.groups, chat.selection, groups, chat]);

  const availableGroups = useMemo(() => {
    //these are groups that the current user created

    let groups = Object.values(chat.groups.groups).filter((m) => {
      let isCreatedByCurrentUser = m.createdBy === user._id;
      let isSelectionAlreadyAmember =
        m.members?.filter((n) => n.userId === chat.selection.id).length > 0;
      if (isCreatedByCurrentUser && !isSelectionAlreadyAmember) {
        return true;
      }
      return false;
    });
    return groups.map((m) => {
      return { label: m.name, value: m._id };
    });
  }, [chat, chat.selection?.id]);

  let isAudienceSelected = useMemo(() => {
    return (
      chat[chat.selection.type as ListProps['type']].groups[chat.selection.id as string]?.length > 0
    );
  }, [chat]);
  let modalRef = useRef<HTMLElement>(null);
  useClickOutSideComponent(ref, () => {
    setModal(false);
  });
  useEffect(() => {
    if (sending === false) {
      inputRef.current?.focus();
    }
  }, [sending]);

  return (
    <>
      {showAddModal && <AddToGroupModal value={groupValue} closer={() => setShowAddModal(false)} />}
      <div
        className={`w-full h-full relative  bg-white justify-between flex flex-col  rounded-md `}>
        {modal && (
          <span
            ref={ref}
            onBlur={() => setModal(false)}
            onClick={(e) => {
              e.stopPropagation();
            }}
            className="w-fit z-[130] hover:cursor-pointer shadow-bnkle rounded-md absolute right-2 top-8 bg-white p-2 ">
            <div
              onClick={(e) => {
                if (isProf) {
                  dispatch(display({ type: team.data[userId].rolename, profId: userId }));
                }
                setModal((_) => !_);
              }}
              className="w-full p-2 text-bash hover:bg-bbg rounded-lg flex items-center">
              <TbUser size={16} className="" />
              <span className="  ml-3 ">View Profile</span>
            </div>
          </span>
        )}

        <div
          className={
            'flex px-6 border-b border-b-ashShade-0  py-3 items-center justify-between w-full'
          }>
          <span className="  flex items-center gap-x-4 ">
            <span
              onClick={() => {
                // setShowing(null);
                toggle();
              }}
              className="p-2  lg:hidden w-fit rounded-full flex items-center justify-center hover:bg-bbg hover:cursor-pointer">
              <HiArrowLongLeft size={24} className="text-bblue " />
            </span>
            <Contact makewhite hideDetails id={userId} type={type} classes=" !w-10 !h-10" />
          </span>

          <span className="flex items-center ">
            {type === 'Direct Messages' && (
              <span
                onClick={() => setShowGroups(!showGroups)}
                className="text-bblue flex p-2 items-center hover:cursor-pointer ">
                Add to Group <TbChevronDown className="text-bblue ml-1" />
              </span>
            )}

            {type === 'Groups' && chat.selection.id !== data[selectedProjectIndex]?._id && (
              <span
                onClick={() => setShowMemebers(true)}
                className="text-bblue flex p-2 items-center hover:cursor-pointer ">
                Manage Group Members
              </span>
            )}

            {type === 'Groups' && showMembers && (
              <GroupMemberList closer={() => setShowMemebers(false)} />
            )}

            {showGroups && type === 'Direct Messages' && (
              <div className="absolute top-16 right-10  z-50 w-[300px] ">
                <DropDownOptions
                  value={groupValue}
                  closer={() => setShowGroups(false)}
                  onSelect={(e) => {
                    setGroupValue(e?.value);
                    setShowGroups(false);
                    setShowAddModal(true);
                  }}
                  onSelectNew={() => {
                    dispatch(
                      setChatModal({
                        isOpen: true,
                        modalName: 'newGroupModal'
                      })
                    );
                  }}
                  options={availableGroups}
                  newButtonLabel="Create New Group"
                  showSearch
                />
              </div>
            )}

            {!!isProf && (
              <span
                onClick={() => setModal(true)}
                className="flex p-1 hover:bg-ashShade-0 rounded-full hover:bg-opacity-25 items-center ">
                <IoEllipsisVertical size={16} color="#C8CDD4" />
              </span>
            )}
          </span>
        </div>
        <div className="  flex-1 overflow-y-scroll px-6 ">
          <div className="w-full h-full overflow-y-auto">
            {isLoading ? (
              <div className="w-full h-full flex items-center justify-center">
                <LoaderX color="blue" />
              </div>
            ) : currentGroup?.length < 1 ? (
              <>{NoDataView}</>
            ) : (
              <div className="w-full h-full flex flex-col relative ">
                {chat.groups && (
                  <div
                    ref={scrollRef}
                    onLoad={() => scrollToBottom()}
                    className="flex flex-col w-full h-full pb-4 overflow-y-scroll scrollbar gap-y-2 ">
                    {date.length > 0 && (
                      <span className="absolute z-40 top-0 font-light text-xs rounded-full text-bblack-1 border border-ashShade-0 self-center bg-white  px-3 py-1">
                        {date}
                      </span>
                    )}
                    {isAudienceSelected
                      ? keys.length > 0 &&
                        keys.map((m: string, i) => (
                          <DateGroup
                            key={m}
                            topRef={scrollRef}
                            messages={groups[m] as MessageEvent[]}
                            date={m}
                            firstPending={firstPending}
                            setOnscreen={setDate}
                          />
                        ))
                      : NoDataView}
                    <div ref={ref}></div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
        <form
          className="w-full px-6"
          action=""
          onSubmit={async (e) => {
            e?.preventDefault();
            // await handleSendMessage(value, userId);
            inputRef.current?.focus();
          }}>
          <div className="w-full gap-x-4 mt-2 bg-pbg  rounded-3xl flex items-center">
            <textarea
              title="pres Enter to send message and Shift+Enter to go to the next line"
              disabled={sending}
              value={value}
              ref={inputRef}
              placeholder="Type a message"
              onChange={(e) => {
                setValue((_) => e.target.value);
              }}
              className="bg-transparent flex-1 outline-none px-3 py-2 "
            />
            <button
              type="submit"
              disabled={sending}
              onClick={async () => {
                await handleSendMessage(value);
              }}
              className="p-2 hover:bg-bblue rounded-full hover:text-white text-bash ">
              {sending ? <LoaderX color="blue" /> : <BsSend className="rotate-45" size={24} />}
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

type Avatar = {
  role?: string;
  name?: string;
  id?: string;
  _id?: string;
  userId: string;
  idx?: number;
  classes?: string;
  textClass?: string;
  showName?: boolean;
  isGeneral?: boolean;
};

export const UserAvatar = ({ showName, isGeneral, userId, role, classes, textClass }: Avatar) => {
  // let { image, details } = useContractorDetails(userId, role || "");
  const [initials, setInitials] = useState('');
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState('');
  let getGen = useMemo(() => isGeneral, [userId, isGeneral]);
  let team = useAppSelector((m) => m.team);
  let [image, setImage] = useState('');

  const getUserDetails = async () => {
    setLoading(true);
    if (getGen) {
      setNames('General');
      setInitials('All');
      setImage('');
    } else {
      let details = team.data[userId];
      setNames(details?.name ?? details?.xname);
      setInitials(details?.initials);
      setImage(details?.logo || '');
    }

    setLoading(false);
  };
  useEffect(() => {
    getUserDetails();
  }, [userId, isGeneral]);

  return (
    <div className=" inline ">
      <div className="flex items-center my-2">
        <div className="relative w-8 h-8">
          {image ? (
            <SimpleImage
              className={
                ' object-cover shadow-inner w-full h-full rounded-full overflow-hidden border ' +
                classes
              }
              url={image}
            />
          ) : (
            <div
              className={classes + '  text-white  rounded-full flex items-center justify-center '}>
              {loading ? (
                <LoaderX />
              ) : (
                <p className={textClass ? textClass : ' text-2xl'}>{initials}</p>
              )}
            </div>
          )}
          {/* {
            <GoVerified
              size={12}
              className="text-green-600 stroke-width-$4 stroke-white  z-10 ml-2 absolute right-0 -bottom-0"
            />  
          } */}
        </div>
        {showName && <p className="text-base ml-3 font-Medium">{names}</p>}
      </div>
    </div>
  );
};
const NoDataView = (
  <div className={centered + 'h-full flex-col'}>
    <img loading="lazy" decoding="async" src={noContentImg} alt="" className="w-56 h-56" />
    <h1 className="font-bold text-2xl mt-2 mb-4">No Messages yet</h1>
  </div>
);

export default PrivateChat;
