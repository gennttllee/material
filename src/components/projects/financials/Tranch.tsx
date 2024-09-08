import { toDecimalPlaceWithCommas } from 'components/shared/utils';
import React, { useContext } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { TranchProps } from './types';
import { useState } from 'react';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { postForm } from 'apis/postForm';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import { updateField, openModal } from 'store/slices/financeSlice';
import Loader, { LoaderX } from 'components/shared/Loader';
import { StoreContext } from 'context';
const Tranch = ({ amount, dueDate, _id, isConfirmed }: TranchProps) => {
  const [openOptions, setOpenOptions] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const dispatch = useAppDispatch();
  const user = useAppSelector((m) => m.user);
  const { data } = useAppSelector((m) => m.finance);
  const { selectedProject } = useContext(StoreContext);

  const handleDelete = async () => {
    setDeleting(true);

    let { e, response } = await postForm('delete', `financials/${data._id}/tranch/${_id}`);
    if (e) {
      displayWarning('Could not delete payment');
    } else {
      let newList =
        (data.disbursements && data.disbursements.filter((m: any) => m._id !== _id)) || [];
      dispatch(updateField({ field: 'disbursements', data: newList }));
    }

    setDeleting(false);
  };

  return (
    <div
      onClick={() => setOpenOptions(false)}
      className="flex items-center relative w-full justify-between bg-ashShade-0 my-2 p-6 rounded-md">
      {openOptions &&
        !isConfirmed &&
        ['consultant', 'contractor', 'portfolioManager'].includes(user.role) && (
          <span
            onBlur={() => setOpenOptions(false)}
            className="w-28 z-10 hover:cursor-pointer shadow-lg rounded-md absolute right-2 top-4 bg-white p-2">
            <div
              onClick={(e) => {
                e.stopPropagation();
                dispatch(openModal({ name: 'tranch', _id, isEditing: true }));
                setOpenOptions(false);
              }}
              className="w-full p-2 hover:bg-bbg rounded-lg flex items-center">
              <FaRegEdit size={12} color="#437ADB" />
              <span className=" text-sm ml-3 text-bblue">Edit</span>
            </div>

            <div
              onClick={(e) => {
                e.stopPropagation();
                if (!deleting) {
                  handleDelete();
                }
              }}
              className="w-full p-2 hover:bg-bbg rounded-lg flex items-center">
              {deleting ? (
                <span className="w-full flex justify-center items-center">
                  <LoaderX color="blue" />
                </span>
              ) : (
                <>
                  <RiDeleteBin6Line size={12} color="#437ADB" />
                  <span className=" text-sm ml-3 text-bblue">Delete</span>
                </>
              )}
            </div>
          </span>
        )}
      <div className="flex flex-col">
        <p className="font-Medium text-bblack-0 mb-2">
          {selectedProject.currency?.code} {toDecimalPlaceWithCommas(amount)}
        </p>
        <p className="text-bash">{dueDate}</p>
      </div>
      {!isConfirmed && (
        <span
          onClick={(e) => {
            e.stopPropagation();
            setOpenOptions(!openOptions);
          }}
          className=" p-2 rounded-full hover:bg-ashShade-0">
          <IoEllipsisVertical size={16} color="#9099A8" />
        </span>
      )}
    </div>
  );
};

export default Tranch;
