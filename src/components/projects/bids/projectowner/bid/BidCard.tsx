import { useEffect, useMemo, useState } from 'react';
import calendar from '../../../../../assets/calendar.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { switchBid } from '../../../../../store/slices/bidslice';
import { format } from 'date-fns';
import ContractorLogo from './ContractorLogo';
import { IoEllipsisVertical } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { inRange } from '../OngoingBid';
import { getTimeRemaining, convertToProper } from 'components/shared/utils';
import { postForm } from 'apis/postForm';
import { ToastContainer } from 'react-toastify';
import Loader from 'components/shared/Loader';
import { checkAvailability } from '../../portfoliomanager/TabComponent';
import { differenceInDays } from 'date-fns';
import { displayError, displaySuccess } from 'Utils';
import { PiPlus } from 'react-icons/pi';

interface Prop {
  ibid: any;
  index: number;
  setter: any;
  bids: any[];
}

const percentage = (bid: any) => {
  if (bid?._id) {
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

const BidCard = ({ ibid, setter, bids }: Prop) => {
  let [bid, setBid] = useState(ibid);
  let dispatch = useAppDispatch();
  let user = useAppSelector((m) => m.user);
  let navigate = useNavigate();
  const { projectId } = useParams();
  const [fetching, setFetching] = useState(false);
  const [gettingDocs, setGettingDocs] = useState(false);

  const addSubmissions = (submissions: any[] = []) => {
    let copy = { ...bid };
    copy.submittedBids = submissions;
    setBid(copy);
  };

  const getSubBids = async () => {
    setGettingDocs(true);
    let { response, e } = await postForm('get', `submissions/bid/${ibid._id}`, {});
    if (response) {
      addSubmissions(response.data.data);
    }
    setGettingDocs(false);
  };
  const deleteBid = async () => {
    setFetching(true);
    let { response, e } = await postForm('delete', `bids/${bid._id}`);
    if (response) {
      let filtered = bids.filter((m) => m._id !== bid._id);
      setter(filtered);
      displaySuccess('Bid deleted successfully');
    } else {
      displayError('could not delete bid');
    }
    setFetching(false);
  };

  const isWinnerSelected = () => {
    let submitted = bid?.submittedBids;
    let submissions = submitted.length;
    let wins = bid.winningBid;
    let lastestWinner = wins[wins.length - 1];
    let winnerSelected =
      Array.isArray(bid?.winningBid) && lastestWinner?.id && lastestWinner?.status !== 'declined';
    if (submissions > 0 && winnerSelected) {
      return true;
    }
    return false;
  };

  const winner = useMemo(() => {
    let submitted = bid?.submittedBids;
    let submissions = submitted.length;
    let wins = bid.winningBid;
    let lastestWinner = wins[wins.length - 1];
    let winnerSelected =
      Array.isArray(bid?.winningBid) && lastestWinner?.id && lastestWinner?.status !== 'declined';
    let winner = '';
    if (submissions > 0 && winnerSelected) {
      for (let i of submitted) {
        if (i._id === lastestWinner.id) {
          winner = i.bidder;
        }
      }
      return winner;
    }
    return null;
  }, [bid]);

  const isWon = useMemo(() => isWinnerSelected(), [bid, ibid]);
  const [edit, setEdit] = useState(false);
  const hasBidEnded = () => {
    if (isWon || new Date().getTime() > new Date(bid?.schedule?.end).getTime()) {
      return true;
    }
    return false;
  };

  const hasBidStarted = () => {
    if (new Date().getTime() > new Date(bid?.schedule?.start).getTime()) {
      return true;
    }
    return false;
  };
  useEffect(() => {
    getSubBids();
  }, []);

  let start = useMemo(() => {
    let label = 'Bid ';
    let date: string | React.ReactElement = <span className="text-bred">Not Set</span>;
    if (hasBidStarted()) {
      label += 'Started';
    } else {
      label += 'Starts';
    }

    if (ibid?.schedule?.start)
      date = format(new Date(ibid?.schedule?.start ?? undefined), 'MM/dd/yyyy');
    return { label, date };
  }, [ibid, bid]);
  let end = useMemo(() => {
    let label = 'Bid ';
    let date: string | React.ReactElement = <span className="text-bred">Not Set</span>;
    if (hasBidEnded()) {
      label += 'Ended';
    } else {
      label += 'Ends';
    }

    if (ibid?.schedule?.end)
      date = format(new Date(ibid?.schedule?.end ?? undefined), 'MM/dd/yyyy');
    return { label, date };
  }, [ibid, bid]);

  return (
    <div>
      <div
        onClick={() => {
          if (edit) {
            setEdit(false);
            return;
          }
          if (!gettingDocs) {
            dispatch(switchBid(bid));
            let docsAvailable = checkAvailability(bid?.bidDocuments);
            if (user.role === 'projectOwner') {
              navigate(
                `/projects/${projectId}/bid/details${bid?.schedule?.start ? '/ongoing' : ''}`
              );
            } else {
              if (!docsAvailable) {
                navigate(`/projects/${projectId}/bid/details/uploads`);
              } else if (docsAvailable && bid.invites.length > 0) {
                navigate(
                  `/projects/${projectId}/bid/details/process${
                    bid?.schedule?.start ? '/ongoing' : ''
                  }`
                );
              } else {
                navigate(`/projects/${projectId}/bid/details/invite`);
              }
            }
          } else {
            displayError('Fetching bid submissions.. Please wait for a few seconds');
          }
        }}
        className="px-6 py-4  w-full cursor-pointer relative   bg-white rounded-lg"
      >
        <span className="w-full flex justify-between items-center">
          <span className="w-full flex items-center">
            <span
              className={` font-semibold mr-3 text-center rounded-3xl py-1 px-3 text-xs ${
                isWon ? ' text-bgreen-0 bg-bgreen-1' : 'text-byellow-1 bg-byellow-0'
              }  `}
            >
              {isWon
                ? 'Bid Completed'
                : bid?.submittedBids?.length > 1
                  ? 'Documents in review'
                  : 'Submit Bid Documents'}
            </span>
            <span
              className={`rounded-3xl font-semibold ${
                bid.type === 'consultant'
                  ? ' bg-lightShades-1 text-redShades-0'
                  : 'bg-lightShades-0 text-borange'
              }  py-1 px-2 text-xs `}
            >
              {convertToProper(bid.type)}
            </span>
          </span>
          <span
            onClick={(e) => {
              e.stopPropagation();
              setEdit(!edit);
            }}
            className="relative cursor-pointer flex flex-col"
          >
            <span
              className={`${edit ? 'bg-bblue p-1' : 'hover:bg-ashShade-0 p-1 hover'} rounded-full`}
            >
              <IoEllipsisVertical size={16} color={edit ? 'white' : '#9099A8'} />
            </span>
            {edit ? (
              <span
                onBlur={() => setEdit(!edit)}
                className="absolute p-2 rounded-lg w-36 top-8 right-0 shadow-lg bg-white"
              >
                <span
                  onClick={async (e) => {
                    e.stopPropagation();
                    await deleteBid();
                  }}
                  className={'rounded-md  flex justify-center  items-center '}
                >
                  {fetching ? (
                    <Loader color="blue" />
                  ) : (
                    <div className="w-full p-2 hover:bg-bbg rounded-lg flex items-center">
                      <RiDeleteBin6Line size={12} color="#437ADB" />
                      <span className=" text-sm ml-3 text-bblue">Delete</span>
                    </div>
                  )}
                </span>
              </span>
            ) : null}
          </span>
        </span>

        <p className="font-semibold text-2xl mt-6 mb-6">{bid.name}</p>
        <span className={`w-full  ${!hasBidStarted() || hasBidEnded() ? 'hidden' : ''}`}>
          {getTimeRemaining(new Date(), new Date(bid?.schedule?.end))} left to submit bid documents
        </span>
        <div
          className={`rounded-full w-full mt-3 h-2 mb-4 bg-ashShade-3  ${
            !isWinnerSelected() && hasBidStarted() && !hasBidEnded() ? '' : 'hidden'
          }`}
        >
          <div
            style={{
              width: `${!isWinnerSelected() ? percentage(bid) * 100 : 100}%`
            }}
            className={` block h-full ${
              !isWinnerSelected()
                ? percentage(bid) < 1
                  ? ' bg-byellow-1'
                  : ' bg-bgreen-0'
                : ' bg-bgreen-0'
            } rounded-full`}
          ></div>
        </div>
        <div className="mb-4  flex ">
          {bid.invites.length > 0 ? (
            bid.invites.map((m: any, i: number) => (
              <ContractorLogo
                contractorId={m.bidder}
                index={i}
                key={i}
                type={bid.type}
                showWinBadge={winner ? winner === m.bidder : false}
              />
            ))
          ) : (
            <div className=" p-1 bg-ashShade-0 rounded-full flex items-center justify-center">
              <PiPlus size={32} color="#C8CDD4" />
            </div>
          )}
        </div>
        <div className="flex justify-between items-center text-xs">
          <span className="flex items-center">
            {
              <span className="flex flex-col mr-6">
                <span className=" font-semibold text-sm">{start.label}</span>
                <span className="text-xs">{start.date}</span>
              </span>
            }

            {
              <span className="flex flex-col">
                <span className=" font-semibold text-sm">{end.label}</span>
                <span className="text-xs">{end.date}</span>
              </span>
            }
          </span>
        </div>
      </div>
    </div>
  );
};

export default BidCard;
