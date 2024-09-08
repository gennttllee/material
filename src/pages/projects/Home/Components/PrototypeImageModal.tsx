// import { FetchImage } from 'components/shared/FetchImage';
import { FetchImage } from 'components/shared/FetchImage';
import SuperModal from 'components/shared/SuperModal';
import React, { useState } from 'react';
import { TbChevronLeft, TbChevronRight } from 'react-icons/tb';
import { prototypeImage } from 'types';

interface Props {
  closer: () => void;
  images: prototypeImage[];
  active: number;
}

const PrototypeImageModal = ({ closer, images, active }: Props) => {
  const [image, setImage] = useState(active);

  const handleNext = () => {
    if (image + 1 < images.length) {
      setImage(image + 1);
    } else {
      setImage(0);
    }
  };

  const handlePrev = () => {
    if (image > 0) {
      setImage(image - 1);
    } else {
      setImage(images.length - 1);
    }
  };

  return (
    <SuperModal closer={closer} classes=" bg-black bg-opacity-60">
      <div className="w-full h-full flex justify-between gap-x-3 md:gap-x-8 items-center sm:px-12">
        <span
          onClick={(e) => {
            e.stopPropagation();
            handlePrev();
          }}
          className=" p-2 md:p-4 rounded-full bg-bblack-1 hover:bg-opacity-70 cursor-pointer">
          <TbChevronLeft color="white" size={24} />
        </span>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" bg-white h-1/2 sm:h-3/5  lg:h-4/5 flex flex-col rounded-md w-full px-2 sm:px-10 lg:px-16 py-6">
          <div className=" flex items-center justify-between">
            <p className=" sm:text-2xl text-bblack-1 font-semibold ">Image {image+ 1}</p>
            <span onClick={closer} className=" text-borange p-1 cursor-pointer">
              Close
            </span>
          </div>
          <div className=" w-full flex-1 items-center flex justify-center  mt-5 bg-ashShade-0 overflow-hidden rounded-md ">
            <FetchImage
              hasTransitionEffect
              divClassName=" rounded-md mt-6 w-full h-full "
              className=" object-contain"
              src={images[image]?.key}
            />
          </div>

          <div className=" w-full justify-center items-center mt-4 flex">
            <span className="py-1 px-3 rounded-sm bg-ashShade-0 ">{`${image+ 1}/${
              images.length
            }`}</span>
          </div>
        </div>

        <span
          onClick={(e) => {
            e.stopPropagation();
            handleNext();
          }}
          className=" p-2 md:p-4 rounded-full bg-bblack-1 hover:bg-opacity-70 cursor-pointer">
          <TbChevronRight color="white" size={24} />
        </span>
      </div>
    </SuperModal>
  );
};

export default PrototypeImageModal;
