import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  TbDotsVertical,
  TbEdit,
  TbFlag3,
  TbGitCompare,
  TbInfoCircle,
  TbSquareCheck,
  TbTrash
} from 'react-icons/tb';
import { ProjectTask, SubTask, SubTaskStatus } from '../../types';
import { hoverFade } from 'constants/globalStyles';
import { IconType } from 'react-icons';
import useRole, { UserRoles } from 'Hooks/useRole';
import { HiArrowUturnLeft, HiArrowUturnRight } from 'react-icons/hi2';
import Loader from 'components/shared/Loader';
import { ModalTypes } from './SubTaskCard';
import { BsArrowsMove } from 'react-icons/bs';
import { MdVerified } from 'react-icons/md';
import { IoIosClose } from 'react-icons/io';
import useFetch from 'Hooks/useFetch';
import { cancelDeleteSubTaskReq, cancelEditSubTaskReq, getOneTasks } from 'apis/tasks';
import { AiOutlineLoading } from 'react-icons/ai';
import { PMStoreContext } from '../../Context';

interface SubTaskMenuDropDownProps {
  subTask: SubTask;
  positionOnTop?: boolean;
  isActive: boolean;
  isDeleting: boolean;
  onClick: () => void;
  isStatusLoading: boolean;
  loadingStatus: SubTaskStatus | undefined;
  toggleModal: (type: ModalTypes) => void;
  actionHandler: (subtask: SubTaskStatus) => void;
}

