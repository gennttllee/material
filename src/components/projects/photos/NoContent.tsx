import React from 'react';
import emptygallery from 'assets/emptygallery.svg';
import { FaPlus } from 'react-icons/fa';
interface Props {
  title?: string;
  subtitle?: string;
  showAddButton?: boolean;
  onclick?: any;
}
const NoContent = ({ showAddButton, title, subtitle, onclick }: Props) => {
  return (
    <div className="w-full flex flex-col items-center">
      <img loading="lazy" decoding="async" src={emptygallery} alt="" />
      <p className=" mt-12 font-semibold text-2xl mb-2 text-bblack-0">
        {!title ? 'No Photos/Videos yet' : title}
      </p>
      <p className="text-bash mb-8">
        {subtitle
          ? subtitle
          : 'Photos and videos taken during the course of the project are stored here'}
      </p>
      {showAddButton && (
        <button
          onClick={() => onclick()}
          className="flex items-center bg-bblue rounded-md text-white px-3 py-2"
        >
          {' '}
          <FaPlus size={16} color="white" className="mr-3" /> Add Photo/video
        </button>
      )}
    </div>
  );
};

export default NoContent;
