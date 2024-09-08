import { useContext, useState } from 'react';
import { ScheduleItemProps } from './types';
import { IoEllipsisVertical } from 'react-icons/io5';
import { BsFillCheckCircleFill } from 'react-icons/bs';
import { postForm } from 'apis/postForm';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import { updateField, openModal } from 'store/slices/financeSlice';
import { LoaderX } from 'components/shared/Loader';
import { toDecimalPlaceWithCommas } from 'components/shared/utils';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { isProfessional } from '../Team/Views/Components/MemberList';
import { StoreContext } from 'context';

const ScheduleItem = ({
  amount,
  date,
  isfirst,
  isConfirmed,
  islast,
  id,
  _id
}: ScheduleItemProps & { id: number }) => {
  const [openOptions, setOpenOptions] = useState(false);
  const { selectedProject } = useContext(StoreContext);
  let { data } = useAppSelector((m) => m.finance);

  let user = useAppSelector((m) => m.user);
  let dispatch = useAppDispatch();
  const [confirming, setConfirming] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const confirmPayment = async () => {
    setConfirming(true);
    try {
      let payments: any = data.payments as [];
      let { response, e } = await postForm(
        'patch',
        `financials/${data._id}/payment/${payments[id]._id}`,
        {
          isConfirmed: true
        }
      );
      if (response) {
        let { payments } = data;
        let newpayments: any[] = [...(payments as [])];
        newpayments[id] = response.data.data;
        dispatch(updateField({ field: 'payments', data: newpayments }));
        displaySuccess('Payment confirmed successfully');
      } else {
        displayWarning('Could not confirm payment');
      }
      setConfirming(false);
    } catch (_error) {
      setConfirming(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    if (['projectOwner', 'portfolioManager'].includes(user.role) && !isConfirmed) {
      let { e, response } = await postForm('delete', `financials/${data._id}/payment/${_id}`);
      if (e) {
        displayWarning('Could not delete payment');
      } else {
        let newList = (data.payments && data.payments.filter((m) => m._id !== _id)) || [];
        dispatch(updateField({ field: 'payments', data: newList }));
      }
    } else {
      displayError('You cannot delete a confirmed payment');
    }

    setDeleting(false);
  };
  return (
    <div
      onClick={() => setOpenOptions(false)}
      className="flex justify-between flex-row  w-full       ">
      <div className="flex  w-9  px-2 ">
        <div className="flex flex-col items-center  justify-center relative   h-full px-2  ">
          <div
            className={`border-l flex-1 border-dashed h-1/2 ${isfirst ? ' invisible' : ''}  ${
              isConfirmed ? 'border-bgreen-0' : ' border-ashShade-2'
            }`}></div>

          <div
            className={`border-l flex-1 border-dashed h-1/2 ${islast ? ' invisible' : ''}  ${
              isConfirmed ? 'border-bgreen-0' : ' border-ashShade-2'
            }`}></div>
          <div className="p-2 bg-white  absolute top-[calc(50%-20px)]  -left-2 ">
            {isConfirmed ? (
              <BsFillCheckCircleFill size={16} color="#459A33" />
            ) : (
              <div className="w-4 h-4 rounded-full bg-ashShade-13"></div>
            )}
          </div>
        </div>
      </div>

      <div
        className={`relative p-6 my-3 flex flex-1 justify-between items-center rounded-md  bg-ashShade-0 `}>
        {openOptions && (
          <span
            onBlur={() => setOpenOptions(false)}
            className="w-28 z-10 hover:cursor-pointer shadow-lg rounded-md absolute right-2 top-4 bg-white p-2">
            <div
              onClick={() => {
                dispatch(
                  openModal({
                    name: 'payment',
                    isEditing: true,
                    _id
                  })
                );
                setOpenOptions(false);
              }}
              className="w-full p-2 hover:bg-bbg rounded-lg flex items-center">
              <FaRegEdit size={12} color="#437ADB" />
              <span className=" text-sm ml-3 text-bblue">Edit</span>
            </div>
            <div
              onClick={async (e) => {
                e.stopPropagation();
                await handleDelete();
              }}
              className="w-full  p-2 hover:bg-bbg rounded-lg flex items-center">
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
        <span>
          <p className="font-Medium">
            {selectedProject.currency?.code} {toDecimalPlaceWithCommas(amount)}
          </p>
          <span className={`flex items-center text-sm gap-2 text-bash mt-2 `}>
            <span className=" whitespace-nowrap">{date}</span>
            &#x2022;
            <span className={` whitespace-nowrap ${isConfirmed ? 'text-bgreen-0' : 'text-bash'}`}>
              {isConfirmed ? 'Payment confirmed' : 'Awaiting Confirmation'}
            </span>
          </span>
        </span>
        <span className="flex items-center gap-x-1">
          {!isConfirmed && isProfessional(user.role) ? (
            <span
              onClick={() => confirmPayment()}
              className="text-white font-satoshi font-sm rounded-md cursor-pointer bg-bblue py-2 px-4 whitespace-nowrap ">
              {confirming ? <LoaderX /> : 'Confirm payment'}
            </span>
          ) : null}
          {!isProfessional(user.role) && !isConfirmed ? (
            <span
              onClick={(e) => {
                e.stopPropagation();
                setOpenOptions(!openOptions);
              }}
              className={` p-2 rounded-full hover:bg-gray-50 `}>
              <IoEllipsisVertical size={16} color="#9099A8" />
            </span>
          ) : null}
        </span>
      </div>
    </div>
  );
};

export default ScheduleItem;
