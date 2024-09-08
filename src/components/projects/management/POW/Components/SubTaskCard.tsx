import StatusBanner from 'components/projects/bids/contractor/components/StatusBanner';
import { flexer, hoverFade } from 'constants/globalStyles';
import React, { ReactNode, useContext, useMemo, useState } from 'react';
import { TiWarningOutline } from 'react-icons/ti';
import { AiOutlineLoading } from 'react-icons/ai';
import { VscVerifiedFilled } from 'react-icons/vsc';
import { IoCheckbox } from 'react-icons/io5';
import { TbSquare } from 'react-icons/tb';
import Moment from 'react-moment';
import { SubTask as Type, SubTaskStatus, ProjectTask } from '../../types';
import useRole, { UserRoles } from '../../../../../Hooks/useRole';
import { PMStoreContext } from '../../Context';
import useFetch from '../../../../../Hooks/useFetch';
import {
  requestSubTaskDeletion,
  deleteSubTask,
  editSubTask,
  getOneTasks
} from '../../../../../apis/tasks';
import { canEditSubTask, isAwaiting } from '../helpers';
import { displayError } from 'Utils';
import SubTaskForm from './subTaskForm';
import SubtaskPopUp from './SubtaskPopUp';
import Modal from '../../../../shared/Modal';
import { useParams } from 'react-router-dom';
import Button from 'components/shared/Button';
import SubTaskChanges from './SubTaskChanges';
import DeleteModal from 'components/shared/DeleteModal';
import SubTaskMenuDropDown from './SubTaskMenuDropDown';

interface Props {
  type?: 'mini' | 'pro';
  hasBorder?: boolean;
  isActive?: boolean;
  canCheck?: boolean;
  className?: string;
  hasMenu?: boolean;
  taskId?: string;
  subTask: Type;
}

export type ModalTypes = 'edit' | 'editRequest' | 'deleteRequest' | 'deletePrompt';

