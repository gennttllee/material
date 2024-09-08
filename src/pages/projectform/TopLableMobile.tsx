import React from 'react';
interface Prop {
  milestones: any;
}

const TopLableMobile = ({ milestones }: Prop) => {
  return (
    <div className="w-full flex px-5">
      {milestones.map((m: any, i: number) => (
        <div
          className={`w-1/4 ${
            i === 0 ? 'text-start' : i === 3 ? 'text-right' : 'pl-10  text-center'
          } text-sm font-semibold text-black`}
        >
          {m.status === 'ongoing' ? m.title : ''}
        </div>
      ))}
    </div>
  );
};

export default TopLableMobile;
