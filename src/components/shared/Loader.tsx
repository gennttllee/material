import React from 'react';


interface Props {
  color?: 'blue' | 'green' | 'red';
  className?: string;
  height?: 'screen' | 'full';
}
const Loader = ({ color, className, height = 'screen' }: Props) => {
  return (
    <div className={`w-full h-${height} flex justify-center items-center`}>
      <div className={'bg-bblue p-4 rounded-full ' + className}>
        <div
          className={` border-t-transparent border-t-2 border-x-2 border-b-2 rounded-full ${
            color === 'blue' ? 'border-bblue' : color === 'red' ? 'border-red-600' : 'border-white'
          } w-6 h-6 animate-spin`}></div>
      </div>
    </div>
  );
};

const LoaderX = ({ color, className }: Props) => {
  return (
    <div className={' self-center  rounded-full ' + className}>
      <div
        className={` border-t-transparent border-t-2 border-x-2 border-b-2 rounded-full ${
          color === 'blue' ? 'border-bblue' : color === 'red' ? 'border-red-600' : 'border-white'
        } w-6 h-6 animate-spin`}></div>
    </div>
  );
};

export { LoaderX };

export default Loader;
