import { useRef, useEffect, useMemo, createElement, useState } from 'react';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { MessageEvent, update } from 'store/slices/chatsSlice';
import moment from 'moment';
import useOnScreen from './OnScreen';
import { handleStatusUpdate } from 'pages/projects/Project/OneProject';
import { BiCheckDouble, BiCheck } from 'react-icons/bi';
import UsePending from './UsePending';

const randomColor = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return '#' + n.slice(0, 6);
};

let color = randomColor();

const Message = ({
  message,
  origin,
  _id,
  isFirstPending,
  destination,
  reads
}: MessageEvent & { isFirstPending: boolean }) => {
  let user = useAppSelector((m) => m.user);
  let chat = useAppSelector((m) => m.chats);
  let team = useAppSelector((m) => m.team);
  let dispatch = useAppDispatch();
  let isMine = useMemo(() => user._id === origin, []);
  let myGroup = useMemo(() => (isMine ? destination : origin), []);
  let messageRef = useRef<HTMLDivElement>(null);
  let markerRef = useRef<HTMLDivElement>(null);
  let onscreen = useOnScreen(messageRef);

  const [showUnread, setshowUnread] = useState(false);

  let status = useMemo(() => {
    if (destination === message.projectId || message?.groupId) {
      let myreads = reads?.filter((m) => m.userId !== user._id);
      if (!myreads || myreads.length < 1) return 'pending';
      let acc: { [key: string]: number } = {};
      myreads?.forEach((m) => {
        if (acc[m.status]) {
          acc[m.status]++;
        } else {
          acc[m.status] = 1;
        }
      });
      if (acc['pending']) return 'pending';
      if (acc['delivered']) return 'delivered';
      if (acc['read']) return 'read';
    } else {
      return message.status;
    }
  }, [chat]);

  useEffect(() => {
    const messageHandler = () => {
      if (destination === message.projectId && onscreen) {
        let read: false;
        let myRead = reads?.find((m) => m.userId === user._id && m.status !== 'read' && !isMine);
        if (myRead) {
          handleStatusUpdate(_id || '', 'read', (message) => {
            if (message) {
              dispatch(update(message));
            }
          });
        }
      } else {
        if (onscreen && message.status !== 'read' && !isMine) {
          handleStatusUpdate(_id || '', 'read', (message) => {
            if (message) {
              dispatch(update(message));
            }
          });
        }
      }
    };

    messageHandler();

    return () => {};
  }, [onscreen]);

  useEffect(() => {
    if (!onscreen && isFirstPending) {
      messageRef.current?.scrollIntoView({ behavior: 'auto', block: 'center' });
    }
  }, []);

  return (
    <>
      {/* {isFirstPending && unread > 0 && <UnReadMarker number={unread} />} */}
      <div
        ref={messageRef}
        className={`max-w-[70%] min-w-[30%] px-3 py-1 my-2 rounded-xl  ${
          isMine
            ? '  self-end rounded-tr-none bg-bblue text-white '
            : ' rounded-tl-none self-start bg-ashShade-0 text-bblack-1 '
        } p-4 relative `}>
        <p className="" style={{ color: !isMine ? color : '' }}>
          {isMine ? 'You' : team.data[origin]?.name || 'Admin'}
        </p>
        <p className="max-w-full  break-words ">{message.body}</p>

        <div className="text-right mt-2 leading-3 text-xs w-full flex justify-end">
          {message.createdAt ? moment(new Date(message.createdAt)).format('h:mm a') : ''}
          {isMine && (
            <span className="ml-2">
              {createElement(status === 'pending' ? BiCheck : BiCheckDouble, {
                size: 14,
                color: status === 'read' ? '#A8D461' : 'white'
              })}
            </span>
          )}
        </div>
      </div>
    </>
  );
};

interface Props {
  number: number;
  // ref: any;
}
const UnReadMarker = ({ number }: Props) => {
  return (
    <div className="p-2 my-7 self-center bg-bblue text-white rounded-md mt-2">{`${number} Unread Message${
      number > 1 ? 's' : ''
    }`}</div>
  );
};

export default Message;
