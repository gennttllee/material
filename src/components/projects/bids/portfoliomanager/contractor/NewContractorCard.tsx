import { useState } from 'react';
import { BsPatchCheckFill } from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';
import { postForm } from '../../../../../apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import Loader from '../../../../shared/Loader';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { addContractor, removeContractor } from '../../../../../store/slices/contractorSlice';
import {} from '../../../../../store/slices/profileSlice';
import { checkforSelection } from '../../../../shared/utils';
import useContractorDetails from 'Hooks/useContractorDetails';
import { updateField } from 'store/slices/bidslice';
import { TbBuildingSkyscraper } from 'react-icons/tb';
interface Prop {
  self: any;
  islist?: boolean;
  isSelected?: boolean;
}

const ContractorCard = ({ self, islist }: Prop) => {
  let dispatch = useAppDispatch();
  let selectedContractors: any = useAppSelector((s) => s.contractor);
  let bid = useAppSelector((m) => m.bid);
  const { image, details } = useContractorDetails(self.bidder, bid.type);
  const [fetching, setFetching] = useState(false);
  const [loaderror, setLoaderror] = useState(false);
  const updateBid = () => {
    let filtered = bid.invites.filter((m: any) => m.bidder != self.bidder);

    dispatch(updateField({ invites: filtered }));
  };
  const revokeInvite = async () => {
    setFetching(true);
    let { response, e } = await postForm('patch', `bids/${bid._id}/revokeInvite`, {
      bidder: self.bidder
    });
    if (response) {
      displaySuccess('Contractor removed sucessfully');
      updateBid();
    } else if (e) {
      displayError('Could not remove contractor');
    }
    setFetching(false);
  };
  const handleSelect = async () => {
    let checked = checkforSelection(selectedContractors, self._id);

    if (checked) {
      dispatch(removeContractor(self.id));
    } else {
      dispatch(addContractor(self));
    }
  };
  return (
    <div
      onClick={(e) => {
        if (islist) {
          handleSelect();
        }
      }}
      className={
        'w-full items-center cursor-pointer flex justify-between py-2 px-2 rounded-lg hover:bg-ashShade-0'
      }
    >
      <div className="flex items-center">
        <span className=" mr-2 rounded-full bg-ashShade-3">
          {image === '' || loaderror ? (
            <TbBuildingSkyscraper size={32} className="m-2" />
          ) : (
            <img
              loading="lazy"
              decoding="async"
              className="w-10 h-10 rounded-full object-cover"
              src={image}
              onError={() => setLoaderror(true)}
              alt="img"
            />
          )}
        </span>
        <div>
          <div className="flex items-center ">
            <span className="mr-2 font-semibold text-bblack-0">
              {details.name || details.firstName}
            </span>
            {self?.isVerified?.account && <BsPatchCheckFill color="green" size={14} />}
          </div>
          <div className=" text-bash text-sm">({details.email})</div>
        </div>
      </div>
      <div className="flex items-center">
        <span className=" bg-bgreen-1 px-2 mr-4 py-1 rounded-2xl text-bgreen-0">Invited</span>
        {fetching ? (
          <Loader color="blue" />
        ) : (
          <RiDeleteBinLine
            onClick={() => revokeInvite()}
            className="text-[#C8CDD4] hover:text-red-400"
            size={20}
          />
        )}
      </div>
    </div>
  );
};

export default ContractorCard;
