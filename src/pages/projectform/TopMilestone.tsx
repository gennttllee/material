import React from 'react';
import Milestone from './Milestone';
import htrendline from '../../assets/htrendline.svg';

interface Prop {
  milestones: any;
}
const TopMilestone = ({ milestones }: Prop) => {
  return (
    <div className="flex-1 lg:hidden flex w-full justify-evenly px-5  lg:justify-center lg:items-start  lg:flex-col  pb-5">
      <Milestone index={1} title={milestones[0].title} status={milestones[0].status} />
      <img
        loading="lazy"
        decoding="async"
        src={htrendline}
        alt="horizontaltrend"
        className="flex-1"
      />
      <Milestone index={2} title={milestones[1].title} status={milestones[1].status} />
      <img
        loading="lazy"
        decoding="async"
        src={htrendline}
        alt="horizontaltrend"
        className="flex-1"
      />
      <Milestone index={3} title={milestones[2].title} status={milestones[2].status} />
      <img
        loading="lazy"
        decoding="async"
        src={htrendline}
        alt="horizontaltrend"
        className="flex-1"
      />
      <Milestone index={4} title={milestones[3].title} status={milestones[3].status} />
    </div>
  );
};

export default TopMilestone;
