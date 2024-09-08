import React, { memo, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp, FiCircle } from 'react-icons/fi';
import { TbChevronLeft, TbChevronRight, TbLockOpenOff } from 'react-icons/tb';
import { centered, flexer, hoverFade } from '../../../../../constants/globalStyles';
import { HiCheckCircle } from 'react-icons/hi';
import Button from '../../../../shared/Button';
import DocumentCard from '../components/Documents';
import { displayError, displaySuccess } from 'Utils';
import useFetch from '../../../../../Hooks/useFetch';
import { useAppSelector } from '../../../../../store/hooks';
import bigWinnerIcon from '../../../../../assets/bidWinner.svg';
import { GetUploadSignedUrls } from '../../../../../apis/AwsFiles';
import { ProfessionalBid, ProfessionalBrief, SubmittedBid } from '../../../../../types';
import {
  getSubmitDocsApi,
  submitAdditionalDocsApi,
  submitDocsApi,
  updateBid,
  updateBidInvite
} from '../../../../../apis/projectBrief';
import puzzleImg from '../../../../../assets/puzzle-inbox-message.svg';
import { generateId } from '../../../../../Utils';
import StatusBanner from '../components/StatusBanner';
import Moment from 'react-moment';
import 'moment-timezone';
import { useNavigate } from 'react-router-dom';
import Modal from '../../../../shared/Modal';
import { StoreContext } from '../../../../../context';
import { useParams } from 'react-router-dom';
import StatusLabel from '../../../../shared/StatusLabel';
import { createPow } from '../../../../../apis/pow';
import { POW } from 'components/projects/management/types';
import { uploadToAws } from 'helpers/uploader';

