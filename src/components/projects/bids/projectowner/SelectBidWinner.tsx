import React, { useEffect, useState } from 'react';
import SuccessModal from './SuccessModal';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import { useNavigate } from 'react-router-dom';
import { differenceInDays, isWithinInterval, subBusinessDays } from 'date-fns';
import { postForm } from '../../../../apis/postForm';
import { displayError, displayInfo, displaySuccess } from 'Utils';
import BidDocument from './BidDocument';
import Loader from 'components/shared/Loader';
import { updateField } from 'store/slices/bidslice';
import SuperModal from 'components/shared/SuperModal';
interface BidWinnner {
  closer: any;
  selected?: string;
  setter?: any;
}

const SelectBidWinner = ({ closer }: BidWinnner) => {
  const [fetching, setFetching] = useState(false);
  const [success, setSuccess] = useState(false);
  let bid = useAppSelector((m) => m.bid);
  const [selected, setSelected] = useState<any>({});

  return (
    <SuperModal
      closer={closer}
      classes="  overflow-scroll no-scrollbar flex justify-center pt-20 bg-black bg-opacity-80">
      <span onClick={(e) => e.stopPropagation()} className=" self-start">
        {!success ? (
          <div className=" bg-bidsbg flex flex-col   rounded-xl p-4 ">
            <div className="flex mb-8 justify-between items-center  ">
              <span>Select Bid Winner</span>{' '}
              <span
                onClick={() => closer(false)}
                className=" hover:underline cursor-pointer text-borange-0">
                Close
              </span>
            </div>
            <div className="w-full grid grid-cols-1 lg:grid-cols-3   px-2 gap-3 justify-evenly">
              {bid && bid.invites
                ? bid.invites.map((e: any, i: number) => (
                    <BidDocument
                      key={i}
                      isModal
                      invite={e}
                      setter={setSelected}
                      selected={selected}
                    />
                  ))
                : null}
            </div>

            <p className="w-2/3  my-6 self-center text-ashShade-1 text-center">
              By engaging with the contractor, you affirm that you have thoroughly reviewed the
              terms and conditions and are committed to complying with them.
            </p>
            {!success ? (
              <div className="flex items-center justify-center">
                <button
                  onClick={() => closer(false)}
                  className="py-2 px-4 bg-red-600 rounded-lg mr-4 text-white hover:text-red-600 hover:bg-transparent hover:border hover:border-red-600 ">
                  Cancel
                </button>
                <button
                  onClick={() => {
                    if (bid?.submittedBids.length < 1) {
                      displayInfo('No contractor has submitted a bid');
                    } else if (selected?._id) {
                      setSuccess(true);
                    }
                  }}
                  className={` ${
                    bid?.submittedBids.length < 1 ? 'bg-transparent' : 'bg-bblue'
                  } py-2 px-6 rounded-lg font-Medium text-white text-base`}>
                  {fetching ? <Loader /> : 'Select bid winner'}
                </button>
              </div>
            ) : null}
          </div>
        ) : (
          <SuccessModal bidDetails={selected} closer={closer} />
        )}
      </span>
    </SuperModal>
  );
};
export default SelectBidWinner;
