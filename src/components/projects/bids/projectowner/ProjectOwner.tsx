import { useState, useEffect } from 'react';
import ContractorCard from '../ContractorCard';
import Modal from './Modal';
import { useAppSelector } from '../../../../store/hooks';
import { useNavigate, useLocation } from 'react-router-dom';
import { BsArrowRight } from 'react-icons/bs';
import { convertToProper } from 'components/shared/utils';

const ProjectOwner = () => {
  let navigate = useNavigate();
  let { pathname } = useLocation();
  const [schedule, setSchedule] = useState(false);
  const [enableNext, setEnableNext] = useState(false);
  const bid = useAppSelector((m) => m.bid);
  let user = useAppSelector((m) => m.user);
  useEffect(() => {
    if (!bid._id) {
      navigate('/projects/bid');
    }
  }, []);
  return (
    <div>
      {bid.invites.length > 0 ? (
        <>
          {schedule ? <Modal close={() => setSchedule(false)} /> : null}
          <div className="w-full flex justify-end">
            <button
              onClick={() => setSchedule(true)}
              className="py-2 px-6 mb-6 bg-bblue text-white rounded-md "
            >
              {enableNext ? 'Reshedule bid' : 'Schedule bid'}
            </button>
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 ">
            {bid?.invites.map((m: any, i: number) => (
              <ContractorCard key={i} consultantId={m.bidder} type={bid.type} />
            ))}
          </div>
        </>
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <h1 className=" text-bblack-1">
            No {convertToProper(bid.type || 'Professional')} has been invited to this bid
          </h1>
        </div>
      )}
    </div>
  );
};

export default ProjectOwner;
