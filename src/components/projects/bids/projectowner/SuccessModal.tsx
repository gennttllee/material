import { useState } from 'react';
import { postForm } from 'apis/postForm';
import { displayError, displayInfo, displaySuccess, displayWarning } from 'Utils';
import useContractorDetails from 'Hooks/useContractorDetails';
import Loader, { LoaderX } from 'components/shared/Loader';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { updateField } from 'store/slices/bidslice';
import { TbBuildingSkyscraper } from 'react-icons/tb';
interface Prop {
  bidDetails: any;
  closer: any;
}
const SuccessModal = ({ bidDetails, closer }: Prop) => {
  let bid = useAppSelector((m) => m.bid);
  const [fetching, setFetching] = useState(false);
  let { image, details } = useContractorDetails(bidDetails.bidder, bid.type);
  const [error, setError] = useState(false);
  let dispatch = useAppDispatch();
  let name = details.name || details.firstname;
  const removeIds = (winners: any[]) => {
    let wins: any[] = [];
    for (let i = 0; i < winners.length; i++) {
      let win = { ...winners[i] };
      delete win['_id'];
      wins.push(win);
    }
    return wins;
  };
  const selectBidWinner = async () => {
    setFetching(true);
    if (bidDetails && bidDetails?._id !== '') {
      let winningBid = bid?.winningBid || [];
     
      if (winningBid.length > 0) {
        winningBid = [...removeIds(winningBid)];
      }

      winningBid = [...winningBid, { id: bidDetails._id }];

      let { response, e } = await postForm('patch', `bids/${bid._id}/`, {
        winningBid
      });
      if (response && response.status < 300) {
        displaySuccess('bid winner selected');
        dispatch(
          updateField({
            winningBid
          })
        );
        closer(false);
      } else {
        displayInfo('Bid winner has already been selected');
      }
    } else {
      displayWarning('Please select a contractor that has submitted a bid');
    }
    setFetching(false);
  };
  return (
    <div className="w-full  bg-white flex flex-col h-fit justify-center  rounded-xl py-7 px-6 ">
      <div className="w-full mb-12 flex text-sm justify-between items-center">
        <span className="font-semibold  text-bblack-1">Confirm Bid Winner</span>
        <span
          onClick={() => closer(false)}
          className="text-bash self-end hover:underline cursor-pointer  font-semibold">
          Close
        </span>
      </div>
      <div className=" w-fit h-fit self-center bg-ashShade-0 p-14 mb-8">
        {image === '' || error ? (
          <TbBuildingSkyscraper size={160} />
        ) : (
          <img
            loading="lazy"
            onError={() => setError(true)}
            decoding="async"
            className=" w-40 h-40 "
            src={image}
            alt="img"
          />
        )}
      </div>

      <div className="mb-14 self-center">
        <p className="text-center text-bblack-1 text-xl font-semibold">Success</p>
        <p className="w-full mt-2  text-ashShade-1 text-center ">
          {`You have selected ${name ? name : 'a contractor'} as the winner of the bid.`}
        </p>
      </div>

      <div className="flex items-center justify-center">
        <span
          onClick={() => closer(false)}
          className="py-2 px-4 cursor-pointer   rounded-lg mr-4  border  border-red-600 text-red-600 hover:bg-red-600 hover:text-white">
          Cancel
        </span>
        <button
          onClick={() => selectBidWinner()}
          className="bg-bblue py-2 px-8 rounded-lg font-Medium border border-bblue  text-white text-base">
          {fetching ? <LoaderX /> : 'Proceed'}
        </button>
      </div>
    </div>
  );
};

export default SuccessModal;
