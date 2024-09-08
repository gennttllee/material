import React, { useRef } from 'react';
import Loader from 'components/shared/Loader';

interface Props {
  closer: (x: boolean) => void;
  creatorFn: (x?: any) => void;
  fetching?: boolean;
}
const CheckListModal = ({ closer, creatorFn, fetching }: Props) => {
  let inputRef = useRef<any>();

  return (
    <div className="absolute w-screen h-screen pt-20 bg-black bg-opacity-90 top-0 z-40 left-0 flex items-start justify-center">
      <div className=" w-11/12 sm:w-4/5 lg:w-2/5 max-w-[500px] bg-white rounded-lg p-6">
        <div className="flex mb-7 justify-between items-center">
          <span className=" text-bblack-0 font-Medium">Add Checklist Group </span>
          <span
            onClick={() => {
              closer(false);
            }}
            className=" text-sm text-bash font-Medium cursor-pointer hover:underline ">
            Close
          </span>
        </div>
        <p className="text-bash font-Medium text-sm mb-2">Title</p>
        <input
          ref={inputRef}
          className="py-2 w-full placeholder-ashShade-4 text-bash font-Medium  px-4 mb-6 border border-bash rounded-lg"
          placeholder="e.g New List"
          type="text"
        />
        <button
          onClick={() => {
            creatorFn(inputRef.current.value);
          }}
          className="w-full flex rounded-lg py-2 text-white bg-bblue justify-center text-center cursor-pointer">
          {fetching ? <Loader /> : <span>Add New Checklist</span>}
        </button>
      </div>
    </div>
  );
};

export default CheckListModal;
