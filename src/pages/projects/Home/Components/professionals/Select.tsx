import React, { useEffect, useState } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

interface Prop {
  options: string[];
  setter?: any;
  state?: any;
  placeholder?: string;
}
const Select = ({ options, setter, state, placeholder }: Prop) => {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>(state);

  return (
    <div onClick={() => setOpen(!open)} className="w-full  py-3 px-4 cursor-pointer relative">
      <div className="w-full  flex justify-between items-center">
        <span className="text-bash">{selected ?? placeholder ?? ''}</span>
        <HiOutlineChevronDown size={16} color={'#5E6777'} />
      </div>
      {open && (
        <div className="absolute max-h-[500%] z-40 overflow-y-auto  -top-10 w-full bg-ashShade-4 left-0 p-2 rounded-lg">
          {options?.map((m, i) => (
            <div
              onClick={() => {
                setSelected((prev) => m);
                setOpen((prev) => false);
                setter(m);
              }}
              className={` text-bash cursor-pointer rounded-lg ${
                m === selected ? 'bg-white' : ''
              } hover:bg-lightblue p-2`}
            >
              {m}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Select;
