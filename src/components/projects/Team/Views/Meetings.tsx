import { centered, flexer, hoverFade, spacer } from 'constants/globalStyles';
import noContentImg from '../../../../assets/nocontent.svg';
import Button from '../../../shared/Button';
import React, { useState, useContext, useEffect, useCallback, useMemo, useRef } from 'react';
import { AiOutlinePlus } from 'react-icons/ai';
import { BsCameraVideo } from 'react-icons/bs';
import { TbCalendarEvent, TbClock, TbEdit, TbUser, TbMapPin } from 'react-icons/tb';
import { makeEndTIme } from './Constants';
import { postForm } from 'apis/postForm';
import { StoreContext } from 'context';
import { useAppSelector } from 'store/hooks';
import { displayInfo, displaySuccess, displayWarning } from 'Utils';
import Loader, { LoaderX } from 'components/shared/Loader';
import moment from 'moment';
import ScheduleView from './Components/ScheduleView';
import SimpleImage from './Components/SimpleImage';
import SuperModal from 'components/shared/SuperModal';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';

import { HiArrowLongLeft, HiEllipsisVertical } from 'react-icons/hi2';
import { MeetingContext, TeamContext } from '..';
import { UserAvatar as XAvatar } from './Components/PrivateChat';
import { HiOutlineVideoCamera } from 'react-icons/hi';
import { useClickOutSideComponent } from './Components/OnScreen';
import { isActive } from 'components/projects/home/summary/Updates';
import { truncateText } from 'components/shared/utils';
interface NewMeeting {
  date: Date;
  title: string;
  time: string;
  description: string;
  duration: string;
  location: string;
  projectId: string;
  guests: {
    userId: string;
    id?: string;
    role?: string;
    _id?: string;
    name?: string;
  }[];
}

