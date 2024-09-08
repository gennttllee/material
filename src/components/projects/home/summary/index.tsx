import React from 'react';
import emptygallery from 'assets/emptygallery.svg';

import { useAppSelector } from 'store/hooks';
import Gallery from './Gallery';
import Updates from './Updates';
import Budget from './Budget';
import Tasks from './Tasks';
import Photos from './Photos';

interface Props {}
const Index = () => {
  let members = useAppSelector((m) => m.team);
  return (
    <div className=" w-full h-full overflow-y-auto pb-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 items-center w-full gap-5 ">
        <Gallery />
        <Updates />
      </div>
      <div className="w-full my-8">
        <Budget />
      </div>
      <div className="grid grid-cols-1 max-h-[50%] lg:grid-cols-2  gap-5 ">
        <Tasks />
        <Photos />
      </div>
    </div>
  );
};

interface NoContentProps {
  title: string;
  titleClass?: string;
  imageClass?: string;
  containerClass?: string;
}

const NoContentDashBoard = ({ title, imageClass, titleClass, containerClass }: NoContentProps) => {
  return (
    <div className={'w-full ' + containerClass}>
      <img src={emptygallery} className={imageClass} />
      <p className={titleClass}>{title}</p>
    </div>
  );
};

export { NoContentDashBoard };

export default Index;
