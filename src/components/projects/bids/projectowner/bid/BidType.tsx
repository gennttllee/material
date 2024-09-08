import React from 'react';
import { AiFillCheckCircle } from 'react-icons/ai';

interface Props {
  label: string;
  value: string;
  setter: (_: string) => any;
  selected: boolean;
}
const BidType = ({ label, value, selected, setter }: Props) => {
  return (
    <span
      onClick={() => setter(value)}
      className={`cursor-pointer items-center my-2 mr-12 py-3 flex  rounded-lg`}
    >
      {selected ? (
        <AiFillCheckCircle size={16} className="mr-4" color={'#437ADB'} />
      ) : (
        <span className="bg-white border mr-4 border-ashShade-4 rounded-full w-4 h-4"> </span>
      )}

      <span className="text-[#121212]">{label}</span>
    </span>
  );
};

export default BidType;
