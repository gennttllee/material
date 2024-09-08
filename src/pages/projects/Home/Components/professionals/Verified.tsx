import React, { useState, useEffect } from 'react';
import { HiOutlineChevronDown } from 'react-icons/hi';

interface Prop {
  setter: any;
}
const Verified = ({ setter }: Prop) => {
  let options = ['All', 'verified', 'unverified'];
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<string>('All');
  return (
    <div onClick={() => setOpen(!open)} className="w-full  py-3 px-4 cursor-pointer relative">
      <div className="w-full  flex justify-between items-center">
        <div className="flex items-center text-bash">
          {selected === 'verified' && (
            <span className=" bg-green-700 w-3 h-3 rounded-full mr-2"></span>
          )}
          <span>{selected}</span>
        </div>

        <HiOutlineChevronDown size={16} color={'#5E6777'} />
      </div>
      {open && (
        <div className="absolute max-h-[500%] z-40 overflow-y-auto  -top-10 w-full bg-ashShade-4 left-0 p-2 rounded-lg">
          {options?.map((m, i) => (
            <div
              onClick={() => {
                setSelected(m);
                setOpen(false);
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

export default Verified;
