import { postForm } from 'apis/postForm';
import axios from 'axios';
import React, { useState } from 'react';
import { InlineWidget, useCalendlyEventListener } from 'react-calendly';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import { useAppSelector } from 'store/hooks';
import CustomModal from '../CustomModal';
import { centered, hoverFade } from 'constants/globalStyles';
import { IoClose } from 'react-icons/io5';

const Calendly = ({
  placeholder,
  projectId,
  callBack
}: {
  placeholder: React.ReactNode;
  callBack: (vl: any) => void;
  projectId?: string;
}) => {
  const [showModal, setShowModal] = useState(false);
  const user = useAppSelector((s) => s.user);

  const toggleModal = () => setShowModal((prev) => !prev);
  const makecall = async (uri: string, url: string, startTime: string, number: number) => {
    let { response, e } = await postForm('patch', `projects/briefs/${projectId}`, {
      scheduledCall: {
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        startTime: startTime,
        joiningInfo: {
          eventUri: uri,
          eventUrl: url
        }
      }
    });

    if (response) {
      displaySuccess('Event Scheduled Successfully. Now redirecting to your dashboard');
      toggleModal();
      callBack(response.data);
    } else {
      if (number >= 2) {
        displayError('Error scheduling call');
      } else {
        makecall(uri, url, startTime, number + 1);
        displayError('Error scheduling call, Trying again');
      }
    }
  };
  useCalendlyEventListener({
    onEventScheduled: async (e) => {
      displaySuccess('Please wait while we register your event');
      axios
        .get(e.data.payload.event.uri, {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_CALENDLYTOKEN}`
          }
        })
        .then(async (res) => {
          try {
            await makecall(
              e?.data?.payload?.event?.uri,
              res?.data?.resource?.location?.join_url,
              res.data.resource.start_time,
              1
            );
          } catch (error) {
            displayError(String(error));
          }
        })
        .catch((e) => {
          displayWarning("couldn't get event details");
        });
    }
  });
  return (
    <>
      <div onClick={toggleModal}>{placeholder}</div>
      <CustomModal
        visible={showModal}
        toggle={toggleModal}
        className="!drop-shadow-none"
        containerClassName="w-fit md:w-full !h-fit !p-0 !bg-transparent !shadow-none"
      >
        <>
          <div className={centered + 'w-full mb-3'}>
            <button
              onClick={toggleModal}
              className={'text-bash rounded-full w-fit border  p-2' + hoverFade}
            >
              <IoClose className="text-2xl" />
            </button>
          </div>
          <InlineWidget
            url="https://calendly.com/buildwithbnkle/projectbrief"
            prefill={{
              email: user?.email,
              lastName: user?.lastName,
              firstName: user?.firstName,
              name: `${user?.firstName} ${user?.lastName}`
            }}
          />
        </>
      </CustomModal>
    </>
  );
};

export default Calendly;
