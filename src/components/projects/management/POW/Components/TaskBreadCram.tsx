import React from 'react';
import { TbChevronRight } from 'react-icons/tb';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';

type TaskViewProps = {
  powName?: string;
  taskName?: string;
  goBack: (index: number) => void;
};

const TaskBreadCram = ({ taskName, powName, goBack }: TaskViewProps) => (
  <div className={flexer}>
    <div className={'fixed top-12 flex items-center' + hoverFade}>
      <p onClick={() => goBack(-2)} className="text-sm text-borange">
        Program of works
      </p>
      <TbChevronRight className="text-borange mx-1" />
      <p
        onClick={() => goBack(-1)}
        className="text-sm text-bash transform transition-all hover:translate-x-[2px] capitalize"
      >
        {powName}
      </p>
      <TbChevronRight className="text-bash mx-1" />
      <p
        onClick={() => goBack(-1)}
        className="text-sm text-bash transform transition-all hover:translate-x-[2px] capitalize"
      >
        {taskName}
      </p>
    </div>
  </div>
);

export default TaskBreadCram;
