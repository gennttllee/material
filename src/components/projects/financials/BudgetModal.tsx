import React, { useEffect, useRef, useState } from 'react';
import SuperModal from 'components/shared/SuperModal';
import { RecentPaymentsModalProps } from './types';
import { GrAttachment } from 'react-icons/gr';
import { postForm } from 'apis/postForm';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { closeModal, updateField } from 'store/slices/financeSlice';
import Loader, { LoaderX } from 'components/shared/Loader';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import NumberInput from 'components/shared/NumberInput';
const RecentPaymentsModal = ({ setter }: RecentPaymentsModalProps) => {
  let fileRef = useRef<any>();
  const [loading, setLoading] = useState(false);
  let { data } = useAppSelector((m) => m.finance);
  const [values, setValues] = useState({
    estimatedBudget: data.estimatedBudget || 0
  });
  let dispatch = useAppDispatch();
  const setBudget = async () => {
    setLoading(true);
    let { estimatedBudget } = values;
    if (!estimatedBudget || estimatedBudget === 0) {
      setLoading(false);
      displayError('Please input estimatedBudget');
      return;
    }
    let reqbody = { estimatedBudget };
    let { response, e } = await postForm('patch', `financials/${data._id}`, reqbody);
    if (response) {
      dispatch(
        updateField({
          data: response.data.data.estimatedBudget,
          field: 'estimatedBudget'
        })
      );
      dispatch(closeModal());
    } else {
      displayWarning('Could not set budget');
    }
    setLoading(false);
  };
  return (
    <SuperModal
      closer={() => dispatch(closeModal())}
      classes="bg-black bg-opacity-80 flex justify-center"
    >
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" bg-white h-max mt-[10%] rounded-lg w-full max-w-[484px] p-4"
      >
        <div className="flex mb-6 hover:cursor-pointer items-center justify-between">
          <span className="font-semibold">Project Budget</span>
          <span
            onClick={() => dispatch(closeModal())}
            className="hover:underline text-bash text-sm"
          >
            Close
          </span>
        </div>
        <p className="text-bash font-Medium">New budget</p>
        <NumberInput
          value={values.estimatedBudget}
          setter={(n: number) => setValues({ ...values, estimatedBudget: n })}
          className="w-full font-Medium text-bblack-0 mb-4 outline-bblue border mt-2 border-bblue rounded-md px-4 py-2"
        />
        <div className="flex font-satoshi mt-4 items-center justify-end">
          <button
            onClick={() => dispatch(closeModal())}
            className=" hover:cursor-pointer px-8 py-2 border font-Medium border-bblack-0 text-bblack-0 rounded-md"
          >
            Cancel
          </button>
          <button
            disabled={values.estimatedBudget ? false : true}
            onClick={() => {
              if (!loading) {
                setBudget();
              }
            }}
            className={`hover:cursor-pointer px-8 py-2 border  ${
              values.estimatedBudget
                ? 'bg-bblue border-bblue text-white'
                : 'text-bash border-ashShade-4 bg-ashShade-3'
            } ml-4  rounded-md font-Medium`}
          >
            {loading ? <LoaderX /> : data.estimatedBudget ? 'Update budget' : 'Set Budget'}
          </button>
        </div>
      </div>
    </SuperModal>
  );
};

export default RecentPaymentsModal;
