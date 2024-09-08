import React from 'react';
import { AiOutlineFile } from 'react-icons/ai';

interface Prop {
  name: string;
  toggler?: any;
}
const ListCard = ({ name, toggler }: Prop) => {
  return (
    <div onClick={() => toggler()} className="w-full">
      <div className="w-full flex items-center justify-between  py-4 ">
        <div className="bg-white hover:cursor-pointer   flex items-center rounded-b-md">
          <AiOutlineFile size={18} color="#C8CDD4" />
          <span className="ml-3 font-semibold text-bash hover:text-bblue hover:underline">
            {name}
          </span>
        </div>
      </div>
      <hr />
    </div>
  );
};

export default ListCard;
