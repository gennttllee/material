import React, { useState } from 'react';
import TaskMenuDropDown from '../../TaskMenuDropDown';
import { TbChevronDown, TbChevronUp, TbPlus } from 'react-icons/tb';
import Modal from 'components/shared/Modal';
import useRole, { UserRoles } from 'Hooks/useRole';
import { Row } from '@tanstack/react-table';
import { ProjectTask, SubTaskStatus } from 'components/projects/management/types';
import { flexer, hoverFade } from 'constants/globalStyles';
import SubTaskForm from '../../subTaskForm';
import { TaskStatusColor } from '../../../helpers';

const StatusColumn = (row: Row<ProjectTask>) => {
  const { role } = useRole();
  const [showModal, setModal] = useState(false);
  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  if (!row.original.subTasks || !row.original.subTasks[0])
    return role === UserRoles['Contractor'] ? (
      <>
        <div className="flex items-center w-full px-4 ">
          <button onClick={toggleModal} className={'flex min-w-[200px] items-center' + hoverFade}>
            <TbPlus className="text-bblue mr-1" />
            <strong className="text-bblue text-sm font-Medium">Add subtask</strong>
          </button>
          <TaskMenuDropDown {...row.original} />
        </div>
        <Modal
          visible={showModal}
          toggle={toggleModal}
          overlayClassName="opacity-50 backdrop-blur-0"
          className="backdrop-blur-0 drop-shadow-lg">
          <div className="bg-white absolute cursor-auto w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg z-10">
            <SubTaskForm {...{ toggleModal }} taskId={row.original._id} />
          </div>
        </Modal>
      </>
    ) : (
      <div className={flexer + 'p-[16px]'}>
        <p className="text-bash text-sm text-center flex-1">No SubTask Yet</p>
      </div>
    );

  const initialValue = 0;
  const completedSubTasks = row.original.subTasks.reduce(
    (accumulator, currentValue) =>
      accumulator + (currentValue.status === SubTaskStatus.verified ? 1 : 0),
    initialValue
  );
  const completedPercentage = (completedSubTasks / row.original.subTasks.length) * 100;

  return (
    <div className=" flex items-center py-4 px-2 ">
      <div className={flexer + 'min-w-[200px] '}>
        <p className="text-bash text-sm text-center">
          {completedSubTasks}/{row.original.subTasks.length}
        </p>
        <div className="relative h-2 rounded-full flex-[.9] bg-ashShade-3">
          <div
            style={{
              width: `${completedPercentage}%`,
              background: TaskStatusColor(row.original.status)
            }}
            className="absolute w-full h-full rounded-full top-0 left-0"
          />
        </div>
      </div>

      <TaskMenuDropDown {...row.original} />
      <button
        {...{
          onClick: row.getToggleExpandedHandler(),
          style: { cursor: 'pointer' }
        }}>
        {row.getIsExpanded() ? (
          <TbChevronUp className={'text-ashShade-2 text-base' + hoverFade} />
        ) : (
          <TbChevronDown className={'text-ashShade-2 text-base' + hoverFade} />
        )}
      </button>
    </div>
  );
};

export default StatusColumn;
