import React, { useMemo, useEffect, useState, useContext, useRef } from 'react';
import SuperModal from 'components/shared/SuperModal';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { ListProps } from 'components/projects/Team/Views/Components/ChatGroups';
import { StoreContext } from 'context';
import { MessageEvent, addGroupOrTasks, addMessage } from 'store/slices/chatsSlice';
import axios from 'axios';
import { MESSAGING_REST, postForm } from 'apis/postForm';
import { removeemptyFields } from 'pages/projectform/utils';
import moment from 'moment';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import { LoaderX } from 'components/shared/Loader';
import { BsSend } from 'react-icons/bs';
import DateGroup from 'components/projects/Team/Views/Components/DateGroup';
import { centered } from 'constants/globalStyles';
import noContentImg from 'assets/nocontent.svg';
import { Selected } from 'components/projects/Team/Views/Components/NewGroupModal';
import { cleanError, displayError } from 'Utils';
interface MessageModalProps {
  taskId: string;
  closer: () => void;
}

const MessagesModal = ({ closer, taskId }: MessageModalProps) => {
  const { data, selectedProjectIndex, selectedProject } = useContext(StoreContext);
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
  const _format = (date: Date | string | number) => moment(new Date(date)).format('MMMM Do YYYY');
  let userId = taskId;
  let type = 'Tasks' as ListProps['type'];
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
  let inputRef = useRef<HTMLInputElement>(null);
  let scrollRef = useRef<HTMLDivElement>(null);
  let _userIdo = userId;
  useEffect(() => {
    // setIsLoading(false);
    scrollToBottom();
    inputRef.current?.focus();
  }, []);
  const scrollToBottom = () => {
    if (ref.current && !firstPending) {
      ref.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [type, userId]);
  let _team = useMemo(() => {
    let list: Selected[] = [];
    let keys = Object.keys(team.data);
    for (let key of keys) {
      if (key.toLowerCase() !== selectedProject._id)
        list.push({ id: key, name: team.data[key]?.name, role: team.data[key]?.rolename });
    }

    return list;
  }, [team]);

  let isGeneral = useMemo(() => userId === data[selectedProjectIndex]._id, [userId]);

  const getTasks = async () => {
    let { response, e } = await postForm(
      'get',
      `tasks/project-tasks?projectId=${data[selectedProjectIndex]?._id}`
    );
    if (e) {
      //
    } else {
      return response.data.data;
    }
  };
  const createGroup = async () => {
    // setLoading(true);

    let tasks = (await getTasks()) as any[];

    let members = _team.map((m) => ({ userId: m.id, role: m.role }));
    let token = localStorage.getItem('token');

    let body = {
      projectId: selectedProject._id,
      taskId,
      taskName: tasks.find((m) => m._id === taskId).name,
      members
    };
    body = removeemptyFields(body);
    try {
      let response = await axios.post(`${MESSAGING_REST}/group/create`, body, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      return response.data.data;

      //TODO - update group list
    } catch (error: any) {
      displayError(cleanError(error));
    }
  };

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
    let group = chat.groups.tasks[taskId];
    setSending(true);

    if (!group) {
      group = await createGroup();
      if (!group) {
        displayError('Could not create task group');
        return;
      }
    }

    let { selection, Tasks, groups } = chat;
    let messageBody = {
      body: message,
      projectId: data[selectedProjectIndex]._id,
      groupId: group?._id,
      taskId
    };
    messageBody = removeemptyFields(messageBody);
    let token = localStorage.getItem('token');
    try {
      let res = await axios.post(
        MESSAGING_REST + '/events/add',
        {
          origin: user._id,
          message: messageBody,
          destination: taskId,
          type: 'Message',
          reads: allUsers
        },
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );
      if (!chat.groups.tasks[taskId]) {
        dispatch(addGroupOrTasks(group));
      }
      dispatch(addMessage(res.data.data));

      ref?.current?.scrollIntoView({ behavior: 'auto' });
      setValue((_) => '');
      ref?.current?.scrollIntoView({ behavior: 'auto' });
    } catch (_error: any) {
      displayError(cleanError(_error));
    }
    setSending((_) => false);
    inputRef.current?.focus();
  };

  let groups = useMemo(() => {
    let list = chat['Tasks'].groups[userId];
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
  }, [chat, userId]);

  let keys = useMemo(() => Object.keys(groups), [groups, userId, type, chat]);
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
    <SuperModal classes="  bg-black bg-opacity-30 " closer={closer}>
      <div className="w-full h-full flex flex-col items-center">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" w-4/5 lg:w-1/2 xl:w-1/3 bg-white p-6 rounded-md mt-32 max-w-[516px] h-1/2 flex flex-col">
          <div className="w-full justify-between  flex items-center">
            <span className=" text-xl text-bblue font-semibold">{'Chat'}</span>
            <span onClick={closer} className=" text-bash text-sm cursor-pointer">
              Close
            </span>
          </div>
          <div className="flex-1 overflow-y-auto">
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
                  {keys.length > 0
                    ? keys.map((m: string, i) => (
                        <DateGroup
                          key={i}
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
          </div>
          <form
            className="w-full"
            action=""
            onSubmit={async (e) => {
              e?.preventDefault();
              // await handleSendMessage(value, userId);
              inputRef.current?.focus();
            }}>
            <div className="w-full gap-x-4 mt-2 bg-pbg  rounded-3xl flex items-center">
              <input
                title="press Enter to send message and Shift+Enter to go to the next line"
                disabled={sending}
                onFocus={() => {}}
                value={value}
                ref={inputRef}
                placeholder="Type a message"
                onChange={(e) => {
                  setValue((_) => e.target.value);
                }}
                className=" flex-1 outline-none  bg-transparent px-3 py-2 z-30 "
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
      </div>
    </SuperModal>
  );
};
const NoDataView = (
  <div className={centered + 'h-full flex-col'}>
    <img loading="lazy" decoding="async" src={noContentImg} alt="" className="w-56 h-56" />
    <h1 className="font-bold text-2xl mt-2 mb-4">No Messages yet</h1>
  </div>
);
export default MessagesModal;
