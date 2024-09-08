import React, { useRef, useState, useEffect, useContext } from 'react';
import SuperModal from 'components/shared/SuperModal';
import { RecentPaymentsModalProps } from './types';
import { GrAttachment } from 'react-icons/gr';
import { postForm } from 'apis/postForm';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { updateField, closeModal } from 'store/slices/financeSlice';
import Loader, { LoaderX } from 'components/shared/Loader';
import { displayError, displayWarning } from 'Utils';
import NumberInput from 'components/shared/NumberInput';
import { upload, uploadAll } from 'Hooks/useProjectImages';
import { StoreContext } from 'context';

const RecentPaymentsModal = ({ setter }: RecentPaymentsModalProps) => {
  let fileRef = useRef<any>();
  let { selectedData } = useContext(StoreContext);
  const [loading, setLoading] = useState(false);
  const [values, setValues] = useState<any>({ amount: 0, date: '' });
  let dispatch = useAppDispatch();
  let { data, modal } = useAppSelector((m) => m.finance);
  const [file, setFile] = useState<File | null | undefined>();

  useEffect(() => {
    if (modal.isEditing) {
      let initialValue = (data.payments && data.payments.filter((m) => m._id === modal._id)) || [];

      setValues((prev: any) => {
        return { ...initialValue[0] };
      });
    }
  }, []);
  const logPayment = async () => {
    setLoading(true);
    if (!modal.isEditing) {
      let { date, amount } = values;
      if (!date || new Date(date).getTime() > new Date().getTime() || !amount || amount === 0) {
        setLoading(false);
        displayError('Please input correct date and amount');
        return;
      }

      let xfilekey: { key?: string; bucket?: string } = {};
      if (file?.name) {
        let res = await upload(file, selectedData._id, 'payments');
        if (res.response) {
          let data = res.response.data.data;

          xfilekey = {
            key: data.key,
            bucket: data.url?.split('/')[2]?.split('.')[0] ?? ''
          };
        }
      }
      let reqbody = { date, amount, file: xfilekey ?? undefined };
      let { response, e } = await postForm('post', `financials/${data._id}/payment`, reqbody);
      if (response) {
        let payments: any = [...(data.payments as [])];
        payments.unshift(response.data.data);
        dispatch(updateField({ data: payments, field: 'payments' }));
        dispatch(closeModal());
      } else {
        displayWarning('Could not add payment');
      }
    } else {
      let forCopy = { ...values };
      delete forCopy['_id'];
      let { response, e } = await postForm(
        'patch',
        `financials/${data._id}/payment/${values._id}`,
        {
          ...forCopy
        }
      );
      if (response) {
        let tranches = (data.payments && [...data.payments]) || [];
        for (let i = 0; i < tranches.length; i++) {
          if (tranches[i]._id === values._id) {
            tranches[i] = response.data.data;
            break;
          }
        }
        dispatch(updateField({ field: 'payments', data: tranches }));
        dispatch(closeModal());
      } else {
        displayWarning('Could not update Modal');
      }
    }

    setLoading(false);
  };

  useEffect(() => {
    if (modal.isEditing) {
      let initialValue = (data.payments && data.payments.filter((m) => m._id === modal._id)) || [];
      setValues((prev: any) => {
        return { ...initialValue[0] };
      });
    }
  }, []);

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
          <span className="font-Medium">Record Payment</span>
          <span
            onClick={() => {
              dispatch(closeModal());
            }}
            className="hover:underline text-bash text-sm"
          >
            Close
          </span>
        </div>
        <p className="text-bash font-Medium">Amount</p>
        <NumberInput
          value={values.amount}
          setter={(n: number) => setValues({ ...values, amount: n })}
          className="w-full font-Medium text-bblack-0 mb-4 outline-bblue border mt-2 border-bblue rounded-md px-4 py-2"
        />
        <p className="text-bash font-Medium">Payment Date</p>
        <input
          value={values.date}
          onChange={(e) => setValues({ ...values, date: e.target.value })}
          className="w-full font-Medium text-bblack-0 mb-4 outline-bblue border mt-2 border-bblue rounded-md px-4 py-2
             "
          type="date"
          max={new Date().toISOString().split('T')[0]}
          placeholder="N 240,000.00"
        />
        <p className="text-bash font-Medium">Proof of Payment (Optional)</p>
        <div
          onClick={() => {
            fileRef.current.click();
          }}
          className="w-full hover:underline cursor-pointer text-bash flex justify-between items-center font-Medium  mb-4 outline-bblue border mt-4 border-bblue rounded-md px-4 py-2"
        >
          {`${file?.name ?? 'Upload file'}`} <GrAttachment size={16} color="red" />
        </div>
        <input
          onChange={(e) => {
            if (e.target.files) setFile(e.target.files[0]);
          }}
          ref={fileRef}
          className="w-full hidden font-Medium text-bblack-0 mb-4 outline-bblue border mt-2 border-bblue rounded-md px-4 py-2
             "
          type="file"
          placeholder=""
        />

        <div className="flex mt-4 items-center justify-end">
          <span
            onClick={() => dispatch(closeModal())}
            className=" hover:cursor-pointer px-8 py-2 border font-semibold border-bblack-0 text-bblack-0 rounded-md"
          >
            Cancel
          </span>
          <span
            onClick={() => {
              if (!loading) {
                logPayment();
              }
            }}
            className=" hover:cursor-pointer px-8 py-2 border border-bblue bg-bblue ml-4 text-white rounded-md font-semibold"
          >
            {loading ? <LoaderX /> : modal.isEditing ? 'Update Payment' : 'Log Payment'}
          </span>
        </div>
      </span>
    </SuperModal>
  );
};

export default RecentPaymentsModal;
