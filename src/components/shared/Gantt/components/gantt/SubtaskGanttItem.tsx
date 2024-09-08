import { SubTask, SubTaskStatus } from 'components/projects/management/types';
import React from 'react';
import { BarTask } from '../../types/bar-task';
import { BsFillCheckCircleFill, BsFillCircleFill } from 'react-icons/bs';
import { TiWarning } from 'react-icons/ti';
import { SubTaskStatusColor, isAwaiting } from 'components/projects/management/POW/helpers';
import { Tooltip } from 'react-tooltip';
import { flexer } from 'constants/globalStyles';

export interface SubtaskGanttItemProps {
  end: Date;
  start: Date;
  height: number;
  toggleModal: (val?: number | undefined) => void;
  styles: BarTask['styles'];
  index: BarTask['index'];
  stIndex: number;
  subtaskData: SubTask;
}

const SubtaskGanttItem = ({ subtaskData, end, start, height, stIndex }: SubtaskGanttItemProps) => {
  const baseEndTime = new Date(end).getTime();
  const baseStartingTime = new Date(start).getTime();
  const baseTimeDiff = baseEndTime - baseStartingTime;
  //
  const currentStartingTime = new Date(subtaskData.startDate.value).getTime();
  const currentEndTime = new Date(subtaskData.endDate).getTime();
  // starting handler (offset & x1)
  const startingDiff = currentStartingTime - baseStartingTime;
  const X1_OffsetPercentage = (startingDiff / baseTimeDiff) * 100;
  // ending handler  (offset & x2)
  const endDiff = currentEndTime - baseStartingTime;
  const X2_OffsetPercentage = (endDiff / baseTimeDiff) * 100;
  // width
  const ST_Width = X2_OffsetPercentage - X1_OffsetPercentage;
  //

  const statusColor = (progress: SubTaskStatus) => {
    switch (progress) {
      case SubTaskStatus.awaitingApproval:
        return 'text-bash';
      case SubTaskStatus.notStarted:
        return 'text-bred';
      case SubTaskStatus.ongoing:
        return 'text-borange';
      case SubTaskStatus.completed:
        return 'text-green-500';
      default:
        return 'text-blue-500';
    }
  };
  //
  const CheckIcon = () => (
    <div className="rounded-full p-1px">
      {subtaskData.status === SubTaskStatus.completed ? (
        <BsFillCheckCircleFill className={statusColor(subtaskData.status) + ' text-xs'} />
      ) : subtaskData.status === SubTaskStatus.awaitingApproval ? (
        <TiWarning className={'text-bash text-xs'} />
      ) : (
        <BsFillCircleFill className={statusColor(subtaskData.status) + ' text-xs'} />
      )}
    </div>
  );

  return (
    <div
      id={`GanttTask${subtaskData._id}`}
      className={
        flexer +
        `${
          stIndex ? 'mt-3' : 'mt-2'
        } relative stripe-4 stripe px-5 rounded-full border-[1px] bg-gray-50 shadow-sm`
      }
      style={{
        height,
        width: `${ST_Width}%`,
        left: `${X1_OffsetPercentage}%`,
        borderColor: SubTaskStatusColor(subtaskData.status)
      }}
    >
      <div id={`ArrowTo${subtaskData._id}`} />
      <CheckIcon />
      <p
        className={` ${
          isAwaiting(subtaskData.status) ? 'text-bash' : 'text-black'
        } text-xs font-Medium flex-1 px-2 py-1 truncate capitalize`}
      >
        {subtaskData.name}
      </p>
      <Tooltip place="top-start" anchorSelect={`#GanttTask${subtaskData._id}`}>
        <p className="text-white text-sm font-Medium flex-1 px-2 truncate capitalize">
          {subtaskData.name}
        </p>
      </Tooltip>
      <div id={`ArrowFrom${subtaskData._id}`} />
    </div>
  );
};

export default SubtaskGanttItem;
