import { postForm } from 'apis/postForm';
import { add } from 'date-fns';
import moment from 'moment';
import React, { useEffect, useState, useContext, useMemo, useRef } from 'react';
import { StoreContext } from 'context';
import { convertToProper } from 'components/shared/utils';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import { LoaderX } from 'components/shared/Loader';
import { useNavigate } from 'react-router-dom';
import nocontent from 'assets/nocontent.svg';
import bnkle from 'assets/fav.png';
import { TbPhoto, TbGavel } from 'react-icons/tb';
import { IconType } from 'react-icons';
import team from 'assets/team.svg';
import financials from 'assets/financials.svg';
import photos from 'assets/photos.svg';
import documents from 'assets/documents.svg';
import project from 'assets/project.svg';
import referal from 'assets/referal.svg';
import bids from 'assets/bids.svg';
import { loadNotifications, updateNotification } from 'store/slices/notificationSlice';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { centered } from 'constants/globalStyles';

const fetchNotification = async () => {
  return await postForm('get', 'notification/all');
};

const Notifications = ({
  toggler,
  _status
}: {
  toggler: (val: boolean) => void;
  _status?: boolean;
}) => {
  let tabs: string[] = ['All', 'Unread'];
  let dispatch = useAppDispatch();
  let notification = useAppSelector((m) => m.notification);
  const [active, setActive] = useState<number>(0);
  const [loading, setLoading] = useState(true);
  const [notifications, setNotifications] = useState<any[]>([]);
  const notificationRef = useRef<HTMLDivElement>(null);
  const _notifications = async () => {
    setLoading(true);
    let { response, e } = await fetchNotification();
    dispatch(loadNotifications(response.data.data.reverse()));
    //setNotifications(response.data.data.reverse());
    setLoading(false);
  };

  // useEffect(() => {
  //   _notifications();
  // }, []);

  let unreads = useMemo(() => {
    let unReads = notification.data.filter((m: _NotificationResponse) => {
      if (!m.recipients[0].read) {
        return true;
      }
      return false;
    });
    return unReads;
  }, [notifications, active, loading, notification]);
  // const updateReadStatus = (newObject: _NotificationResponse) => {
  //   let copy = [...notifications];
  //   copy.map((m: _NotificationResponse) => {
  //     if (m._id === newObject._id) return newObject;
  //     return m;
  //   });
  //   setNotifications((_) => copy);
  // };
  const updateReadStatus = (m: _NotificationResponse) => {
    dispatch(updateNotification(m));
  };

  let list = useMemo(() => {
    return notification.data;
  }, [active, notification, loading, notification.data, notifications]);

  
  useClickOutSideComponent(notificationRef, () => {
    if (_status !== true) {
      toggler(false);
    }
  });
  let navigate = useNavigate();
  return (
    <div
      ref={notificationRef}
      className={`absolute h-[80vh]  ${
        _status ? '' : ' hidden'
      }   lg:min-w-[400px] top-4  max-w-[451px]  z-[90] right-0 `}>
      <div className="  flex relative justify-end ">
        <span className=" border-[20px]  mr-2 border-b-white border-t-transparent  border-x-transparent  "></span>
      </div>
      <div className=" w-full h-full  shadow-bnkle flex-1 flex flex-col    bg-white rounded-md">
        <div className="flex border-b border-b-ashShade-3 items-center justify-between font-medium p-6">
          <span className=" text-bblack-4 font-semibold ">Notifications</span>
          <span
            onClick={() => {
              toggler(false);
            }}
            className="text-bash hover:underline text-sm  cursor-pointer">
            Close
          </span>
        </div>
        <div className="w-full flex-1 px-6 overflow-y-auto ">
          {notification.loading ? (
            <div className="w-full p-8 flex items-center justify-center">
              <LoaderX color="blue" />
            </div>
          ) : list.length > 0 ? (
            list.map((m, i) => (
              <Notification
                key={m._id}
                updateReadStatus={updateReadStatus}
                isLast={i === list.length - 1}
                {...m}
              />
            ))
          ) : (
            <div className="w-full p-4">
              <img className="w-full" src={nocontent} alt="no content" />
              <p className="w-full text-center my-4">No Notification to show</p>
            </div>
          )}
        </div>
        {list.length > 0 && (
          <p
            onClick={() => navigate('/projects/notifications')}
            className="text-bblue px-6 py-3 mt-2 text-sm hover:cursor-pointer  ">
            See all notifications
          </p>
        )}
      </div>
    </div>
  );
};

