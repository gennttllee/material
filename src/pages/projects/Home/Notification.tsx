import Layout from './Layout';
import React, { useMemo, useState } from 'react';
import { BsFillCheckSquareFill } from 'react-icons/bs';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Notification, _NotificationResponse } from './Components/Notifications';
import { LoaderX } from 'components/shared/Loader';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { updateNotification } from 'store/slices/notificationSlice';

export default function AllNotifications() {
  const [showRead, setShowRead] = useState(false);
  let notifications = useAppSelector((m) => m.notification);
  let dispatch = useAppDispatch();

  let navigate = useNavigate();

  let groups = useMemo(() => {
    let collection: { [key: string]: _NotificationResponse[] } = {
      'Most Recent': [],
      Earlier: []
    };

    for (let i of notifications.data) {
      let read = i.recipients[0].read;
      if (showRead && read) {
        continue;
      }
      collection[isToday(i.time) ? 'Most Recent' : 'Earlier'].push(i);
    }

    return collection;
  }, [notifications, showRead]);

  const updateReadStatus = (newObject: _NotificationResponse) => {
    dispatch(updateNotification(newObject));
  };

  const Children = () => (
    <div className="w-full h-full flex  flex-col ">
      <div
        onClick={() => navigate(-1)}
        className="flex hover:cursor-pointer hover:underline items-center mt-7">
        <FaArrowLeftLong color="#24282E" size={24} />
        <span className="ml-2 font-medium text-sm text-bblack-0">Back</span>
      </div>
      <div className="flex  items-center justify-between mt-5 mb-6">
        <p className="text-bblack-3 text-2xl font-semibold">All Notifications</p>
        <Read
          isRead={showRead}
          onClick={() => {
            setShowRead((_) => !_);
          }}
        />
      </div>
      <div className="w-full scrollbar flex-1 overflow-y-auto rounded-md pt-8 px-6 bg-white">
        {notifications.loading ? (
          <div className="w-full h-full flex items-center justify-center">
            <LoaderX color="blue" />
          </div>
        ) : groups['Most Recent'].length == 0 && groups['Earlier'].length == 0 ? (
          <div className="w-full h-full text-center p-20">No unread notifications</div>
        ) : (
          <>
            <Group name={'Most Recent'} list={groups['Most Recent']} update={updateReadStatus} />
            <Group name={'Earlier'} list={groups['Earlier']} update={updateReadStatus} />
          </>
        )}
      </div>
    </div>
  );
  return (
    <Layout path="notifications">
      <Children />
    </Layout>
  );
}

const Read = ({ isRead, onClick }: { isRead: boolean; onClick: () => void }) => {
  return (
    <div
      onClick={() => {
        onClick();
      }}
      className="flex items-center hover:cursor-pointer p-2 hover:bgbash hover:bg-opacity-10 ">
      {!isRead ? (
        <span className="w-3 h-3 border border-bash"></span>
      ) : (
        <BsFillCheckSquareFill size={12} color="#437ADB" />
      )}
      <span className="ml-2 font-medium text-bblack-0 font-sm">Hide all read</span>
    </div>
  );
};

interface GroupProps {
  list: _NotificationResponse[];
  name: string;
  update: (x: _NotificationResponse) => void;
}

const Group = ({ list, name, update }: GroupProps) => {
  return (
    <div className={`w-full p-8 ${list.length === 0 ? 'hidden' : ''} `}>
      <p className="font-semibold text-bblack-0 text-base">{name}</p>
      <div className="w-full flex-col flex">
        {list.length > 0 &&
          list.map((m, i) => (
            <Notification
              key={m._id}
              updateReadStatus={update}
              isLast={i === list.length - 1}
              {...m}
            />
          ))}
      </div>
    </div>
  );
};

const isToday = (date: string) => {
  let today = new Date().toISOString().slice(0, 10);
  let day = new Date(date).toISOString().slice(0, 10);
  return today === day;
};