const SubTaskMenuDropDown = ({
  subTask,
  onClick,
  isActive,
  isDeleting,
  toggleModal,
  positionOnTop,
  actionHandler,
  loadingStatus,
  isStatusLoading
}: SubTaskMenuDropDownProps) => {
  const [showMenu, setMenu] = useState(false);
  const { isOfType, isProfessional } = useRole();
  const { setContext } = useContext(PMStoreContext);
  const containerRef = useRef<HTMLDivElement>(null);

  const subTaskUniqueClassName = `containerRef${subTask._id}`;

  const updateTaskAndSubtask = () => {
    const taskId = subTask.task,
      powId = subTask.powId;
    getOneTasks<ProjectTask[]>(taskId).then((res) => {
      setContext((prev) => ({
        ...prev,
        activeTask: res.data[0], // update the task on the temporary variable
        tasks: {
          ...prev.tasks,
          [powId]: prev.tasks[powId].map((one) => (one._id === taskId ? res.data[0] : one)) // update the task in the POW store
        }
      }));
    });
  };

  const { load: loadCancelDelete, isLoading: isCancelingDelete } = useFetch({
    onSuccess: updateTaskAndSubtask
  });
  const { load: loadCancelEdit, isLoading: isCancelingEdit } = useFetch({
    onSuccess: updateTaskAndSubtask
  });

  useEffect(() => {
    // click event that's in charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (
        e.target &&
        (e.target.contains(containerRef.current) ||
          !e.target.classList.contains(subTaskUniqueClassName))
      ) {
        setMenu(false);
      }
    });

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setMenu(false);
      });
    };
  }, [subTaskUniqueClassName]);

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  const HelperActions = () => {
    const Action = ({
      label,
      Icon,
      onClick,
      targetStatus
    }: {
      targetStatus: SubTaskStatus;
      label: string;
      Icon: IconType;
      onClick: () => void;
    }) => (
      <button
        {...{ onClick }}
        title={label}
        className={'flex items-center w-full group hover:bg-blue-100 p-2 rounded-md' + hoverFade}>
        {isStatusLoading && loadingStatus === targetStatus ? (
          <Loader />
        ) : (
          <Icon className="text-bash group-hover:text-bblue mr-2" />
        )}
        <p className="text-sm font-Medium text-bash whitespace-nowrap group-hover:text-bblue">
          {label}
        </p>
      </button>
    );

    switch (subTask.status) {
      case SubTaskStatus.awaitingApproval:
        return (
          isOfType(UserRoles.PortfolioManager) && (
            <Action
              onClick={() => actionHandler(SubTaskStatus.notStarted)}
              targetStatus={SubTaskStatus.notStarted}
              label="Move to not started"
              Icon={HiArrowUturnRight}
            />
          )
        );
      case SubTaskStatus.notStarted:
        return (
          <>
            {isOfType(UserRoles.PortfolioManager) && (
              <Action
                onClick={() => actionHandler(SubTaskStatus.awaitingApproval)}
                targetStatus={SubTaskStatus.awaitingApproval}
                label="Revert to awaiting approval"
                Icon={HiArrowUturnLeft}
              />
            )}
            {isProfessional && (
              <Action
                onClick={() => actionHandler(SubTaskStatus.ongoing)}
                targetStatus={SubTaskStatus.ongoing}
                label="Begin task"
                Icon={TbFlag3}
              />
            )}
          </>
        );
      case SubTaskStatus.ongoing:
        return (
          isProfessional && (
            <>
              <Action
                onClick={() => actionHandler(SubTaskStatus.completed)}
                targetStatus={SubTaskStatus.completed}
                label="Mark as done"
                Icon={TbSquareCheck}
              />
              <Action
                onClick={() => actionHandler(SubTaskStatus.notStarted)}
                targetStatus={SubTaskStatus.notStarted}
                label="Move to not started"
                Icon={BsArrowsMove}
              />
            </>
          )
        );
      case SubTaskStatus.completed:
        return (
          <>
            {isOfType(UserRoles.ProjectOwner) && (
              <Action
                onClick={() => actionHandler(SubTaskStatus.verified)}
                targetStatus={SubTaskStatus.verified}
                label="Verify task"
                Icon={MdVerified}
              />
            )}
            {isProfessional && (
              <Action
                onClick={() => actionHandler(SubTaskStatus.ongoing)}
                targetStatus={SubTaskStatus.ongoing}
                label="Revert to in progress"
                Icon={HiArrowUturnLeft}
              />
            )}
          </>
        );
      case SubTaskStatus.verified:
        return (
          isOfType(UserRoles.ProjectOwner) && (
            <Action
              onClick={() => actionHandler(SubTaskStatus.notStarted)}
              targetStatus={SubTaskStatus.notStarted}
              label="Revert to not started"
              Icon={HiArrowUturnLeft}
            />
          )
        );
    }
  };

  const MenuOption = (
    <div
      ref={containerRef}
      className={` ${
        !showMenu && 'hidden'
      } bg-white ${subTaskUniqueClassName} shadow-md z-20 absolute w-fit right-2 top-2 p-1 rounded-md`}>
      {HelperActions()}
      {subTask.pendingUpdates?.status && isProfessional ? (
        <>
          <button
            onClick={() => loadCancelEdit(cancelEditSubTaskReq(subTask._id))}
            className={
              'flex w-full flex-nowrap items-center group hover:bg-blue-100 p-2 rounded-md' +
              hoverFade +
              subTaskUniqueClassName
            }>
            {isCancelingEdit ? (
              <AiOutlineLoading className="text-bblue animate-spin" />
            ) : (
              <IoIosClose className="text-bash text-xl group-hover:text-bblue mr-2" />
            )}
            <p className="text-sm font-Medium truncate flex-1 -translate-x-1 text-bash group-hover:text-bblue">
              Cancel Edit Request
            </p>
          </button>
          <button
            onClick={() => toggleModal('editRequest')}
            className={
              'flex w-full flex-nowrap items-center group hover:bg-blue-100 p-2 rounded-md' +
              hoverFade +
              subTaskUniqueClassName
            }>
            <TbGitCompare className="text-bash group-hover:text-gray-900 mr-2" />
            <p className="text-sm text-left font-Medium truncate flex-1 text-bash group-hover:text-gray-900">
              View changes
            </p>
          </button>
        </>
      ) : null}
      {subTask.deletionRequest?.status && isProfessional ? (
        <button
          onClick={() => loadCancelDelete(cancelDeleteSubTaskReq(subTask._id))}
          className={
            'flex w-full flex-nowrap items-center group hover:bg-red-100 p-2 rounded-md' +
            hoverFade +
            subTaskUniqueClassName
          }>
          {isCancelingDelete ? (
            <AiOutlineLoading className="text-bred animate-spin" />
          ) : (
            <IoIosClose className="text-bash text-xl group-hover:text-bred mr-2" />
          )}
          <p className="text-sm font-Medium truncate flex-1 -translate-x-1 text-bash group-hover:text-bred">
            Cancel Delete Request
          </p>
        </button>
      ) : null}
      {isProfessional ? (
        <button
          onClick={() => toggleModal('edit')}
          className={
            'flex w-full items-center group hover:bg-blue-100 p-2 rounded-md' +
            hoverFade +
            subTaskUniqueClassName
          }>
          <TbEdit className="text-bash group-hover:text-bblue mr-2" />
          <p className="text-sm font-Medium text-bash group-hover:text-bblue">Edit</p>
        </button>
      ) : null}
      <button
        {...{ onClick }}
        className={
          'flex w-full items-center group hover:bg-blue-100 p-2 rounded-md' +
          hoverFade +
          subTaskUniqueClassName
        }>
        <TbInfoCircle className="text-bash group-hover:text-bblue mr-2" />
        <p className="text-sm font-Medium text-bash whitespace-nowrap group-hover:text-bblue">
          {isActive ? 'Hide' : 'View'} Details
        </p>
      </button>
      {!subTask.deletionRequest?.status && isProfessional ? (
        <button
          onClick={() => {
            let { preConstructionStatus, status } = subTask;
            toggleModal(
              preConstructionStatus === 'draft' || status === SubTaskStatus.awaitingApproval
                ? 'deletePrompt'
                : isProfessional
                  ? 'deleteRequest'
                  : 'deletePrompt'
            );
          }}
          className={
            'flex w-full items-center group hover:bg-red-100 p-2 rounded-md' +
            hoverFade +
            subTaskUniqueClassName
          }>
          {isDeleting ? (
            <Loader />
          ) : (
            <TbTrash className="text-bash group-hover:text-red-500 mr-2" />
          )}
          <p className="text-sm font-Medium text-bash group-hover:text-red-500">Delete</p>
        </button>
      ) : null}
    </div>
  );

  return (
    <div
      key={`modal${subTask._id}`}
      className={` mx-1 mt-2 w-fit ${positionOnTop && 'top-0'}  ` + subTaskUniqueClassName}>
      <button
        className={
          subTaskUniqueClassName + hoverFade + `transform hover:bg-white rounded-full   p-2`
        }
        onClick={toggleMenu}>
        <TbDotsVertical className={'text-bash ' + subTaskUniqueClassName} />
      </button>
      {MenuOption}
    </div>
  );
};

export default SubTaskMenuDropDown;
