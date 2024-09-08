import React, { useState, useRef, useEffect } from 'react';
import { AiOutlineCalendar } from 'react-icons/ai';
import { DayPicker } from 'react-day-picker';
import 'react-day-picker/dist/style.css';
import { displayError, displayInfo, displaySuccess } from 'Utils';
import { postForm } from '../../../../apis/postForm';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { updateField } from 'store/slices/bidslice';
import Loader, { LoaderX } from '../../../shared/Loader';
import { useNavigate, useLocation } from 'react-router-dom';
import { addDays } from 'date-fns';
import SuperModal from 'components/shared/SuperModal';
interface Prop {
  close: () => void;
  isEditing?: boolean;
}

const Modal = ({ close, isEditing }: Prop) => {
  let { pathname } = useLocation();
  const navigate = useNavigate();
  let bids = useAppSelector((m) => m.bid);
  const [calendar, setCalendar] = useState(false);
  const [date, setDate] = useState<string>(
    bids?.schedule?.start
      ? new Date(bids.schedule.start).toUTCString()
      : new Date(new Date().getTime() + 60 * 1000 * 3).toUTCString()
  );
  const [duration, setDuration] = useState<number>(
    bids?.schedule?.duration ? bids?.schedule?.duration : 0
  );
  const [fetching, setFetching] = useState(false);
  let dateref = useRef<any>();
  let dispatch = useAppDispatch();
  let months = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December'
  ];
  const setSchedule = async () => {
    if (!date) {
      displayError('Please set the start date of the bid');
    } else if (!duration || duration == 0) {
      displayError('Please set the duration of the bid');
    } else {
      setFetching(true);
      let end = addDays(new Date(date), duration).toDateString();
      let body = {
        start: date,
        end: end,
        duration: duration
      };
      let schedule = body;
      let { response, e } = await postForm('patch', `bids/${bids._id}`, {
        schedule
      });

      if (response) {
        displaySuccess('Bid Successfully scheduled');
        dispatch(updateField({ schedule }));
        if (isEditing) {
          close();
        } else {
          navigate(pathname + '/ongoing');
          close();
        }
      } else {
        if (e.status === 422) {
          displayInfo('Please select a time in the future for bid commencement');
        } else {
          displayError(e.message);
        }
      }

      setFetching(false);
    }
  };

  return (
    <SuperModal closer={close}>
      <div
        onClick={() => close()}
        className=" bg-black  p-4 lg:p-0 bg-opacity-70 w-screen absolute top-0 left-0 h-screen flex justify-center items-center"
      >
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" bg-white rounded-lg p-6 w-full lg:w-[532px] "
        >
          <div className="flex justify-between items-center">
            <p className=" text-bblue font-bold">Schedule Bid</p>
            <span
              onClick={() => close()}
              className="text-bash cursor-pointer hover:underline hover:text-borange"
            >
              Close
            </span>
          </div>

          <div className="w-full flex  my-9  justify-between">
            <div className="w-[49%] ">
              <p className=" text-sm text-ashShade-2 mb-2">Start date</p>
              <div className="relative">
                <input
                  ref={dateref}
                  onChange={(e: any) => setDate(e.value)}
                  className="w-full  py-0 px-4 border border-ashShade-2 rounded-lg"
                  type={'date'}
                />
                <button
                  onClick={() => {
                    setCalendar(true);
                  }}
                  className="absolute text-ashShade-2 bg-white top-0 flex justify-between left-0 z-10 w-full  py-3 px-4 border border-ashShade-2 rounded-lg"
                >
                  {calendar ? (
                    <div className="absolute bg-white">
                      <DayPicker
                        fromDate={new Date()}
                        mode="single"
                        selected={new Date(date)}
                        captionLayout="dropdown"
                        onDayClick={async (e: any) => {
                          await setDate((_: any) => {
                            if (new Date().toDateString() === new Date(e).toDateString()) {
                              return new Date(new Date().getTime() + 60 * 1000 * 10).toUTCString();
                            }
                            return new Date(e).toUTCString();
                          });
                          await setCalendar((_) => false);
                        }}
                        footer={'Please pick a starting date'}
                      />
                    </div>
                  ) : null}
                  <span>{`${new Date(date).getDate()} ${
                    months[new Date(date).getMonth()]
                  } ${new Date(date).getFullYear()}`}</span>
                  <AiOutlineCalendar size={24} color="#9099A8" />
                </button>
              </div>
            </div>
            <div className="w-[49%] ">
              <p className=" text-sm text-ashShade-2 mb-2">Duration (days)</p>
              <input
                className="w-full py-3 px-4 text-ashShade-2 border border-ashShade-2 rounded-lg"
                type={'number'}
                min={1}
                placeholder={'eg: 1'}
                value={duration.toString()}
                onChange={(e) => setDuration(parseInt(e.target.value))}
              />
            </div>
          </div>
          <button
            onClick={() => {
              setSchedule();
            }}
            className={`w-full flex justify-center items-center hover:bg-bblue hover:text-white font-semibold py-2 rounded-md bg-lightblue text-bblue`}
          >
            {fetching ? <LoaderX /> : isEditing ? 'Update Bid' : 'Start bid'}
          </button>
        </div>
      </div>
    </SuperModal>
  );
};

export default Modal;
