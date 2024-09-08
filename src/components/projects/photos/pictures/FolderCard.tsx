import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFolder } from 'react-icons/fa';
interface Prop {
  name: string;
  isNew: boolean;
}

const FolderCard = ({ name, isNew }: Prop) => {
  let navigate = useNavigate();
  return (
    <div
      onClick={() => navigate('/projects/documents/drawings')}
      className="w-full cursor-pointer flex flex-col items-center bg-white pt-16 px-10 relative rounded-lg"
    >
      {isNew ? (
        <span className="absolute rounded-3xl bg-bgreen-1 text-xs top-6 right-4 text-bgreen-0 py-1 px-3 ">
          New File
        </span>
      ) : null}
      <FaFolder size={105} color="#437ADB" className="" />
      <span className="mb-7 mt-12 font-semibold truncate">{name}</span>
    </div>
  );
};

export default FolderCard;