const MainBid = () => {
  const navigate = useNavigate();
  const { id: bid_id, projectId } = useParams();
  const [mainBid, setMainBid] = useState<ProfessionalBid | null>();
  const { _id: professionalId } = useAppSelector((state) => state.user);
  const { setContext, selectedData, menuProjects, handleContext, selectedProjectIndex } =
    useContext(StoreContext);
  const [winningBid, setWinningBid] = useState<ProfessionalBid['winningBid'][number]>();
  const [submittedBid, setSubmittedBid] = useState<ProfessionalBid['submittedBid']>();
  const [mainBidProgress, setMainBidProgress] = useState({
    percentage: 0,
    diff: 0
  });
  const [showModal, setModal] = useState(false);
  const [showTrack, setTrack] = useState(false);
  const [showDocs, setShowDocs] = useState(false);
  const [showAdditionalDocs, setAdditionDocs] = useState(true);
  const [isAddDocsValid, setAddDocsValidation] = useState(false);
  const [isMainDocsValid, setMainDocsValidation] = useState(false);
  const [responseDocs, setDocs] = useState<{ [key: string]: any }>({});
  //
  const { load, isLoading } = useFetch();
  const { isLoading: isCreateLoading, load: createLoad } = useFetch<POW>();
  const { load: docsLoader, isLoading: isDocsLoading } = useFetch();
  const { setLoader: setUploading, isLoading: isUploading } = useFetch();
  const { load: addDocsLoader, isLoading: isAddDocsLoading } = useFetch();
  const { load: declineLoader, isLoading: isDeclineLoading } = useFetch();
  const { load: submitLoader, isLoading: isSubmitLoading } = useFetch({
    showDisplayError: false,
    initialLoading: true
  });
  /** Others */
  const today = useMemo(() => new Date().getTime(), []);
  const start = useMemo(() => new Date(mainBid?.schedule?.start || '').getTime(), [mainBid]);
  const end = useMemo(() => new Date(mainBid?.schedule?.end || '').getTime(), [mainBid]);
  const hasBidEnded = today > end;

  const documentSchema = useCallback(
    (isAdditional?: boolean | undefined) => {
      if (!mainBid) return [];

      const payload = mainBid.bidDocuments;
      const required: string[] = [];

      for (let i = 0; i < payload.length; i++) {
        if (payload[i].requiresResponse && payload[i].meta?.isAdditional === isAdditional)
          required.push(payload[i].name);
      }

      return required;
    },
    [mainBid]
  );
  //
  useEffect(() => {
    // get all submissions on a bid
    if (submittedBid === undefined && mainBid) {
      submitLoader(getSubmitDocsApi(mainBid._id))
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
              const WB = mainBid.winningBid.find((one) => one.id === exists._id);
              setWinningBid(WB);
              if (!WB) setShowDocs(true);
            }
          }
        })
        .catch(() => {
          //
          setSubmittedBid(null);
        });
    } else if (submittedBid && !winningBid && mainBid) {
      const WB = mainBid.winningBid.find((one) => one.id === submittedBid._id);
      setWinningBid(WB);
      if (WB) setShowDocs(true);
    }
  }, [mainBid, professionalId, winningBid, submitLoader, submittedBid]);

  useEffect(() => {
    let mainId: any, additionalId: any;

    if (showDocs) {
      mainId = window.setInterval(() => {
        let isComplete = true;
        const mainSchema = documentSchema();
        const values = responseDocs;
        /** Main documents check */
        for (const key of mainSchema) {
          if (!values[key]) {
            isComplete = false;
            break;
          }
        }
        //
        setMainDocsValidation((prev) => (prev !== isComplete ? !prev : prev));
        /** Additional Documents Check */
      }, 250);
    }

    if (showAdditionalDocs) {
      additionalId = window.setInterval(() => {
        let isComplete = true;
        const additionalSchema = documentSchema(true);
        const values = responseDocs;
        /** Additional documents check */
        for (const key of additionalSchema) {
          if (!values[key]) {
            isComplete = false;
            break;
          }
        }
        //
        setAddDocsValidation((prev) => (prev !== isComplete ? !prev : prev));
        /** Additional Documents Check */
      }, 250);
    }

    return () => {
      clearInterval(mainId);
      clearInterval(additionalId);
    };
  }, [responseDocs, showDocs, documentSchema, showAdditionalDocs]);

  useEffect(() => {
    if (mainBid && mainBid.schedule) {
      // check the time line
      // const hasStarted = today >= start;

      const diff = hasBidEnded ? 0 : end - today;

      const dayDiff = diff / (1000 * 60 * 60 * 24);

      /** check if expired */
      const hasExpired = end < today;

      const totalDiff = end - start;
      const totalDaysDiff = totalDiff / (1000 * 60 * 60 * 24);
      const percentage = 100 - (dayDiff * 100) / totalDaysDiff;

      setMainBidProgress({
        percentage,
        diff: hasExpired ? 0 : +dayDiff.toFixed(0)
      });
    }
  }, [mainBid, start, end, hasBidEnded, today, professionalId]);

  const goBack = () => {
    navigate(-1);
  };

  useEffect(() => {
    if (selectedData) {
      const exists = selectedData.literalBids.find((one) => one._id === bid_id);
      /**
       * find and the bid in by the provided id
       * and preview it, else rediect back to all bids
       */
      if (exists) setMainBid(exists);
      else {
        // goBack();
        /** Search for a project a bid id belong's too */
        const project = menuProjects.find((one, index) => {
          /** search for the bid in the params */
          const paramBid = one.literalBids.find((bid) => bid._id === bid_id);
          // if the bid id was found, set its project in the menu
          if (paramBid) {
            handleContext('selectedProjectIndex', index);
            return true;
          } else {
            return false;
          }
        });

        if (!project) {
          // goBack();
          setMainBid(null);
        }
      }
    }
  }, [selectedData, mainBid, menuProjects, handleContext, bid_id]);

  if (mainBid === undefined) return <></>; // still fetching projects

  if (mainBid === null) {
    // if the bid was not found
    return (
      <>
        <div className={'flex items-center' + hoverFade} onClick={goBack}>
          <TbChevronLeft className="text-slate-700 font-Medium text-base" />
          <p className="text-slate-700 font-Medium text-base">Back to Bids</p>
        </div>
        <div className={centered + ' h-full w-full flex flex-col'}>
          <img src={puzzleImg} loading="lazy" decoding="async" alt="" />
          <h1 className="font-Medium text-2xl">Bid Not Found</h1>
          <p className="text-bash text-base max-w-md my-2 text-center">
            Please check the link&apos;s spelling, if the spelling is fine, this bid might have been
            deleted
          </p>
        </div>
      </>
    );
  }

  const handleDocsChange = (key: string, val: any) => {
    setDocs((prev) => ({ ...prev, [key]: val }));
  };

  const handleAdditionalDocsSubmission = async () => {
    if (hasBidEnded) {
      displayError('Not allowed to submit, after the deadline has passed');
      return null;
    }

    if (!submittedBid) return null;

    const payload = {
      bid: mainBid?._id || '',
      docs: [
        ...submittedBid.docs.map((doc) => {
          const response: any = doc;
          // remove _id
          delete response._id;
          return response;
        })
      ]
    };

    let hasAnError = false;
    setUploading(true);

    for (const [key, value] of Object.entries(responseDocs)) {
      /** check if is additional document */
      const exists = additionalDocs?.find((one) => one.name === key);
      // if skip it
      if (!exists) continue;
      //

      const imageKey = await uploadToAws({ value, setUploading });
      if (!imageKey) {
        // if value key is null
        hasAnError = true;
        break;
      }
      /** find the  document, to whom we are replying to*/
      const parent = mainBid?.bidDocuments.find((one) => one.name === key);

      if (!parent) {
        // if value key is null
        hasAnError = true;
        break;
      }

      payload.docs.push({
        key: imageKey,
        name: parent.name,
        meta: {
          name: value.name,
          size: value.size,
          type: value.type,
          isAdditional: true
        },
        parentDoc: parent?._id
      });
    }

    setUploading(false);

    if (hasAnError) return null;

    if (mainBid)
      addDocsLoader(submitAdditionalDocsApi(submittedBid._id, { docs: payload.docs })).then(
        (res) => {
          const newSubmission: SubmittedBid<string> = {
            ...submittedBid,
            docs: [
              ...submittedBid.docs,
              ...payload.docs.filter((one: any) => {
                if (one.meta.isAdditional) return { ...one, _id: generateId() };
                else return false;
              })
            ]
          };

          setSubmittedBid(newSubmission);
        }
      );
  };

  const handleDocsSubmit = async () => {
    if (hasBidEnded) {
      displayError('Not allowd to submit, after the deadline has passed');
      return null;
    }
    const payload: SubmittedBid<undefined> = {
      bidder: undefined,
      bid: mainBid._id,
      __v: undefined,
      _id: undefined,
      docs: []
    };

    let hasAnError = false;
    setUploading(true);

    for (const [key, value] of Object.entries(responseDocs)) {
      /** check if is additional document */
      const exists = mainDocs.find((one) => one.name === key);
      // if exists skip it
      if (!exists) continue;

      const imageKey = await uploadToAws({ value, setUploading });
      if (!imageKey) {
        // if value key is null
        hasAnError = true;
        break;
      }
      /** find the  document*/
      const parent = mainBid?.bidDocuments.find((one) => one.name === key);

      if (!parent) {
        // if value key is null
        hasAnError = true;
        break;
      }

      payload.docs.push({
        _id: undefined,
        key: imageKey,
        name: parent.name,
        meta: {
          name: value.name,
          size: value.size,
          type: value.type,
          isAdditional: false
        },
        parentDoc: parent?._id
      });
    }

    setUploading(false);

    if (hasAnError) return null;

    if (mainBid)
      docsLoader(submitDocsApi(payload)).then((res) => {
        const newSubmission: SubmittedBid<string> = {
          ...(payload as any),
          _id: generateId()
        };

        setSubmittedBid(newSubmission);
      });
  };

  const handleAllBids = (bid: ProfessionalBrief['literalBids'][number]) => {
    // 1. add the pow reference on the bid #localy
    setContext((prev) => {
      const data = prev.menuProjects[selectedProjectIndex];
      const bids = data.literalBids.map((one) => {
        if (one._id !== bid._id) return one;
        return bid;
      });
      const newProjects = prev.menuProjects.map((project) => {
        if (project._id === data._id) {
          return { ...project, literalBids: bids };
        } else {
          return project;
        }
      });

      return {
        ...prev,
        menuProjects: newProjects
      };
    });
  };

  const handleBidWinnerStatus = (status?: boolean) => {
    if (!winningBid) return null;

    const payload = {
      status: status ? 'accepted' : 'declined'
    };

    (() => {
      if (status) {
        return load(updateBidInvite(mainBid._id, winningBid._id, payload));
      } else {
        return declineLoader(updateBidInvite(mainBid._id, winningBid._id, payload));
      }
    })().then((res) => {
      handleAllBids({ ...mainBid, ...payload });
      setWinningBid((prev: any) => ({
        ...prev,
        status: status ? 'accepted' : 'declined'
      }));
    });
  };
  /** IF there's no invite select Nothing can show-up */
  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const toggleTrack = () => {
    setTrack((prev) => !prev);
  };

  const Checks = [
    {
      label: 'Submit Bid documents',
      isComplete: submittedBid ? true : false
    },
    {
      label: 'Bid result',
      isComplete: mainBid && mainBid.winningBid[0]
    },
    {
      label: 'Submit contract documents',
      isComplete:
        submittedBid &&
        (() => {
          /** check if a there's an additional doc in the submitted bid's docs */
          return submittedBid.docs.find((one) => one.meta.isAdditional);
        })()
    }
  ] as const;

  const ProgressTrack = (
    <div className="bg-white p-6 rounded-md w-11/12 md:w-full">
      <div className={flexer + 'mb-5'}>
        <strong className="text-xl font-Medium">Track progress</strong>
        <button onClick={toggleTrack} className={'text-sm text-borange font-Medium' + hoverFade}>
          Close
        </button>
      </div>
      <div className="relative">
        <div className="absolute h-95 left-2.5 border-r-2 border-dashed border-ashShade-3 z-10" />
        {React.Children.toArray(
          Checks.map((one, index) => (
            <div className="flex items-center mb-10 relative z-10">
              <div className="bg-white">
                {one.isComplete ? (
                  <HiCheckCircle className="text-bblue text-2xl" />
                ) : (
                  <FiCircle className="text-bblue text-xl relative left-0.5" />
                )}
              </div>
              <div className="flex items-center">
                <p className={`${one.isComplete ? 'text-bblue' : 'text-bash'} text-medium ml-3 `}>
                  {one.label}
                </p>
                {index === 1 && (
                  <div className="ml-4">
                    {!mainBid || !submittedBid || !mainBid.winningBid[0] ? null : !winningBid ? (
                      <StatusBanner label="Bid Denied" type="decline" />
                    ) : submittedBid._id === winningBid.id && winningBid.status !== 'declined' ? (
                      <StatusBanner label="Bid Completed" type="done" />
                    ) : (
                      <StatusBanner label="Bid Declined" type="decline" />
                    )}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );

  const Progress = (
    <div className="bg-white p-6 rounded-md">
      <strong className="text-xl font-normal">Ongoing bid</strong>
      <div className="mt-6">
        {mainBidProgress.percentage ? (
          <div className={flexer}>
            <label>
              {mainBidProgress.percentage === 100 ? (
                'Completed'
              ) : mainBidProgress.diff ? (
                `${mainBidProgress.diff} Days left`
              ) : (
                <>
                  <span className="mr-1">Ends</span>
                  <Moment fromNow>{new Date(mainBid.schedule?.end || '')}</Moment>
                </>
              )}
            </label>
            <button className="text-bash text-sm">Request bid extention</button>
          </div>
        ) : (
          <div className="flex items-center">
            <TbLockOpenOff className="mr-1" />
            <p className="text-sm text-ashShade-2">Not Started</p>
          </div>
        )}
        <div className="mt-1 bg-ashShade-3 rounded-3xl h-2 overflow-hidden">
          <div
            className={` ${
              mainBidProgress.percentage === 100 ? 'bg-green-700' : 'bg-bblue'
            } h-full rounded-3xl`}
            style={{ width: `${mainBidProgress.percentage}%` }}
          />
        </div>
      </div>
    </div>
  );

  const additionalDocs = mainBid && mainBid.bidDocuments.filter((one) => one.meta?.isAdditional);

  const submittedAdditionalDocs = submittedBid?.docs.find((one) => one.meta.isAdditional);

  const mainDocs = mainBid && mainBid.bidDocuments.filter((one) => !one.meta?.isAdditional);

  const Documents = (
    <div className="bg-white w-full p-6 rounded-md mt-5">
      <div className={flexer}>
        <strong className="text-xl font-normal">Bid documents</strong>
        {mainDocs[0] && (
          <div
            className="cursor-pointer"
            onClick={() => {
              if (showAdditionalDocs) setAdditionDocs((prev) => !prev);
              setShowDocs((prev) => !prev);
            }}>
            {!showDocs ? <FiChevronDown /> : <FiChevronUp />}
          </div>
        )}
      </div>
      <div
        className={`${
          !showDocs ? 'zero-height  overflow-hidden' : 'auto-height  overflow-y-scroll'
        }`}>
        {React.Children.toArray(
          mainDocs[0] &&
            mainDocs.map((one, index) => (
              <DocumentCard
                disabled={hasBidEnded}
                {...{ one, index, submittedBid, isUploading }}
                value={responseDocs[one.name]}
                onChange={handleDocsChange}
                hideUploadBtn={submittedBid ? true : false}
              />
            ))
        )}
        {documentSchema()[0] && !submittedBid && (
          <Button
            className={`w-full mt-7 ${hasBidEnded && 'hidden'}`}
            type={isMainDocsValid ? 'primary' : 'muted'}
            isLoading={isDocsLoading || isUploading}
            onClick={handleDocsSubmit}
            text="Submit"
          />
        )}
      </div>
    </div>
  );

  const additionalDocuments = (
    <div className="bg-white w-full p-6 rounded-md mt-5">
      <div className={flexer}>
        <strong className="text-xl font-normal">Contract Documents</strong>
        {additionalDocs && additionalDocs[0] ? (
          <div
            className="cursor-pointer"
            onClick={() => {
              if (showDocs) setShowDocs((prev) => !prev);
              setAdditionDocs((prev) => !prev);
            }}>
            {!showAdditionalDocs ? <FiChevronDown /> : <FiChevronUp />}
          </div>
        ) : null}
      </div>
      <div className={`${!showAdditionalDocs ? 'zero-height' : 'auto-height'} overflow-hidden`}>
        {React.Children.toArray(
          additionalDocs &&
            additionalDocs.map((one, index) => (
              <DocumentCard
                disabled={hasBidEnded && !winningBid}
                onChange={handleDocsChange}
                value={responseDocs[one.name]}
                {...{ one, index, submittedBid, isUploading }}
                hideUploadBtn={submittedAdditionalDocs ? true : false}
              />
            ))
        )}
        {documentSchema(true)[0] && !submittedAdditionalDocs ? (
          <Button
            className={`w-full mt-7 ${hasBidEnded && !winningBid ? 'hidden' : ''}`}
            onClick={() => handleAdditionalDocsSubmission()}
            text={isUploading ? 'Uploading...' : 'Submit'}
            type={isAddDocsValid ? 'primary' : 'muted'}
            isLoading={isAddDocsLoading}
          />
        ) : null}
      </div>
    </div>
  );

  const handlePOWs = () => {
    const payload = {
      name: mainBid.name,
      bidId: mainBid._id,
      projectId: mainBid.projectId._id
    };
    // 1. create the pow
    createLoad(createPow(payload))
      .then((powRes) => {
        // update a bid
        handleAllBids({ ...mainBid, pow: powRes.data._id });
        return powRes;
      })
      .then((powRes) => {
        navigate(`/projects/${projectId}/management/${powRes.data._id}`);
        window.location.reload();
      });
  };

  const NotificationLabels = (
    <>
      {!submittedBid /** if there's not submissions don't show anything */ ? null : !mainBid
          .winningBid[0] ? ( // if no bid winner has been picked yet, show this!
        <StatusLabel
          type="pending"
          title="Awaiting decision"
          description="Your bid application is being evaluated. You will get an update soon"
        />
      ) : winningBid && winningBid.status === 'unanswered' ? (
        <StatusLabel
          type="done"
          title="Congrats!!"
          description="You won the bid. Do you agree to continue your application?"
          ExtraContext={
            <div className="flex w-full md:w-auto  md:items-center ">
              <Button
                text="Decline"
                type="secondary"
                isLoading={isDeclineLoading}
                className="text-black border-black m-0"
                onClick={() => handleBidWinnerStatus(false)}
              />
              <Button
                text="Accept"
                isLoading={isLoading}
                className="ml-2 text-base m-0"
                onClick={() => handleBidWinnerStatus(true)}
              />
            </div>
          }
        />
      ) : !winningBid ? (
        <StatusLabel
          type="decline"
          title="Bid denied"
          description="Your application was not successfull"
        />
      ) : null}
      {!submittedBid ||
      !winningBid ||
      winningBid.status === 'unanswered' ? null : submittedBid._id === winningBid.id &&
        winningBid.status === 'accepted' ? (
        <StatusLabel
          type={'primary'}
          title="UP NEXT"
          description="Upload Contract Documents"
          ExtraContext={
            <Button
              className="m-0"
              onClick={handlePOWs}
              isLoading={isCreateLoading}
              text="Create program of works"
              type={mainBid.pow ? 'muted' : 'primary'}
            />
          }
        />
      ) : (
        <StatusLabel
          type="decline"
          title="Bid denied"
          description="Your application was not successfull"
        />
      )}
    </>
  );

  const BidWinnerModal = (
    <div className={'bg-white relative z-10  w-11/12 md:w-1/2 rounded-lg p-6 flex-col' + centered}>
      <header className={flexer + 'w-full'}>
        <strong className="text-base font-Medium">Notifactions</strong>
        <button onClick={toggleModal} className={'text-sm text-borange font-Medium' + hoverFade}>
          Close
        </button>
      </header>
      <img
        loading="lazy"
        decoding="async"
        src={bigWinnerIcon}
        className="w-44 object-contain my-8"
        alt=""
      />
      <h4 className="font-Medium text-2xl mb-2">Bid Winner</h4>
      <p className="text-bash text-center w-4/5">
        By engaging with the contractor, you affirm that you have thoroughly reviewed the terms and
        conditions and are committed to complying with them.
      </p>
      <div className="flex items-center mt-8">
        <Button text="Decline" type="secondary" className="text-black border-black m-0" />
        <Button text="Accept" className="ml-8 text-base m-0" />
      </div>
    </div>
  );

  const Header = (
    <>
      <div className={flexer + 'relative md:fixed top-3 md:top-10'}>
        <div className={'flex md:hidden items-center' + hoverFade} onClick={goBack}>
          <TbChevronLeft className="text-bash" />
          <p className="text-bash">Back</p>
        </div>
        <div className="hidden md:flex items-center">
          <div className="flex items-center cursor-pointer hover:opacity-80" onClick={goBack}>
            <p className="text-borange text-sm">Bid</p>
            <TbChevronRight className="text-borange" />
          </div>
          <p className="text-bash text-sm">{mainBid.name} Bid</p>
        </div>
      </div>
      <header className={flexer + 'mb-3 mt-5 md:mt-0 '}>
        <h5 className="font-semibold text-2xl text-black">{mainBid.name}</h5>
        <button onClick={toggleTrack} className={'text-sm text-[#2B48EA] font-Medium' + hoverFade}>
          Track progess
        </button>
      </header>
      <Modal visible={showModal} toggle={toggleModal}>
        {BidWinnerModal}
      </Modal>
    </>
  );

  return (
    <div className="w-full h-full pb-10">
      {Header}
      {isSubmitLoading ? (
        <p className="bg-pbg p-3 rounded-md text-ashShade-7 font-Medium animate-pulse">
          Fetching Submissions ...
        </p>
      ) : (
        NotificationLabels
      )}
      <div className={flexer + 'h-full mt-3'}>
        <section className="w-full md:w-49 h-full ">
          {Progress}
          {Documents}
          {submittedBid && winningBid && submittedBid._id === winningBid.id
            ? additionalDocuments
            : null}
        </section>
        <section
          className={`w-full md:w-49 h-full ${
            !showTrack && 'hidden'
          } md:relative fixed md:bg-transparent bg-boverlay top-0 left-0 md:items-start items-center flex justify-center`}>
          {ProgressTrack}
        </section>
      </div>
    </div>
  );
};

export default memo(MainBid);
