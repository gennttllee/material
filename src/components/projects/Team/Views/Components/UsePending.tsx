import React, { useMemo } from 'react';
import { useAppSelector } from 'store/hooks';
import { ListProps } from './ChatGroups';
import { MessageEvent } from 'store/slices/chatsSlice';

const UsePending = (id: string, type: ListProps['type']) => {
  let chat = useAppSelector((m) => m.chats);
  let user = useAppSelector((m) => m.user);
  const countPending = useMemo(() => {
    let count = 0;
    let list = chat[type]?.groups[id];
    if (list) {
      list.map((m) => {
        if (m.reads && m.reads?.length > 0) {
          let isRead = false;
          m?.reads.forEach((i) => {
            if (i.status !== 'read' && i.userId === user._id && m.origin !== user._id) {
              isRead = true;
              return;
            }
          });
          if (isRead) count++;
          return;
        } else {
          if (m.message?.status !== 'read' && m.origin !== user._id) count++;
        }
      });
    }

    return count;
  }, [chat]);
  return countPending;
};

const useAllProjectPending = () => {
  let chat = useAppSelector((m) => m.chats);
  let user = useAppSelector((m) => m.user);

  let list = useMemo(() => {
    const allMessages: MessageEvent[] = [];

    let groupMessages = Object.values(chat.Groups.groups).flat();
    let taskMessages = Object.values(chat.Tasks.groups).flat();
    let DMS = Object.values(chat['Direct Messages'].groups).flat();

    return [...taskMessages, ...groupMessages, ...DMS];
  }, [chat]);
  return countPending(list, user._id);
};

export const countPending = (list: MessageEvent[], userId: string) => {
  let count = 0;
  // let list = chat[type]?.groups[id];
  if (list) {
    list.map((m) => {
      if (m.reads && m.reads?.length > 0) {
        let isNotRead = false;
        m?.reads.forEach((i) => {
          if (i.status !== 'read' && i.userId === userId && m.origin !== userId) {
            isNotRead = true;
            return;
          }
        });
        if (isNotRead) count++;
        // return;
      } else {
        if (m.message?.status !== 'read' && m.origin !== userId) count++;
      }
    });
  }
  return count;
};

export { useAllProjectPending };
export default UsePending;
