import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineChevronLeft } from 'react-icons/hi';

const Professionals = () => {
  let navigate = useNavigate();
  return (
    <div className="p-2 mt-12">
      <div className="w-full sticky  top-0  ">
        <button
          className="items-center  flex hover:text-borange hover:underline "
          onClick={() => {}}
        >
          <HiOutlineChevronLeft size={16} />
          Back
        </button>
      </div>

      <h1 className="mt-3 font-semibold text-3xl">Professionals</h1>
      <div></div>
    </div>
  );
};

export default Professionals;