const Meetings = () => {
  const {
    data,
    selectedProjectIndex,
    selectedData: { scheduledCall }
  } = useContext(StoreContext);
  let loading = useContext(TeamContext);
  let user = useAppSelector((m) => m.user);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [fetching, setFetching] = useState(false);
  const [viewing, setViewing] = useState<any>();
  const [showing, setShowing, editing, setEditing] = useContext(MeetingContext);
  // const [editing, setEditing] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [modal, setModal] = useState(false);
  const [optionsModal, setOptionsModal] = useState(false);

  const fetchMeetings = async () => {
    setFetching(true);
    let { response } = await postForm('get', 'meeting/project/' + data[selectedProjectIndex]._id);
    if (response) {
      let meets = response.data.data;
      let filtered = meets.filter((m: any) => isActive(m.time, m.duration));
      setMeetings(filtered);
    }
    setFetching(false);
  };

  const defaultMeeting = useMemo(() => {
    let _ = [];
    let show = false;
    if (scheduledCall) {
      let date = new Date(scheduledCall.startTime).getTime() + 60 * 1000 * 60;
      show = Date.now() < date;
    }
    if (show) {
      _.push({
        duration: '60',
        location: 'Online',
        time: scheduledCall?.startTime,
        title: 'Project Brief Discussion',
        joinUrl: scheduledCall?.joiningInfo.eventUrl
      });
    }
    return _;
  }, [meetings]);

  useEffect(() => {
    fetchMeetings();
  }, []);

  const NoDataView = () => (
    <div className={centered + 'h-full flex-col'}>
      <img loading="lazy" decoding="async" src={noContentImg} alt="" className="w-56 h-56" />
      <h1 className="font-bold text-2xl mt-5 mb-2">No upcoming meeting</h1>
      <p className="text-bash text-base">Click the button below to schedule a meeting</p>
      <div className={spacer} />
      <Button
        onClick={() => {
          setShowing('schedule');
          setEditing(false);
        }}
        text="Schedule meeting"
        LeftIcon={<AiOutlinePlus className="text-white text-base mr-2" />}
      />
    </div>
  );

  const showMeetingDetails = (i: any) => {
    setViewing(i);
    setShowing('meeting');
  };

  const deleteCurrentMeeting = async () => {
    if (user._id !== meetings[viewing].createdBy) {
      displayInfo('You can not cancel this meeting because it was not created by you');
      return;
    }
    setDeleting(true);
    let current = meetings[viewing];
    let { response, e } = await postForm('delete', 'meeting/delete/' + current._id);
    if (response) {
      displaySuccess('Meeting canceled successfully');
      setMeetings((_) => meetings.filter((m) => m._id !== current._id));
      setViewing(null);
      setShowing(null);
      setModal(false);
    } else {
      displayWarning("couldn't Cancel Meeting");
    }
    setDeleting(false);
  };

  const AllMeetingsView = (
    <div className="w-full bg-white py-6 px-4  rounded-md ">
      <div className={flexer}>
        <h2 className="text-xl font-Medium">Meetings</h2>
      </div>
      {fetching ? (
        <div className="w-full flex   justify-center ">
          <LoaderX color="blue" className="p-8" />
        </div>
      ) : !defaultMeeting[0] && meetings.length < 1 ? (
        <NoDataView />
      ) : (
        <>
          {defaultMeeting &&
            defaultMeeting.map((meeting) => (
              <Meeting
                noteditable
                idx={0}
                key={0}
                meet={meeting}
                current={meeting === viewing}
                openDetails={showMeetingDetails}
              />
            ))}
          {meetings &&
            meetings.map((m, i) => (
              <Meeting
                current={m?.id === viewing?.id}
                meet={m}
                idx={i}
                key={i + 1}
                deleteMeeting={(i: number) => {
                  setViewing(m);
                  setModal(true);
                }}
                edit={(i: number) => {
                  setViewing(m);
                  setShowing('schedule');
                  setEditing(true);
                }}
                openDetails={showMeetingDetails}
              />
            ))}
        </>
      )}
    </div>
  );

  const oneMeetingViewData = useMemo(() => {
    // since index 0 i reserved for scheduledCall
    // we will be accounting for it
    // if (viewing >= 0) return meetings[viewing];
    // else return defaultMeeting[0];
    return viewing;
  }, [defaultMeeting, meetings, viewing]);

  const OneMeetingView = oneMeetingViewData && (
    <div
      onClick={(e) => {
        e.stopPropagation();
        setOptionsModal(false);
      }}
      className={`bg-white max-w-[532px]  py-6 px-4 rounded-md overflow-y-auto`}>
      <div className={flexer + 'mb-6 relative'}>
        <h2 className="text-2xl font-bold text-bblack-1">{oneMeetingViewData.title}</h2>
        <span
          onClick={() => setShowing(null)}
          className="text-bash cursor-pointer hover:underline font-semibold text-sm">
          Close
        </span>
        {optionsModal && (
          <span
            onBlur={() => setOptionsModal(false)}
            className="w-fit z-10 hover:cursor-pointer shadow-bnkle rounded-md absolute right-2 top-4 bg-white p-2">
            <div
              onClick={() => {
                setOptionsModal((_) => !_);
                setShowing('schedule');
                setEditing(true);
              }}
              className="w-full p-2 text-bash hover:bg-bbg rounded-lg flex items-center">
              <FaRegEdit size={16} className="" />
              <span className=" text-sm ml-3 ">Edit meeting</span>
            </div>
            <div
              onClick={async (e) => {
                e.stopPropagation();
                setOptionsModal((_) => false);
                setModal(true);
                setShowing(null);
              }}
              className="w-full hover:text-red-600 p-2  hover:bg-red-200 rounded-lg flex items-center">
              <RiDeleteBin6Line size={16} className="text-red-600" />
              <span className=" text-sm ml-3  text-red-600">Delete meeting</span>
            </div>
          </span>
        )}
      </div>
      <div className="flex items-center">
        <TbCalendarEvent className="mr-2 text-2xl" />
        <p className="text-lg font-Medium">
          {moment(new Date(oneMeetingViewData.time)).format('dddd, MMMM Do YYYY, h:mm A')} to{' '}
          {makeEndTIme(oneMeetingViewData.time, oneMeetingViewData.duration)}
        </p>
      </div>
      <hr className="bg-bash my-4" />

      <div className={flexer + 'overflow-hidden'}>
        <div className={flexer}>
          {React.createElement(
            oneMeetingViewData.location === 'Onsite' ? TbMapPin : HiOutlineVideoCamera,
            {
              className: 'text-2xl text-bblack-1'
            }
          )}
          <a
            href={oneMeetingViewData.joinUrl}
            target="_blank"
            className="text-bblack-1 max-w-[300px]  flex-[.95] font-Medium text-base  hover:underline">
            {truncateText(
              oneMeetingViewData.location === 'Onsite' ? 'Onsite' : oneMeetingViewData.joinUrl,
              25
            )}
          </a>
        </div>
        <Button
          onClick={() => {
            window.open(oneMeetingViewData.joinUrl, '_newtab');
          }}
          text="Join"
          textStyle="text-borange hover:underline"
          className="py-3 bg-transparent border-0 cursor-pointer  hover:underline"
        />
      </div>

      <p className="text-base font-Medium mt-5 text-bblack-1">
        {meetings[viewing]?.description ||
          "This dialogue provides a prime opportunity to delve into the project's overarching vision, scope, and critical elements. Through this exchange, participants can gain deeper insights into the project's objectives, anticipated outcomes, as well as any potential obstacles or limitations."}
      </p>
      {oneMeetingViewData.guests ? (
        <>
          <p className="text-xl my-5 text-bblack-1 font-bold">
            {meetings[viewing]?.guests?.length} Guests
          </p>
          <div className="flex  flex-col items-start  overflow-x-scroll w-full my-4">
            {React.Children.toArray(
              oneMeetingViewData.guests?.map((_: Avatar, index: number) => (
                <UserAvatar {..._} isCreator={oneMeetingViewData.createdBy === _.userId} />
              ))
            )}
          </div>
        </>
      ) : null}
    </div>
  );

  return (
    <div onClick={() => setOptionsModal(false)} className="h-full w-full font-satoshi">
      {modal && (
        <SuperModal
          classes="bg-black bg-opacity-80 flex justify-center"
          closer={() => setModal(false)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white h-fit  self-center rounded-md p-20">
            <img src={noContentImg} className="" />
            <p className="text-center">Are you sure you want to cancel this meeting?</p>
            <div className="w-full mt-10 flex justify-evenly items-center">
              <Button onClick={() => setModal(false)} className="w-1/3" text="No" />
              <Button
                onClick={() => {
                  deleteCurrentMeeting();
                }}
                isLoading={deleting}
                className="bg-red-600 w-1/3"
                text="Yes"
              />
            </div>
          </div>
        </SuperModal>
      )}
      {showing && (
        <SuperModal
          classes="bg-black bg-opacity-80  flex items-center justify-center"
          closer={() => setShowing(null)}>
          {showing === 'schedule' ? (
            <ScheduleView
              isEditing={editing}
              setShowing={setShowing}
              meetings={meetings}
              setMeetings={setMeetings}
              initialDetails={viewing}
            />
          ) : (
            OneMeetingView
          )}
        </SuperModal>
      )}
      <div className="flex w-full items-start pb-3 ">
        {loading ? (
          <div className="w-full h-full col-auto flex items-center justify-center">
            <LoaderX color="blue" />
          </div>
        ) : (
          <>{AllMeetingsView}</>
        )}
      </div>
    </div>
  );
};

export default Meetings;

interface MeetingProp {
  meet: any;
  idx: number;
  openDetails: (a: number) => void;
  current: boolean;
  edit?: (a: number) => void;
  deleteMeeting?: (a: number) => void;
  noteditable?: boolean;
}

const Meeting = ({
  meet,
  idx,
  openDetails,
  current,
  edit,
  deleteMeeting,
  noteditable
}: MeetingProp) => {
  let days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const [modal, setModal] = useState(false);
  const [active, setActive] = useState(false);
  const [myCurrent, setMyCurrent] = useState(false);
  let ref = useRef<HTMLElement>(null);
  useClickOutSideComponent(ref, () => {
    setModal(false);
  });

  let relevant = useMemo(() => {
    let start = new Date(meet.time).getTime();
    let end = start + parseInt(meet?.duration || 0) * 1000 * 60;
    let now = Date.now();
    if (now > end) {
      return false;
    }

    return true;
  }, [active]);

  const checker = () => {
    let start = new Date(meet.time).getTime();
    let end = start + parseInt(meet?.duration || 0) * 1000 * 60;
    let now = Date.now();
    if (now >= start && now <= end) {
      return true;
    }
    return false;
  };

  const updateStatus = () => {
    let check = checker();
    if (check !== active) {
      setActive(check);
    }
  };

  useEffect(() => {
    let interval = setInterval(updateStatus, 1300);
    return () => {
      clearInterval(interval);
    };
  }, [meet]);

  return (
    <div
      onMouseOver={() => setMyCurrent(true)}
      onMouseLeave={() => setMyCurrent(false)}
      onClick={() => {
        if (modal) {
          setModal(false);
        } else {
          openDetails(meet);
        }
      }}
      className={`mt-4 px-4 py-5 flex  gap-x-4 rounded-md relative  ${
        active ? ' bg-bblue border-bblue' : 'bg-white hover:bg-lightblue  border-ashShade-9'
      } border hover:border-bblue `}>
      <div
        className={`flex flex-col items-center border-r pr-4 ${
          !active ? ' text-bblack-1  border-r-bblack-3' : 'text-white border-r-white'
        }`}>
        <p className="font-Medium text-sm">{days[new Date(meet?.time).getDay()].slice(0, 3)}</p>
        <p className=" font-bold text-xl">
          {new Date(meet.time).getDate().toString().padStart(2, '0')}
        </p>
      </div>
      <div className="flex-1 flex items-center justify-between">
        <div className="flex items-center gap-x-6">
          <div className="flex-col">
            <div className="flex flex-col  ">
              <div
                className={`font-semibold flex gap-x-4 items-center ${
                  active ? 'text-white' : 'text-black'
                } text-base`}>
                <span className=" font-semibold">{meet.title} </span>
                <span className="flex items-center">
                  {React.createElement(meet.location === 'Onsite' ? TbMapPin : BsCameraVideo, {
                    className: `${active ? 'text-white' : 'text-bash'} text-base`
                  })}
                  <p
                    className={`text-base ${
                      active ? 'text-white' : 'text-bash'
                    } ml-1 capitalize font-Medium`}>
                    {meet.location}
                  </p>
                </span>
              </div>
              <p className={`text-base ${active ? 'text-white' : 'text-bash'} font-Medium`}>
                {moment(new Date(meet?.time)).format('MMMM Do YYYY, h:mm A')}
                {' - '}
                {makeEndTIme(meet?.time, meet?.duration)}
              </p>
            </div>
          </div>
          {active && (
            <a onClick={(e) => e.stopPropagation()} href={meet?.joinUrl} target="_blank">
              <span
                className={` py-1 px-2 rounded-full hover:cursor-pointer hover:underline ${'bg-white text-bblue '}`}>
                Join Meeting
              </span>
            </a>
          )}
        </div>
        <div className="flex items-center">
          <div className="flex items-start ">
            {React.Children.toArray(
              meet.guest &&
                meet?.guests.map((_: Avatar, index: number, all: any) => {
                  return (
                    _.userId && (
                      <span
                        style={{
                          zIndex: 120 - index,
                          marginLeft: index == 0 ? 0 : -8
                        }}>
                        <XAvatar
                          {..._}
                          textClass="text-base"
                          classes={`bg-black border border-white inline rounded-full w-8 h-8   `}
                        />
                      </span>
                    )
                  );
                })
            )}
          </div>
          {modal && (
            <span
              ref={ref}
              onBlur={() => setModal(false)}
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="w-fit z-[130] hover:cursor-pointer shadow-bnkle rounded-md absolute right-2 top-4 bg-white p-2">
              <div
                onClick={() => {
                  setModal((_) => !_);
                  if (edit) edit(idx);
                  // setShowing("schedule");
                  // setEditing(true);
                }}
                className="w-full p-2 text-bash hover:bg-bbg rounded-lg flex items-center">
                <TbUser size={16} className="" />
                <span className="  ml-3 ">Update Meeting</span>
              </div>
              <div
                onClick={async (e) => {
                  e.stopPropagation();
                  setModal((_) => false);
                  if (deleteMeeting) deleteMeeting(idx);
                  // setModal(true);
                  // setShowing(null);
                }}
                className="w-full  p-2  hover:bg-red-200 rounded-lg flex items-center">
                <RiDeleteBin6Line size={16} className="text-red-600" />
                <span className="  ml-3  text-red-600">Delete meeting</span>
              </div>
            </span>
          )}
          {!noteditable && (
            <span
              onBlur={() => {
                setModal(false);
              }}
              className="p-1 rounded-full hover:bg-ashShade-0 hover:bg-opacity-25 ml-1">
              <HiEllipsisVertical
                onClick={(e) => {
                  e.stopPropagation();
                  setModal(!modal);
                }}
                size={16}
                color={active ? 'white' : '#77828D'}
              />
            </span>
          )}
        </div>
      </div>
      <div className="flex items-center flex-col"></div>
    </div>
  );
};

type Avatar = {
  role?: string;
  name?: string;
  id?: string;
  _id?: string;
  userId: string;
  idx?: number;
  isCreator?: boolean;
};

const UserAvatar = ({ userId, role, id, isCreator }: Avatar) => {
  //  let { image, details } = useContractorDetails(userId, role || "");
  const [initials, setInitials] = useState('');
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState('');
  let team = useAppSelector((m) => m.team);
  let [image, setImage] = useState('');
  const getUserDetails = async () => {
    setLoading(true);
    let details = team.data[userId];
    setNames(details?.name ?? details?.xname);
    setInitials(details?.initials);
    setImage(details?.logo || '');

    setLoading(false);
  };
  useEffect(() => {
    getUserDetails();
  }, [userId]);
  return team.data[userId] ? (
    <div className={`inline-flex  overflow-clip `}>
      <div className="flex items-center my-2">
        <div className="relative">
          {image ? (
            <SimpleImage
              className="w-8 h-8 object-cover shadow-inner rounded-full overflow-hidden border-2"
              url={image}
            />
          ) : (
            <div className=" w-8 h-8 text-white bg-bblue rounded-full flex items-center justify-center ">
              {loading ? <LoaderX /> : <p className=" text-xl">{initials}</p>}
            </div>
          )}
        </div>
        <div className="flex items-center">
          <p className="text-base ml-3 font-Medium">{team.data[userId]?.name}</p>
          {/* <GoVerified
            size={12}
            className="text-green-600 stroke-width-$4 stroke-white  z-10 ml-2  "
          /> */}
        </div>
        {!!isCreator && (
          <span className="text-bblue text-sm  pl-1 border-l ml-1 border-l-black">Organiser</span>
        )}
      </div>
    </div>
  ) : null;
};
