import React from 'react';

interface Props {
  onClick: () => void;
  label?: string;
  value?: string;
  selected?: boolean;
}
const Radio: React.FC<Props> = ({ label, onClick, selected }) => {
  return (
    <div className=" flex cursor-pointer items-center gap-x-2" onClick={onClick}>
      <span
        className={`rounded-full border ${
          selected ? ' border-bblue ' : ' border-ashShade-15'
        }  flex items-center justify-center p-0.5`}>
        <span className={`w-2 h-2 rounded-full ${selected ? 'bg-bblue ' : ' bg-transparent '} `}></span>
      </span>
      <span className={` font-semibold ${selected ? ' text-bblue ' : ''}`}>{label}</span>
    </div>
  );
};

export default Radio;
