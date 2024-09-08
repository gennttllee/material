import React, { memo, useContext, useEffect, useMemo, useState } from 'react';
import { TbLockOpenOff } from 'react-icons/tb';
import { displayError, displayInfo, displaySuccess } from 'Utils';
import { Bid, SubmittedBid, Invite, ProfessionalBid, RsvpStatus } from '../../../../../types';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import StatusBanner from './StatusBanner';
import Moment from 'react-moment';
import 'moment-timezone';
import { useAppSelector } from '../../../../../store/hooks';
import useFetch from '../../../../../Hooks/useFetch';
import { getSubmitDocsApi, invitationApi } from '../../../../../apis/projectBrief';
import ProjectTitle from '../../../home/home/ProjectTitle';
import Facilities, { FacilityRefactored } from '../../../home/home/Facilities';
import ProjectDrawings from '../../../home/home/ProjectDrawings';
import { BsCheckSquareFill, BsSquare } from 'react-icons/bs';
import Button from '../../../../shared/Button';
import Modal from '../../../../shared/Modal';
import { useNavigate } from 'react-router-dom';
import { StoreContext } from 'context';
import { dateFormat } from '../../../../../constants';

const BidCard = (one: ProfessionalBid) => {
  const navigate = useNavigate();
  const [showModal, setModal] = useState(false);
  const [invite, setInvite] = useState<Invite>();
  const { setContext, selectedData } = useContext(StoreContext);
  const { _id: professionalId } = useAppSelector((state) => state.user);
  const [winningBid, setWinningBid] = useState<Bid['winningBid'][number]>();
  const [bidProgress, setBidProgress] = useState({ percentage: 0, diff: 0 });
  const [hasAgreed, setAgreement] = useState<boolean | undefined | null>(null);
  const [submittedBid, setSubmittedBid] = useState<ProfessionalBid['submittedBid']>();
  const [{ hasEnded, hasStarted }, setPosition] = useState({
    hasStarted: false,
    hasEnded: false
  });
  /** Fetch */
  const { load: submitLoader, isLoading: isSubmitLoading } = useFetch({
    showDisplayError: false
  });
  const { load: declineLoader, isLoading: isDeclineLoading } = useFetch();
  const { load, isLoading } = useFetch();
  /** Dates */
  const today = useMemo(() => new Date().getTime(), []);
  const start = useMemo(() => new Date(one.schedule?.start || '').getTime(), [one.schedule]);
  //
  // const project = usecallback(()=>{},[])
  useEffect(() => {
    // get all submissions on a bid
    if (submittedBid === undefined) {
      submitLoader(getSubmitDocsApi(one._id))
        .then((res) => {
          if (res.data) {
            /** Find a submission */
            const exists = res.data.find(
              (el: SubmittedBid<string>) => el.bidder === professionalId
            );
            // if no submission found return null
            if (!exists) return null;
            // else save the submission
            setSubmittedBid(exists);
            /** if exists, find if its the winning bid */
            if (exists) {
              const WB = one.winningBid.find((one) => one.id === exists._id);
              setWinningBid(WB);
            }
          }
        })
        .catch(() => {
          //
          setSubmittedBid(null);
        });
    } else if (submittedBid && !winningBid) {
      const WB = one.winningBid.find((one) => one.id === submittedBid._id);
      setWinningBid(WB);
    }
  }, [one, professionalId, winningBid, submitLoader, submittedBid]);

  useEffect(() => {
    /** Find the Progress */
    if (one.schedule) {
      const end = new Date(one.schedule.end).getTime();
      // check the time line
      const hasStarted = today >= start;
      const hasEnded = today > end;

      setPosition({ hasStarted, hasEnded });

      const diff = hasEnded ? 0 : end - today;

      const dayDiff = diff / (1000 * 60 * 60 * 24);

      const totalDiff = end - start;
      const totalDaysDiff = totalDiff / (1000 * 60 * 60 * 24);
      const percentage = 100 - (dayDiff * 100) / totalDaysDiff;

      setBidProgress({
        percentage,
        diff: hasEnded ? 0 : +dayDiff.toFixed(0)
      });
    }
  }, [one, start, today]);

  useEffect(() => {
    if (!invite) {
      const myInvite = one.invites.find((one: Invite) => one.bidder === professionalId);
      //
      if (myInvite) setInvite(myInvite);
    }
  }, [invite, one.invites, professionalId]);

  const toggleAgreement = () => {
    setAgreement((prev) => !prev);
  };

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const rsvpStatusHandler = (rsvpStatus: RsvpStatus) => {
    /** Return a corresponding Loader ~ Status */
    if (invite)
      (() => {
        if (rsvpStatus === RsvpStatus.Accepted) {
          return load(invitationApi(invite._id, rsvpStatus));
        } else {
          return declineLoader(invitationApi(invite._id, rsvpStatus));
        }
      })().then((res) => {
        displaySuccess(res.message);
        setInvite((prev) => ({ ...(prev as Invite), rsvpStatus }));
        /**
         * Change Bids state
         */
        const newInvites = one.invites.map((el) => {
          if (el._id !== invite._id) return el;
          return {
            ...el,
            rsvpStatus
          };
        });
        setContext((prev) => {
          const newBids = selectedData.literalBids.map((bid) =>
            bid._id === one._id ? { ...bid, invites: newInvites } : bid
          );
          return {
            ...prev,
            menuProjects: prev.menuProjects.map((project) =>
              project._id === selectedData._id ? { ...project, literalBids: newBids } : project
            )
          };
        });
        toggleModal();
        handleClick(one);
      });
  };

  const handleClick = (bid?: ProfessionalBid) => {
    const current = bid || one;
    if (current.schedule) {
      if (bid || invite?.rsvpStatus === 'accepted') {
        if (today >= start) {
          /** Updated Bid */
          // const newBid:ProfessionalBid = { ...current, submittedBid }
          // setMainBid(newBid)
          navigate(current._id);
        } else {
          displayInfo('Bid has not started yet');
        }
      } else {
        toggleModal();
      }
    } else {
      displayInfo('Bid has not been scheduled yet');
    }
  };

  const InvitationForm = (
    <div className="bg-white relative cursor-auto overflow-y-scroll w-11/12 lg:w-3/4 h-5/6 p-6 flex-col rounded-lg z-10">
      <div className="p-4 md:p-12">
        <div className={flexer}>
          <h2
            className={` ${
              invite?.rsvpStatus === 'declined' ? 'text-red-700' : ''
            } text-3xl font-semibold `}>
            {invite?.rsvpStatus === 'declined' ? 'Invitation Declined' : 'Invitation to bid'}
          </h2>
          <strong onClick={toggleModal} className={'text-orange-400 medium text-sm' + hoverFade}>
            Close
          </strong>
        </div>
        <p className="text-lg text-bash">{one.description}</p>
      </div>
      <ProjectTitle />
      <FacilityRefactored />
      <ProjectDrawings />
      {invite?.rsvpStatus === 'unanswered' ? (
        <div className="p-4 md:p-12">
          <div className="flex items-start">
            {hasAgreed ? (
              <BsCheckSquareFill
                className="text-bblue text-xl cursor-pointer"
                onClick={toggleAgreement}
              />
            ) : (
              <BsSquare className="text-bblue text-xl cursor-pointer" onClick={toggleAgreement} />
            )}
            <p className="text-bash ml-4 -translate-y-1 w-full md:w-1/2">
              By engaging with the contractor, you affirm that you have thoroughly reviewed the
              terms and conditions and are committed to complying with them.
            </p>
          </div>
          <div className="flex w-full md:w-auto  md:items-center mt-6">
            <Button
              text="Decline"
              type={'secondary'}
              isLoading={isDeclineLoading}
              className="text-black border-black m-0"
              onClick={() => rsvpStatusHandler(RsvpStatus.Declined)}
            />
            <Button
              text="Accept"
              isLoading={isLoading}
              className="ml-2 text-base m-0"
              onClick={() => rsvpStatusHandler(RsvpStatus.Accepted)}
              type={hasAgreed ? 'primary' : 'muted'}
            />
          </div>
        </div>
      ) : null}
    </div>
  );

  return (
    <>
      <div
        onClick={() => handleClick()}
        className="bg-white py-8 px-6 rounded-md cursor-pointer relative overflow-hidden">
        {isSubmitLoading ? (
          <p className="text-ashShade-4 text-sm">Fetching Submissions ...</p>
        ) : (
          <div className="flex items-center">
            {submittedBid && !winningBid && !one.winningBid[0] ? (
              <StatusBanner label="Submit Bid Documents" type="pending" />
            ) : null}
            {!one.schedule || today <= start ? (
              <StatusBanner label="Not Started" type="dormant" />
            ) : !submittedBid ? null : winningBid ? (
              <>
                {submittedBid._id === winningBid.id || winningBid.status === 'accepted' ? (
                  <StatusBanner label="Bid Completed" type="done" />
                ) : null}
                {submittedBid._id !== winningBid.id ? (
                  <StatusBanner label="Not Selected" type="decline" className="ml-2" />
                ) : null}
              </>
            ) : one.winningBid[0] ? (
              <StatusBanner label="Not Selected" type="decline" />
            ) : null}
          </div>
        )}

        <h2 className="font-semibold text-2xl mt-4 capitalize">{one.name}</h2>

        <div className="my-6">
          <div className={flexer}>
            {!one.schedule || today <= start ? (
              <div className="flex items-center">
                <TbLockOpenOff className="mr-1" />
                <p className="text-sm text-ashShade-2">Not Started</p>
              </div>
            ) : (
              <label>
                {bidProgress.percentage === 100 ? (
                  'Completed'
                ) : bidProgress.diff ? (
                  `${bidProgress.diff} Days left`
                ) : (
                  <>
                    <span className="mr-1">{hasStarted ? 'Ends' : 'Starts'}</span>
                    <Moment fromNow>{new Date(one.schedule['end'])}</Moment>
                  </>
                )}
              </label>
            )}
          </div>
          <div className="mt-3 bg-ashShade-3 rounded-3xl h-2 overflow-hidden">
            <div
              className={` ${
                bidProgress.percentage === 100 ? 'bg-green-700' : 'bg-bblue'
              } h-full rounded-3xl`}
              style={{ width: `${bidProgress.percentage}%` }}
            />
          </div>
        </div>

        <div className="flex items-center">
          <div>
            <p className="text-sm font-Medium">Bid Start{hasStarted ? 'ed' : 's'} </p>
            <p className="text-sm text-bash font-Medium">
              {one.schedule ? (
                <Moment format={dateFormat}>{one.schedule['start']}</Moment>
              ) : (
                'Not Set'
              )}
            </p>
          </div>
          <div className="ml-6 mr-auto">
            <p className="text-sm font-Medium">Bid End{hasEnded ? 'ed' : 's'} </p>
            <p className="text-sm text-bash font-Medium">
              {one.schedule ? (
                <Moment format={dateFormat}>{one.schedule['end']}</Moment>
              ) : (
                'Not Set'
              )}
            </p>
          </div>
          {!invite ? null : invite.rsvpStatus === 'declined' ? (
            <StatusBanner label={invite.rsvpStatus} type="decline" className="ml-2" />
          ) : invite.rsvpStatus === 'unanswered' ? (
            <StatusBanner label={invite.rsvpStatus} type="pending" className="ml-2" />
          ) : null}
        </div>
      </div>
      <Modal visible={showModal} toggle={toggleModal}>
        {InvitationForm}
      </Modal>
    </>
  );
};

export default memo(BidCard);