interface TProps {
  text: string;
  active?: boolean;
  setter: () => void;
}
const Tab = ({ text, active, setter }: TProps) => {
  return (
    <span
      onClick={() => setter()}
      className={` hover:cursor-pointer pb-2 px-2 font-medium  border-b-2  ${
        !active ? 'text-bash border-b-transparent' : 'text-bblue  border-b-bblue'
      } `}>
      {text}
    </span>
  );
};

export interface _NotificationResponse {
  isLast?: boolean;
  showUnread?: boolean;
  _id: string;
  module: string;
  project?: {};
  projectId: string;
  activity: string;
  projectTitle: string;
  performedBy: string;
  time: string;
  recipients: [
    {
      userId: string;
      read: boolean;
      _id: string;
    }
  ];
}

const getNotification = async (id: string) => {
  let { e, response } = await postForm('get', `notification/read/${id}`);
  return { e, response };
};
const Notification = ({
  isLast,
  activity,
  time,
  projectId,
  recipients,
  showUnread,
  _id,
  module,
  updateReadStatus,
  projectTitle
}: _NotificationResponse & {
  updateReadStatus: (x: _NotificationResponse) => void;
}) => {
  let navigate = useNavigate();
  let { data } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);

  return (
    <div
      onClick={async () => {
        if (!recipients[0].read && !loading) {
          setLoading(true);
          let { response, e } = await getNotification(_id);
          if (response) {
            updateReadStatus(response.data.data);
          }
          setLoading(false);
        }
        // navigate("/projects/" + projectId);
      }}
      className={`w-full hover:cursor-pointer flex py-6 border-b-ashShade-3 
          ${isLast ? '' : 'border-b'}`}>
      {
        <>
          <Icon read={recipients[0].read} module={module} />
          <span className="flex flex-col ml-3 text-sm w-full">
            <span className="font-semibold ">
              {convertToProper(projectTitle)}
              <span className="text-bash font-normal text-sm">
                {` \u2022 `}
                {moment(new Date(time)).fromNow()}
              </span>
            </span>
            <p className=" text-bblack-1 text-sm font-normal w-full break-words">{activity}</p>
            {loading && <p className="text-xs my-1 text-bgreen-0">{'updating....'}</p>}
          </span>
        </>
      }
    </div>
  );
};
interface NotificationIconProps {
  module: string;
  read: boolean;
}

const Icon = ({ module, read }: NotificationIconProps) => {
  let Maps: { [k: string]: string } = {
    bids,
    documents,
    Project: bnkle
  };
  let known = useMemo(() => {
    let knowSchemes = ['bid', 'documents', 'Project'];
    return knowSchemes.includes(module);
  }, []);

  return (
    <div className="w-9 h-9  relative bg-ashShade-14 rounded-full flex flex-col items-center justify-center ">
      {
        <img
          className={`${module === 'Project' ? 'h-8 w-8' : 'w-4 h-4'}  object-cover rounded-full`}
          src={Maps[known ? module : 'bids']}
          alt="icon"
        />
      }
      {!read && <span className="w-2 h-2  absolute top-0 left-0 bg-bblue rounded-full "></span>}
    </div>
  );
};
export { fetchNotification, getNotification };
export { Notification };
export default Notifications;
