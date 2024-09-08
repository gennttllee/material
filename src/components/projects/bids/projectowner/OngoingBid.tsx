import React, { useState, useEffect } from 'react';
import BidDocument from './BidDocument';
import { useAppSelector } from '../../../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { displayError, displayInfo, displaySuccess } from 'Utils';
import SelectBidWinner from './SelectBidWinner';
import { getTimeRemaining } from 'components/shared/utils';
import Modal from './Modal';
import { TbRefresh } from 'react-icons/tb';
import { refreshBid } from 'store/slices/bidslice';
import differenceInDays from 'date-fns/fp/differenceInDays';

export const inRange = (date: Date, start: Date, end: Date) => {
  return date < start ? 'before' : date > end ? 'after' : 'in-range';
};

export const isWinnerSelected = (bid: any) => {
  let submitted = bid?.winningBid;
  let submissions = submitted.length;
  let lastestWinner = submitted[submissions - 1];
  let winnerSelected =
    Array.isArray(bid?.winningBid) && lastestWinner?.id && lastestWinner?.status !== 'declined';
  if (submissions > 0 && winnerSelected) {
    return true;
  }
  return false;
};

export const possiblePotentialWinner = (bid: any) => {
  if (isWinnerSelected(bid)) {
    return false;
  }
  if (bid?.winningBid?.length === 0 && bid?.submittedBids?.length > 0) {
    return true;
  }
  for (let i = 0; i < bid?.submittedBids?.length; i++) {
    let thisbid = bid.submittedBids[i]?._id;
    for (let j = 0; j < bid?.winningBid.length; j++) {
      let thisWin = bid?.winningBid[j];
      if (thisbid !== thisWin?.id) {
        return true;
      }
    }
  }
  return false;
};
const OngoingBid = () => {
  let navigate = useNavigate();
  let bid = useAppSelector((m) => m.bid);
  const [status, setStatus] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selected, setSelected] = useState<string>('');
  const [editModal, setEditModal] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [percent, setPercent] = useState(0);

  let time = (status: string) => {
    return !bid?.winningBid?.id
      ? status === 'before'
        ? `Bid starts in ${getTimeRemaining(new Date(), bid.schedule.start)}`
        : status === 'after'
          ? 'Bid has ended'
          : `${getTimeRemaining(new Date(), new Date(bid.schedule.end))} left`
      : 'Bid has ended';
  };
  const [remaining, setRemaining] = useState('');

  useEffect(() => {
    if (!bid._id && !bid.schedule) {
      navigate('project/bid');
    }
  }, []);
  const updateStatus = () => {
    if (bid.schedule) {
      let stat = inRange(new Date(), new Date(bid.schedule.start), new Date(bid.schedule.end));
      setStatus((prevState) => stat);
    }
  };
  useEffect(() => {
    setRemaining(time(status));
  }, [bid, status]);
  useEffect(() => {
    updateStatus();
    setRemaining(time(status));
    setPercent(percentage());
  }, []);

  const percentage = () => {
    if (bid._id) {
      if (
        inRange(new Date(), new Date(bid?.schedule?.start), new Date(bid?.schedule?.end)) ===
        'in-range'
      ) {
        return (
          differenceInDays(new Date(), new Date(bid?.schedule?.start)) /
          differenceInDays(new Date(bid?.schedule?.end), new Date(bid?.schedule?.start))
        );
      } else if (new Date() > new Date(bid?.schedule?.end)) {
        return 1;
      } else {
        return 0;
      }
    } else {
      return 0;
    }
  };

  useEffect(() => {
    updateStatus();
    setPercent((_) => percentage());
  }, [bid]);

  return (
    <div>
      {editModal ? <Modal isEditing={true} close={() => setEditModal(false)} /> : null}
      {showModal ? <SelectBidWinner closer={setShowModal} setter={setSelected} /> : null}
      <div className="flex mb-3 items-center w-full justify-end ">
        <button
          onClick={() => {
            if (bid?.submittedBids?.length < 1) {
              displayInfo('No contractor has submitted a bid yet');
            } else {
              status !== 'after'
                ? displayInfo('Bid has not ended yet')
                : isWinnerSelected(bid)
                  ? displayInfo('Bid Winner has been selected')
                  : !possiblePotentialWinner(bid)
                    ? displayInfo(
                        'No winner can be selected since no doucments have been submitted'
                      )
                    : setShowModal(!showModal);
            }
          }}
          className={`${
            possiblePotentialWinner(bid) && status === 'after'
              ? 'bg-bblue text-white '
              : 'border-2 border-ashShade-4 text-bash'
          } self-end py-2 px-6 rounded-lg font-Medium text-base`}
        >
          Select Bid Winner
        </button>
      </div>

      <div className="w-full p-6 bg-white rounded-lg">
        <p className=" text-xl font-semibold">
          {isWinnerSelected(bid)
            ? 'Finish Bid'
            : status === 'before'
              ? 'Bid has not Started'
              : status != 'after'
                ? 'Ongoing bid'
                : 'Bid Schedule has passed'}
        </p>
        <div className="mt-6 mb-1 text-sm flex justify-between items-center">
          <p className={`${isWinnerSelected(bid) ? 'text-bash' : ''}`}>
            {isWinnerSelected(bid) ? `Lasted ${bid?.schedule?.duration} days` : remaining}
          </p>{' '}
          <span
            onClick={() => {
              setEditModal(true);
            }}
            className=" cursor-pointer hover:underline"
          >
            Edit
          </span>
        </div>

        <div className="rounded-full w-full h-2 bg-ashShade-3">
          <div
            style={{
              width: `${!isWinnerSelected(bid) ? percent * 100 : 100}%`
            }}
            className={` block h-full ${
              percent < 1 && !isWinnerSelected(bid) ? ' bg-byellow-1' : ' bg-bgreen-0'
            } rounded-full ${status === 'before' ? 'hidden' : 'false'} `}
          ></div>
        </div>
      </div>
      <div className=" mt-7 w-full grid grid-cols-1 md:grid-cols-2 gap-3 xl:grid-cols-3  ">
        {bid && bid.invites
          ? bid.invites.map((e: any, i: number) => (
              <BidDocument key={i} invite={e} setter={setSelected} />
            ))
          : null}
      </div>
    </div>
  );
};

export default OngoingBid;
