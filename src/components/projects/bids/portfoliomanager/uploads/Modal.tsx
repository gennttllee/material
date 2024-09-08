import React, { useState } from 'react';
import { displayError, displaySuccess } from 'Utils';
import SuperModal from '../../../../shared/SuperModal';
import { postForm } from '../../../../../apis/postForm';
import { useAppSelector, useAppDispatch } from '../../../../../store/hooks';
import { updateField } from '.././../../../../store/slices/bidslice';
import Loader, { LoaderX } from '../../../../shared/Loader';
import { AiFillCheckSquare } from 'react-icons/ai';
import { BsCheckLg } from 'react-icons/bs';
import { convertToProper } from 'components/shared/utils';
interface Props {
  closer: any;
  setter: any;
  isAdditional?: boolean;
}
const Modal = ({ closer, setter, isAdditional }: Props) => {
  const [fetching, setFetching] = useState(false);
  let dispatch = useAppDispatch();
  let bid = useAppSelector((m) => m.bid);
  let createPlaceholder = async () => {
    setFetching(true);
    let config = {
      name: value.name,
      isAvailable: false,
      requiresResponse: value.requiresResponse,
      meta: {
        isAdditional: isAdditional
      }
    };
    let { e, response } = await postForm('patch', `bids/${bid._id}/add-bid-docs`, {
      ...config
    });
    if (e) {
      displayError("Couldn't create Document placeholder");
    }
    if (response) {
      displaySuccess('Document placeholder Added Successfully');
      dispatch(
        updateField({
          bidDocuments: [...bid.bidDocuments, config]
        })
      );
    }

    setFetching(false);
  };

  const [value, setValue] = useState<{
    name: string;
    requiresResponse: boolean;
    isAdditional?: boolean;
  }>({ name: '', requiresResponse: false, isAdditional: isAdditional });
  const update = (field: string, val: string | boolean) => {
    if (field !== 'clear') {
      let newValues: any = { ...value };
      newValues[field] = val;
      setValue(newValues);
    } else {
      setValue({ name: '', requiresResponse: false });
    }
  };
  const submit = async () => {
    if (value.name != '') {
      await createPlaceholder();
      closer();
    } else {
      displayError('Please input the name of the document you want to upload');
    }
  };

  return (
    <SuperModal
      closer={closer}
      classes="bg-black pt-10 lg:pt-40  flex justify-center  items-start bg-opacity-90"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full sm:w-1/2 lg:w-1/3 p-8 rounded-lg"
      >
        <div className="mb-6 font-semibold flex w-full items-center justify-between">
          <span className="text-lg">Add Document</span>
          <span onClick={closer} className="cursor-pointer text-sm hover:underline">
            Close
          </span>
        </div>
        <label className="text-bash text-sm font-semibold">
          Name of Document
          <input
            value={value.name}
            onChange={(e) => update('name', e.target.value)}
            placeholder="e.g The New Document"
            type="text"
            className=" outline-bblue rounded-lg w-full text-base text-bash border-bash border mt-2 px-4 py-2"
          />
        </label>
        <div
          onClick={() => update('requiresResponse', !value.requiresResponse)}
          className="flex mt-9  items-center"
        >
          <span
            className={`w-5 h-5 rounded border flex items-center justify-center p-0 ${
              value.requiresResponse ? 'bg-bblue' : 'border-bblue'
            }`}
          >
            <BsCheckLg color="white" size={12} />
          </span>

          <span className="ml-4">{convertToProper(bid.type)} input required</span>
        </div>
        <button
          onClick={submit}
          className="w-full bg-bblue flex justify-center rounded-lg mt-8 text-white py-2"
        >
          {fetching ? <LoaderX /> : 'Create Field'}
        </button>
      </div>
    </SuperModal>
  );
};

export default Modal;
