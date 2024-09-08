import React, { useEffect, useState } from 'react';
import { BsFillPatchCheckFill } from 'react-icons/bs';
import useContractorDetails from '../../../Hooks/useContractorDetails';
import { useAppDispatch, useAppSelector } from '../../../store/hooks';
import { display } from '../../../store/slices/contractorProfileSlice';
import { TbBuildingSkyscraper } from 'react-icons/tb';
import { IoEllipsisVertical } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import Loader from 'components/shared/Loader';
import { updateField } from 'store/slices/bidslice';
import { postFormWithAbortController } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
interface Prop {
  consultantId: string;
  type: string;
}
let controller = new AbortController();
const ContractorCard = ({ consultantId, type }: Prop) => {
  const [options, setOptions] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [error, setError] = useState(false);
  let bid = useAppSelector((m) => m.bid);
  let user = useAppSelector((m) => m.user);
  let dispatch = useAppDispatch();
  let { image, details, loading } = useContractorDetails(consultantId, type);
  const updateBid = () => {
    let filtered = bid.invites.filter((m: any) => m.bidder != consultantId);
    dispatch(updateField({ invites: filtered }));
  };
  const revokeInvite = async () => {
    setFetching(true);
    let { response, e } = await postFormWithAbortController(
      'patch',
      `bids/${bid._id}/revokeInvite`,
      {
        bidder: consultantId
      }
    );
    if (response) {
      displaySuccess('Contractor removed sucessfully');
      setOptions(false);
      updateBid();
    } else if (e) {
      displayError('Could not remove contractor');
    }
    setFetching(false);
  };
  return (
    <div
      onClick={() => setOptions(false)}
      className=" mb-4 p-5 w-full mr-4 cursor-pointer  lg:p-10  bg-white rounded-md flex flex-col justify-center items-center  relative"
    >
      {user.role === 'portfolioManager' && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setOptions(!options);
          }}
          className={` self-end  ${'hover:bg-ashShade-0 p-1 hover'} rounded-full`}
        >
          <IoEllipsisVertical size={16} color={'#9099A8'} />
        </span>
      )}
      {options ? (
        <span
          onBlur={() => setOptions(!options)}
          className="absolute p-2 rounded-lg w-36 top-10 right-0 shadow-lg bg-white z-30"
        >
          <span
            onClick={async (e) => {
              e.stopPropagation();
              await revokeInvite();
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

      <div
        onClick={() => dispatch(display({ type: type, profId: consultantId }))}
        className="p-10 rounded-full bg-ashShade-0"
      >
        {image === '' || error ? (
          <TbBuildingSkyscraper size={64} />
        ) : (
          <img
            loading="lazy"
            decoding="async"
            onError={() => {
              setError(true);
            }}
            className="w-16  h-16"
            src={image}
            alt="img"
          />
        )}
      </div>
      <div className="flex mt-2 justify-center items-center rounded-full">
        <span className="mr-2 ">{details?.name || details?.firstName}</span>
        {details?.isVerified?.account && <BsFillPatchCheckFill color={'green'} size={14} />}
      </div>
    </div>
  );
};

export default ContractorCard;
