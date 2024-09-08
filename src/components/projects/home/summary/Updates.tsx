import React, { useEffect, useMemo, useState, useContext, useRef } from 'react';
import useProjectFinancials from 'Hooks/useProjectFinancials';
import { formatter } from './Budget';
import { getStrictlyUpcoming, getUpcoming } from './helpers';
import { LoaderX } from 'components/shared/Loader';
import { StoreContext } from 'context';
import { addMinutes, differenceInDays, differenceInMonths, differenceInYears } from 'date-fns';
import { useAppSelector } from 'store/hooks';

import useContractorDetails from 'Hooks/useContractorDetails';
import { postForm } from 'apis/postForm';
import NoContent from 'components/projects/photos/NoContent';
import { TbMapPin } from 'react-icons/tb';
import { BsCameraVideo } from 'react-icons/bs';
import { useComponentDimensions } from 'components/projects/Team/Views/Components/OnScreen';
import { isFuture } from 'date-fns';
import SubTasksUpdates from './SubTasksUpdates';
import useOverdueSubtasks from './useOverdueSubtasks';
export const isActive = (date: string, duration: string) => {
  let res = isFuture(addMinutes(new Date(date), parseInt(duration)));
  return res;
};
const Updates = () => {
  let { getSubTasks } = useOverdueSubtasks();
  const [fetching, setFetching] = useState(false);
  const [meetings, setMeetings] = useState<any[]>([]);
  const [hover, setHover] = useState(false);
  const divref = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const { data: allSubtasks, loading: _loading } = useAppSelector((m) => m.subTask);

  let { width, height } = useComponentDimensions(divref);
  let {
    data,
    selectedProjectIndex,
    selectedData: { scheduledCall },
    activeProject
  } = useContext(StoreContext);

  let user = useAppSelector((m) => m.user);

  const isMeetingActive = useMemo(() => {
    let show = false;
    if (scheduledCall) {
      let date = new Date(scheduledCall.startTime).getTime() + 60 * 1000 * 60;
      show = Date.now() < date;
    }
    return show;
  }, []);
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

  useEffect(() => {
    fetchMeetings();
  }, []);
  let { loading, financials } = useProjectFinancials();
  const [showing, setShowing] = useState(0);

  let upcomingDisbursement = React.useMemo(() => {
    let disbursements = financials
      .map((m) => {
        if (!m.disbursements) return [];
        return [
          ...m.disbursements.map((x: any) => {
            return { ...x, bidId: m.bidId, contractor: m.contractor };
          })
        ];
      })
      .flat();
    return getStrictlyUpcoming(disbursements);
  }, [financials]);
  useEffect(() => {
    let interval = setInterval(() => {
      if (!hover) {
        let _ = showing;

        setShowing((_) => {
          if (_ == components.length - 1) {
            return 0;
          } else {
            return _ + 1;
          }
        });
      }
    }, 3000);

    return () => {
      clearInterval(interval);
    };
  }, [hover]);

  useEffect(() => {
    scrollRef?.current?.scrollTo({ left: showing * width });
  }, [showing]);

  let components = useMemo(() => {
    let payments = (
      <div className="h-full w-full">
        {loading ? (
          <LoaderX />
        ) : upcomingDisbursement?.amount ? (
          <UpComingDisbursement
            amount={upcomingDisbursement.amount}
            dueDate={upcomingDisbursement.dueDate}
            contractor={upcomingDisbursement.contractor}
          />
        ) : (
          <div className="w-full h-full rounded-md flex items-center justify-center bg-lightblue ">
            <p className="text-2xl font-medium">No upcoming Payment</p>
          </div>
        )}
      </div>
    );

    let meeting = <Meetings fetching={fetching} meetings={meetings} />;
    let subTasks = <SubTasksUpdates />;
    let comps = [payments, meeting, subTasks];
    if (allSubtasks.length < 1) {
      comps.pop();
    }
    return comps;
  }, [upcomingDisbursement, fetchMeetings, meetings, loading, allSubtasks, activeProject._id]);
  useEffect(() => {
    getSubTasks();
  }, [activeProject]);
  return (
    <div
      onMouseLeave={() => {
        setHover((_) => false);
      }}
      onMouseOver={() => {
        setHover((_) => true);
      }}
      className="flex-1 h-80  flex-col flex bg-white pt-6 px-6 pb-4 rounded-md ">
      <p className="text-xl mb-2.5 font-semibold">Updates</p>
      <div ref={divref} className="flex-1 ">
        <div ref={scrollRef} className=" overflow-x-auto " style={{ width, height }}>
          <div style={{ width: width * 3, height }} className="   flex  ">
            {components.map((m) => (
              <span className=" inline " style={{ width, height }}>
                {m}
              </span>
            ))}
          </div>
        </div>
      </div>
      <div className="flex hover:cursor-pointer  gap-2 items-center justify-center mt-3 h-34 w-full">
        {Array(components.length)
          .fill(1)
          .map((m, i) => (
            <div
              key={i}
              onClick={() => {
                setShowing(i);
              }}
              className={`w-2 h-2 ${
                showing === i ? ' bg-bash ' : ' bg-pbg '
              }  rounded-full `}></div>
          ))}
      </div>
    </div>
  );
};

