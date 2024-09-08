import React, { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import { TbLock } from 'react-icons/tb';
import { displayError, displayInfo, displaySuccess } from 'Utils';

interface Prop {
  label: string;
  active: boolean;
  route: string;
  details: {
    name: string;
    route: string;
  };
  closeChecklist: () => void;
}

export const checkAvailability = (arr: any) => {
  if (Array.isArray(arr) === false) {
    return false;
  }
  for (let i = 0; i < arr.length; i++) {
    if (arr[i].isAvailable === true) {
      return true;
    }
  }
  return false;
};
const Tab = ({ label, active, route, details, closeChecklist }: Prop) => {
  let bid = useAppSelector((m) => m.bid);
  const { projectId } = useParams();
  let navigate = useNavigate();
  const showLock = () => {
    if (details.route === 'uploads') {
      return false;
    } else {
      if (details.route === 'invite' && checkAvailability(bid?.bidDocuments)) {
        return false;
      } else if (
        details.route === 'process' &&
        bid?.bidDocuments?.length > 0 &&
        bid?.invites?.length > 0
      ) {
        return false;
      } else {
        return true;
      }
    }
  };
  let lock = useMemo(() => showLock(), [bid]);
  return (
    <div
      onClick={() => {
        closeChecklist();
        !lock
          ? route === 'process' && bid?.schedule?.duration
            ? navigate(`/projects/${projectId}/bid/details/` + route + '/ongoing')
            : navigate(`/projects/${projectId}/bid/details/` + route)
          : displayInfo('this process is locked');
      }}
      className={`flex cursor-pointer group relative  mr-4 justify-center flex-col items-center `}
    >
      {lock ? (
        <span className="absolute top-[calc(50%+20px)] hidden group-hover:flex   w-48 p-2 bg-black rounded-lg text-white text-xs before:content-[''] before:absolute before:left-1/2 before:-top-[16px] after:translate-x-1/2 before:border-8 before:border-x-transparent before:border-t-transparent before:border-b-black">
          {route === 'invite'
            ? 'Bid documents must be submitted before you can invite contractors'
            : 'You must select contractors before viewing bid process'}
        </span>
      ) : null}
      <div className="flex items-center mb-1">
        {lock ? <TbLock size={16} color="#9099A8" /> : null}
        <p
          className={`text-center ml-3 font-semibold  ${
            lock ? 'text-bash' : active ? 'text-bblue' : 'text-[#091C2F] hover:text-bblack-0'
          }`}
        >
          {label}
        </p>
      </div>

      {active ? <span className="w-8 h-[2px] bg-bblue"></span> : null}
    </div>
  );
};

export default Tab;
