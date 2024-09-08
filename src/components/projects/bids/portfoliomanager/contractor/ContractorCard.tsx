import React, { useEffect, useState } from 'react';
import { BsFillPatchCheckFill, BsPatchCheckFill } from 'react-icons/bs';
import { RiDeleteBinLine } from 'react-icons/ri';
import { FaUserCircle } from 'react-icons/fa';
import { postForm } from '../../../../../apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import Loader from '../../../../shared/Loader';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { addContractor, removeContractor } from '../../../../../store/slices/contractorSlice';
import { toggle } from '../../../../../store/slices/profileSlice';
import { checkforSelection } from '../../../../shared/utils';
import useContractorDetails from 'Hooks/useContractorDetails';
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
  const [loaderror, setLoaderror] = useState(false);
  const { loading, image } = useContractorDetails(self._id, bid.type);
  const handleSelect = async () => {
    let checked = checkforSelection(selectedContractors, self._id);

    if (checked) {
      dispatch(removeContractor(self));
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
        'w-full items-center cursor-pointer flex justify-between py-2 px-3 rounded-lg hover:bg-ashShade-0' +
        ` ${islist && checkforSelection(selectedContractors, self._id) ? 'hidden' : ''}`
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
              className="w-10 h-10 rounded-full object-cover "
              src={image}
              onError={() => setLoaderror(true)}
              alt="img"
            />
          )}
        </span>
        <div>
          <div className="flex items-center ">
            <span className="mr-2 font-semibold text-bblack-0">
              {self?.name ? self.name : self?.firstName}
            </span>
            {self?.isVerified?.account && <BsPatchCheckFill color="green" size={14} />}
          </div>
          <div className=" text-bash text-sm">({self.email})</div>
        </div>
      </div>
      {checkforSelection(selectedContractors, self._id) ? (
        <RiDeleteBinLine
          onClick={() => handleSelect()}
          className="text-[#C8CDD4] hover:text-red-400"
          size={20}
        />
      ) : null}
    </div>
  );
};

export default ContractorCard;
