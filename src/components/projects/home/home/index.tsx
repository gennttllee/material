import React, { useContext, useEffect, useMemo } from 'react';
import ProjectTitle from './ProjectTitle';
import Facilities, { FacilityRefactored } from './Facilities';
import { StoreContext } from 'context';
import ProjectDrawings from './ProjectDrawings';
import { TbCalendarTime } from 'react-icons/tb';
import { addHours } from 'date-fns';
import { getTimeDescription } from 'components/shared/utils';
import { useAppSelector } from 'store/hooks';
import { isProfessional } from '../../Team/Views/Components/MemberList';

interface HomeProps {
  isPopUp?: boolean;
  closer?: () => void;
}
const Home = ({ isPopUp, closer }: HomeProps) => {
  let {
    selectedData: { scheduledCall },
    data,
    selectedProjectIndex
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
  return (
    <div className="w-full pb-2">
      {isPopUp && (
        <div className="w-full flex py-6 border-b mb-6 border-b-ashShade-3 items-center justify-between px-5 sm:px-12 ">
          <span className="font-bold  text-xl text-bblack-0">Project Brief</span>
          <span
            onClick={() => {
              if (closer) closer();
            }}
            className="hover:cursor-pointer hover:underline">
            Close
          </span>
        </div>
      )}
      {isMeetingActive && !isProfessional(user.role) ? (
        <div
          onClick={() => {
            window.open(scheduledCall?.joiningInfo?.eventUrl, '_blank');
          }}
          className="w-full hover:cursor-pointer hover:underline z-40 sticky top-0  text-blueShades-0 rounded-md bg-blueShades-1 py-4 px-6 flex items-center justify-between">
          <div className="flex items-center">
            <TbCalendarTime className="text-xl lg:text-base" />
            <div className="flex  items-center">
              <span className="font-bold mx-2">
                Upcoming Meeting :
                <span className=" font-normal">
                  {' '}
                  Project Brief Discussion - {getTimeDescription(scheduledCall?.startTime)}
                </span>
              </span>
            </div>
          </div>
        </div>
      ) : null}
      <ProjectTitle />
      {isPopUp && <Line />}
      <FacilityRefactored />
      {isPopUp && <Line />}
      <ProjectDrawings />
    </div>
  );
};

const Line = () => {
  return (
    <div className="px-5 sm:px-12 my-6">
      <div className=" w-full border-b border-b-ashShade-3  "></div>
    </div>
  );
};

export default Home;
