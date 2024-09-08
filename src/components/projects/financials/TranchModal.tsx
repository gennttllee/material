import React, { useState, useEffect, useCallback, useMemo } from 'react';
import SuperModal from 'components/shared/SuperModal';
import { TranchModalProps, TranchProps } from './types';
import { postForm } from 'apis/postForm';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import NumberInput from 'components/shared/NumberInput';
import { closeModal, updateField } from 'store/slices/financeSlice';
const TranchModal = ({ setter, executor }: TranchModalProps) => {
  const [values, setValues] = useState<any>({
    amount: 0,
    dueDate: ''
  });
  const [fetching, setFetching] = useState(false);
  let { data, modal } = useAppSelector((m) => m.finance);
  let dispatch = useAppDispatch();
  const disabled = useMemo(() => {
    return !(values.dueDate && values.amount);
  }, [values]);

  useEffect(() => {
    if (modal.isEditing) {
      let initialValue =
        (data.disbursements && data.disbursements.filter((m) => m._id === modal._id)) || [];

      setValues((prev: any) => {
        return { ...initialValue[0] };
      });
    }
  }, []);
  const handleSubmission = async () => {
    setFetching(true);
    if (!modal.isEditing) {
      let { response, e } = await postForm('post', `financials/${data._id}/tranch`, {
        ...values
      });
      if (response) {
        executor({ ...response.data.data });
        displaySuccess('Disbursement Added Successfully');
        dispatch(closeModal());
      } else {
        displayWarning('Could not add tranch');
      }
    } else {
      let forCopy = { ...values };
      delete forCopy['_id'];
      let { response, e } = await postForm('patch', `financials/${data._id}/tranch/${values._id}`, {
        ...forCopy
      });
      if (response) {
        let tranches = (data.disbursements && [...data.disbursements]) || [];
        for (let i = 0; i < tranches.length; i++) {
          if (tranches[i]._id === values._id) {
            tranches[i] = response.data.data;
            break;
          }
        }
        dispatch(updateField({ field: 'disbursements', data: tranches }));
        dispatch(closeModal());
      } else {
        displayWarning('Could not update Modal');
      }
    }
    setFetching(false);
  };
  let CachedNumberInput = useCallback(
    () => (
      <NumberInput
        value={values.amount}
        setter={(n: number) => setValues({ ...values, amount: n })}
        className="w-full font-Medium text-bblack-0 mb-4 outline-bblue border mt-2 border-bblue rounded-md px-4 py-2"
      />
    ),
    [values.amount]
  );

  return (
    <SuperModal
      closer={() => dispatch(closeModal())}
      classes="bg-black bg-opacity-80 flex justify-center"
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
        }}
        className=" bg-white h-fit mt-[10%] rounded-lg w-full max-w-[484px] p-4"
      >
        <div className="flex mb-6 hover:cursor-pointer items-center justify-between">
          <span className="font-Medium">Create Tranch</span>
          <span
            onClick={() => dispatch(closeModal())}
            className="hover:underline text-bash text-sm"
          >
            Close
          </span>
        </div>
        <p className="text-bash font-Medium">Amount</p>

        {CachedNumberInput()}

        <p className="text-bash font-Medium">Payment Date</p>
        <input
          min={new Date().toISOString().split('T')[0]}
          value={values.dueDate}
          onChange={(e) => {
            setValues({
              ...values,
              dueDate: e.target.value
            });
          }}
          className="w-full font-Medium text-bblack-0 mb-4 outline-bblue border mt-2 border-bblue rounded-md px-4 py-2
             "
          type="date"
        />

        <div className="flex mt-4 items-center justify-end">
          <button
            onClick={() => dispatch(closeModal())}
            className=" hover:cursor-pointer px-8 py-2 border font-Medium border-bblack-0 text-bblack-0 rounded-md"
          >
            Cancel
          </button>
          <button
            disabled={disabled}
            onClick={() => {
              if (values.amount && values.dueDate) {
                handleSubmission();
              }
            }}
            className={`hover:cursor-pointer px-8 py-2 border ${
              !disabled
                ? 'bg-bblue border-bblue text-white'
                : 'text-bash border-ashShade-4 bg-ashShade-3'
            } ml-4  rounded-md font-Medium`}
          >
            {!fetching ? (
              modal.isEditing ? (
                'Update Tranch'
              ) : (
                'Create Tranch'
              )
            ) : (
              <div className="border-2 border-white border-l-transparent animate-spin w-4 h-4 p-2.5 rounded-full"></div>
            )}
          </button>
        </div>
      </span>
    </SuperModal>
  );
};

export default TranchModal;