interface DisbursementProps {
  amount: number;
  contractor: string;
  dueDate: string;
}
const UpComingDisbursement = ({ amount, contractor, dueDate }: DisbursementProps) => {
  let days = differenceInDays(new Date(dueDate), new Date());
  let months = differenceInMonths(new Date(dueDate), new Date());
  const handleMonths = () => {
    if (months < -1) return `Last ${Math.abs(months)}Months`;
    if (months == -1) return 'Last Month';
    if (months == 0) return 'This Month';
    if (months == 1) return 'Next Month';
    return `Next ${months}Months`;
  };
  let professional = useContractorDetails(contractor, 'contractor');
  let consultant = useContractorDetails(contractor, 'consultant');

  let details = useMemo(() => {
    let nameProf = professional.details?.name;
    let nameConsultant = consultant.details?.name;
    return nameProf ?? nameConsultant;
  }, [professional, consultant]);
  return (
    <div className="w-full rounded-md p-6 bg-blueShades-1">
      <div className=" flex justify-between items-center ">
        <span className="font-semibold">Upcoming Payment</span>
        <span className="text-white p-2 rounded-full bg-byellow-1">
          {days > 0 ? `Due in ${days} Day${days > 1 ? 's' : ''}` : 'Due today'}
        </span>
      </div>
      <p className="font-semibold text-4xl mt-16">N{formatter.format(amount)}</p>
      <div className="flex text-bblack-1 mt-2 font-semibold items-center w-full justify-between">
        <span>To {details}</span>
        <span>{handleMonths()}</span>
      </div>
    </div>
  );
};

interface MeetingProps {
  meetings: any[];
  fetching: boolean;
}
const Meetings = ({ meetings, fetching }: MeetingProps) => {
  let {
    selectedData: { scheduledCall },
    data,
    selectedProjectIndex
  } = useContext(StoreContext);
  let user = useAppSelector((m) => m.user);

  let _meetings = useMemo(() => {
    let _ = [...meetings];
    let show = false;
    if (scheduledCall) {
      let date = new Date(scheduledCall.startTime).getTime() + 60 * 1000 * 60;
      show = Date.now() < date;
    }
    if (show) {
      _.unshift({
        location: 'Online',
        time: scheduledCall?.startTime,
        duration: '60',
        title: 'Project Brief Discussion'
      });
    }
    // if(){

    // }
    return _;
  }, [meetings]);
  const getTime = (str: string) => {
    return new Date(str).toString().split(' ')[4].slice(0, 5);
  };

  let flexRef = useRef<HTMLDivElement>(null);

  let { height } = useComponentDimensions(flexRef);

  return (
    <div className="w-full h-full flex flex-col  ">
      <p className="font-bold mb-4">Meetings</p>
      <div ref={flexRef} className=" flex-1 overflow-auto  px-2">
        <div style={{ height }} className=" ">
          <div className=" gap-2  flex flex-col ">
            {fetching ? (
              <LoaderX />
            ) : _meetings.length > 0 ? (
              _meetings.map((m) => (
                <div className="w-full p-3  bg-pbg rounded-md text-bblack-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-semibold">{m.title}</p>
                    <p className="text-xs">{m.time.slice(0, 10).split('-').reverse().join('-')}</p>
                  </div>
                  <div className="flex items-center justify-between mt-3">
                    <div className=" flex items-center">
                      {React.createElement(m.location === 'Onsite' ? TbMapPin : BsCameraVideo, {
                        className: `text-black text-base`,
                        size: 16
                      })}
                      <p className="text-sm font-semibold ml-2">{m.location}</p>
                    </div>

                    <p className="text-xs">
                      {`${getTime(m.time)} - ${getTime(
                        addMinutes(new Date(m.time), parseInt(m.duration) ?? 15).toString()
                      )}`}
                    </p>
                  </div>
                </div>
              ))
            ) : null}
          </div>
          {_meetings.length === 0 && (
            <div className="w-full h-full rounded-md flex items-center justify-center bg-lightblue">
              <p className="text-2xl font-medium">No Upcoming Meetings Today</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default Updates;
