import StatusBanner from 'components/projects/bids/contractor/components/StatusBanner';
import { BsFillCheckCircleFill, BsFillCircleFill } from 'react-icons/bs';
import { flexer, hoverFade } from 'constants/globalStyles';
import { Tooltip } from 'react-tooltip';
import React, { useState } from 'react';
import { TaskStatus } from '../../../../projects/management/types';
import { CustomTask } from '../../../../projects/management/POW/Components/GanttChartView';
import { BarTask } from '../../types/bar-task';
import { TiWarning } from 'react-icons/ti';
import { TaskStatusColor } from 'components/projects/management/POW/helpers';
import Moment from 'react-moment';
import SubtaskWithConnector from './SubtaskWithConnector';
import { TbMessages } from 'react-icons/tb';
import MessagesModal from 'components/projects/management/POW/Components/MessagesModal';
import { useAppDispatch } from 'store/hooks';
import { setMessageModal } from 'store/slices/taskMessagesModalSlice';

interface Props {
  toggleModal: (val?: number) => void;
  onExpanderClick?: (t: CustomTask) => void;
  showModal: { status: boolean; index?: number };
  allTasks: BarTask[];
  topOffSet: number;
  task: BarTask;
}

export default function OneTask({
  // onExpanderClick,
  toggleModal,
  showModal,
  topOffSet,
  allTasks,
  task
}: Props) {
  const {
    name,
    y,
    x1,
    x2,
    styles,
    height,
    subTask,
    hideChildren,
    dependencies,
    start,
    index,
    end
  } = task;

  const CheckIcon = () => (
    <div className="rounded-full p-1px">
      {task.status === TaskStatus.completed ? (
        <BsFillCheckCircleFill className={' text-white text-[12px]'} />
      ) : task.status === TaskStatus.awaitingApproval ? (
        <TiWarning className={'text-white text-[12px]'} />
      ) : (
        <BsFillCircleFill className={'text-white text-[12px]'} />
      )}
    </div>
  );

  const modalOnTop = index > 5 ? 'bottom-full -translate-y-1' : 'top-full translate-y-1';
  //

  const modal = (
    <div
      className={`${
        !showModal.status || showModal.index !== index ? 'hidden' : ''
      } absolute ${modalOnTop} bg-white shadow-2xl z-20 rounded-md p-6 h-fit w-150`}
      style={{
        top: y + height + 10,
        left: x2 - 310
      }}>
      <div className={flexer + 'mb-3'}>
        <strong
          style={{ color: styles.backgroundColor }}
          className="font-semibold text-xl truncate capitalize">
          {name}
        </strong>
        <strong
          onClick={() => toggleModal()}
          className={'text-bash text-sm font-Medium' + hoverFade}>
          Close
        </strong>
      </div>
      <div className={flexer + 'mt-3'}>
        <p className="text-bash text-base w-1/5">Status</p>
        <div className="flex-1 flex items-center">
          <TiWarning className={TaskStatusColor(task.status as TaskStatus) + 'text-base'} />
          <span className="text-base font-Medium text-black ml-2">{task.status}</span>
        </div>
      </div>
      <div className={flexer}>
        <p className="text-bash text-base w-1/5 mb-2">Duration</p>
        <p className="text-base text-black flex-1 truncate">
          <Moment diff={start} unit="days">
            {end}
          </Moment>{' '}
          Days
        </p>
      </div>
      <div className={flexer}>
        <p className="text-bash text-base w-1/5">Timeline</p>
        <p className="text-base text-black flex-1 truncate">
          <Moment format="MMM Do YYYY">{start}</Moment>
          <span className="mx-1">-</span>
          <Moment format="MMM Do YYYY">{end}</Moment>
        </p>
      </div>
      <div className="flex mt-2">
        <p className="text-bash text-base w-1/5">Predecessors</p>
        <div className="grid grid-cols-2 gap-2 flex-1">
          {dependencies && dependencies[0] ? (
            React.Children.toArray(
              dependencies.map((one) => <StatusBanner label={one} type="dormant" />)
            )
          ) : (
            <StatusBanner label="N/A" type="dormant" />
          )}
        </div>
      </div>
    </div>
  );
  let dispatch = useAppDispatch();
  const toggleMessageModal = () => {
    dispatch(setMessageModal({ isOpen: true, taskId: task.id }));
  };

  return (
    <>
      <div
        id={`GanttTask${task.id}`}
        className={`absolute rounded-3xl p-2 ${!hideChildren ? 'z-0' : 'z-10'}`}
        style={{
          left: x1,
          width: x2 - x1,
          top: topOffSet,
          padding: '.5em'
        }}>
        <div
          style={{ background: styles.backgroundColor }}
          className={`absolute w-full h-full top-1 left-0 opacity-20 border-2 rounded-3xl rounded-b-none ${
            !hideChildren && 'hidden'
          }`}
        />
        <div
          className={flexer + 'relative w-full py-1 px-4 rounded-full'}
          id={`GanttTask${task.id}`}
          style={{
            width: x2 - x1,
            height: height,
            background: styles.backgroundColor
          }}>
          <CheckIcon />
          <p className="text-white text-sm font-Medium flex-1 px-2 truncate capitalize">{name}</p>
          {/* <TbDotsVertical
            onClick={() => toggleModal(index)}
            className={"text-gray-200 text-base" + hoverFade}
          /> */}
          <div
            onClick={() => toggleMessageModal()}
            className={'flex items-center group  p-2 rounded-md' + hoverFade}>
            <TbMessages className="text-white text-base font-Medium" />
            {/* <p className="text-blue-600 text-sm whitespace-nowrap font-Medium ml-1">
              Leave comment
            </p> */}
          </div>
        </div>
        <Tooltip place="top-start" anchorSelect={`#GanttTask${task.id}`}>
          <p className="text-white text-sm font-Medium flex-1 px-2 truncate capitalize">{name}</p>
        </Tooltip>
        {hideChildren &&
          React.Children.toArray(
            subTask &&
              subTask.map((subtaskData, stIndex) => (
                <SubtaskWithConnector
                  {...{
                    end,
                    start,
                    index,
                    height,
                    styles,
                    stIndex,
                    allTasks,
                    toggleModal,
                    subtaskData
                  }}
                />
              ))
          )}
      </div>
      {modal}
    </>
  );
}