export default function SubTaskCard({
  hasBorder = false,
  isActive = false,
  canCheck = true,
  hasMenu = false,
  type = 'mini',
  className,
  subTask
}: Props) {
  const { role, isOfType } = useRole();
  const { setContext } = useContext(PMStoreContext);
  const { powId } = useParams() as { powId: string };
  const [loadingStatus, setStatus] = useState<SubTaskStatus>();
  const [showModal, setModal] = useState<{ key?: ModalTypes; status: boolean }>({ status: false });
  const [showPopUp, setShowPopUP] = useState(false);
  const [isChecked] = useState(false);

  const { load: statusLoad, isLoading: isStatusLoading } = useFetch<{
    task: ProjectTask;
    subTask: Type;
  }>();

  const { load: deleteLoad, success: isDeleted, isLoading: isDeleting } = useFetch();

  const { load: deleteReqLoad, isLoading: isDeleteRequesting } = useFetch();

  const toggleModal = (key?: ModalTypes) => {
    // setShowEditModal((prev) => !prev);
    setModal((prev) => ({ status: !prev.status, key }));
  };

  const isSubTaskPastDueDate = useMemo(
    () => new Date(subTask.endDate).getTime() < Date.now(),
    [subTask]
  );

  // eslint-disable-next-line
  const toggleSelected = () => {
    const newRole = () => {
      switch (subTask.status) {
        case SubTaskStatus.awaitingApproval:
          return SubTaskStatus.notStarted;
        case SubTaskStatus.notStarted:
          return SubTaskStatus.ongoing;
        case SubTaskStatus.ongoing:
          return SubTaskStatus.completed;
        case SubTaskStatus.completed:
          return SubTaskStatus.verified;
        default:
          return SubTaskStatus.awaitingApproval;
      }
    };

    actionHandler(newRole());
  };

  const actionHandler = (status: SubTaskStatus) => {
    // subTask.status = status;
    if (!canEditSubTask({ origin: subTask.status, dest: status, role })) {
      return displayError('Action not allowed');
    }

    setStatus(status); // use to tie a loader to only one button #Action
    statusLoad(editSubTask(subTask._id, { status })).then((res) => {
      setContext((prev) => {
        if (!prev.activeTask) return prev;

        const newSubTask = { ...subTask, status };

        const newSubtaks = prev.activeTask.subTasks.map((one) =>
          one._id === newSubTask._id ? res.data.subTask : one
        );

        const newTask = {
          ...prev.activeTask,
          subTasks: newSubtaks,
          status: res.data.task.status
        };

        return {
          ...prev,
          activeTask: newTask,
          tasks: {
            ...prev.tasks,
            [powId]: prev.tasks[powId].map((t) => (t._id === prev.activeTask?._id ? newTask : t))
          }
        };
      });
    });
  };

  const canCheckByRole = useMemo(() => {
    const ProfessionalJSX =
      subTask.status === SubTaskStatus.notStarted || subTask.status === SubTaskStatus.ongoing ? (
        <button onClick={toggleSelected}>
          {!isChecked ? (
            <TbSquare className={'text-bash text-2xl mr-3' + hoverFade} />
          ) : (
            <IoCheckbox className={'text-bblue text-2xl mr-3' + hoverFade} />
          )}
        </button>
      ) : (
        subTask.status === SubTaskStatus.awaitingApproval && (
          <TiWarningOutline className="text-bash text-2xl mr-3" />
        )
      );

    switch (role) {
      case UserRoles.Consultant:
        return ProfessionalJSX;
      case UserRoles.Contractor:
        return ProfessionalJSX;
      case UserRoles.ProjectOwner:
        return <></>;
      case UserRoles.PortfolioManager:
        return subTask.status === SubTaskStatus.awaitingApproval ? (
          !isChecked ? (
            <TbSquare onClick={toggleSelected} className={'text-bash text-2xl mr-4' + hoverFade} />
          ) : (
            <IoCheckbox
              onClick={toggleSelected}
              className={'text-bblue text-2xl mr-4' + hoverFade}
            />
          )
        ) : subTask.status === SubTaskStatus.completed ||
          subTask.status === SubTaskStatus.verified ? (
          !isChecked ? (
            <TbSquare onClick={toggleSelected} className={'text-bash text-2xl mr-4' + hoverFade} />
          ) : (
            <IoCheckbox
              onClick={toggleSelected}
              className={'text-bblue text-2xl mr-4' + hoverFade}
            />
          )
        ) : (
          <TiWarningOutline className="text-bash text-2xl mr-3" />
        );
    }
  }, [subTask.status, toggleSelected, isChecked, role]);

  const updateTaskAndSubtask = () => {
    const taskId = subTask.task,
      powId = subTask.powId;
    getOneTasks<ProjectTask[]>(taskId)
      .then((res) => {
        setContext((prev) => ({
          ...prev,
          activeTask: res.data[0], // update the task on the temporary variable
          tasks: {
            ...prev.tasks,
            [powId]: prev.tasks[powId].map((one) => (one._id === taskId ? res.data[0] : one)) // update the task in the POW store
          }
        }));
      })
      .finally(toggleModal);
  };

  const EditSubtaskModal = (
    <ModalWrapper>
      <SubTaskForm {...{ toggleModal }} initialValues={subTask} />
    </ModalWrapper>
  );

  const subtaskChangesModal = (
    <ModalWrapper>
      <SubTaskChanges {...{ subTask, toggleModal, updateTaskAndSubtask }} />
    </ModalWrapper>
  );

  const ModalView = () => {
    switch (showModal.key) {
      case 'edit':
        return EditSubtaskModal;
      case 'editRequest':
        return subtaskChangesModal;
      case 'deletePrompt':
        return (
          <DeleteModal
            deleteRequest={() => deleteLoad(deleteSubTask(subTask._id)).then(updateTaskAndSubtask)}
            submitBtnText="Delete Subtask"
            isLoading={isDeleteRequesting}
            title="Delete Subtask"
            toggle={toggleModal}
            visible
          />
        );
      case 'deleteRequest':
        return (
          <DeleteModal
            deleteRequest={() => {
              deleteReqLoad(requestSubTaskDeletion(subTask._id)).then(updateTaskAndSubtask);
            }}
            description="All progress and data gotten on this subtask will be lost"
            submitBtnText="Delete Subtask"
            isLoading={isDeleting}
            title="Delete Subtask"
            toggle={toggleModal}
            visible
          />
        );
      default:
        return <></>;
    }
  };

  const Loader = () => <AiOutlineLoading className="text-bash mr-2 animate-spin" />;

  const onClick = () => {
    setShowPopUP((prev) => !prev);
  };

  const EditRequestUI =
    isOfType(UserRoles.Contractor) || subTask.pendingUpdates?.status === 'Rejected' ? (
      <StatusBanner
        type="completed"
        className={'!w-fit !mt-2' + hoverFade}
        label={
          subTask.pendingUpdates?.status === 'Pending'
            ? 'Awaiting Edit Approval'
            : 'Changes Declined'
        }
        onClick={(e) => {
          e?.stopPropagation();
          toggleModal('editRequest');
        }}
      />
    ) : (
      !isOfType(UserRoles.Consultant) && (
        <Button
          btnHasEvent
          type="primary"
          className="!w-fit !mt-2 !px-2 !py-1 !text-sm"
          text="Review Request"
          onClick={(e) => {
            e?.stopPropagation();
            toggleModal('editRequest');
          }}
        />
      )
    );

  const DeleteRequestUI =
    isOfType(UserRoles.Contractor) || subTask.deletionRequest?.status === 'Rejected' ? (
      <StatusBanner
        type="not started"
        className="!w-fit !mt-2"
        label={
          subTask.deletionRequest?.status === 'Pending'
            ? 'Awaiting Delete Approval'
            : 'Deletion Declined'
        }
      />
    ) : (
      !isOfType(UserRoles.Consultant) && (
        <Button
          btnHasEvent
          type="danger"
          className="!w-fit !mt-2 !px-2 !py-1 !text-sm"
          text="Confirm Delete"
          onClick={(e) => {
            e?.stopPropagation();
            toggleModal('deletePrompt');
          }}
        />
      )
    );

  return (
    <div className={`mb-5 flex justify-between bg-pbg rounded-md  relative w-full ${isDeleted && 'hidden'} ${className}`}>
      {!canCheck ? null : isStatusLoading ? (
        <Loader />
      ) : subTask.status === SubTaskStatus.awaitingApproval ? (
        canCheckByRole // only show when a task is in awaiting approval
      ) : null}

      <div
        {...{ onClick }}
        className={`${type === 'pro' ? flexer : 'grid'} ${
          !canCheck && 'flex-col'
        } ${hoverFade} rounded-md flex-1    ${hasBorder && 'border border-ashShade-4'} `}>
        <div className={`${type === 'mini' ? 'flex-1' : 'w-7/12'} py-5 pl-3 `}>
          <div className="flex items-center flex-1">
            <p
              className={`font-Medium w-full ${
                isAwaiting(subTask.status) ? 'text-bash' : 'text-black'
              } capitalize text-base whitespace-normal `}>
              {subTask.name}
            </p>
            {subTask.status === SubTaskStatus.verified && (
              <VscVerifiedFilled className="text-bgreen-0 text-lg ml-1" />
            )}
          </div>
          <p
            className={`${!isSubTaskPastDueDate ? 'text-bash' : 'text-red-600'} text-sm text-left`}>
            <Moment format="MMM Do">{subTask.startDate.value}</Moment>
            <span className="mx-1">-</span>
            <Moment format="MMM Do">{subTask.endDate}</Moment>
          </p>

          {type === 'mini' &&
            (subTask.deletionRequest?.status
              ? DeleteRequestUI
              : subTask.pendingUpdates?.status
                ? EditRequestUI
                : null)}
        </div>

        {type === 'pro' && (
          <div className={'w-4/12 transform -translate-x-32' + flexer}>
            <p className="text-black text-sm">{Number(subTask.duration.value).toFixed(0)} Days</p>
            {subTask.deletionRequest?.status
              ? DeleteRequestUI
              : subTask.pendingUpdates?.status
                ? EditRequestUI
                : null}
          </div>
        )}
      </div>

      {hasMenu && (
        <SubTaskMenuDropDown
          {...{
            subTask,
            onClick,
            isActive,
            isDeleting,
            toggleModal,
            actionHandler,
            loadingStatus,
            isStatusLoading
          }}
          positionOnTop={
            type === 'mini' &&
            (!!subTask.deletionRequest?.status || !!subTask.pendingUpdates?.status)
          }
        />
      )}

      <SubtaskPopUp subtask={subTask} toggle={onClick} visible={showPopUp} />

      <Modal
        overlayClassName="opacity-50 backdrop-blur-0"
        className="backdrop-blur-0 drop-shadow-lg"
        visible={showModal.status}
        toggle={toggleModal}>
        {ModalView()}
      </Modal>
    </div>
  );
}

export const ModalWrapper = ({ children }: { children: ReactNode }) => (
  <div className="bg-white absolute cursor-auto  w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg z-10">
    {children}
  </div>
);
