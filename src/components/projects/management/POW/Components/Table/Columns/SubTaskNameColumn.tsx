import { Row } from '@tanstack/react-table';
import {
  ProjectTask,
  StatusColors,
  SubTask,
  SubTaskStatus,
  SubTaskStatusBgs,
  SubTaskStatusColors
} from 'components/projects/management/types';
import React, { Fragment, useContext, useState } from 'react';
import { ModalTypes, ModalWrapper } from '../../SubTaskCard';
import { PMStoreContext } from 'components/projects/management/Context';
import { deleteSubTask, getOneTasks } from 'apis/tasks';
import SubTaskForm from '../../subTaskForm';
import SubTaskChanges from '../../SubTaskChanges';
import DeleteModal from 'components/shared/DeleteModal';
import StatusBanner from 'components/projects/bids/contractor/components/StatusBanner';
import Button from 'components/shared/Button';
import useRole, { UserRoles } from 'Hooks/useRole';
import useFetch from 'Hooks/useFetch';
import Modal from 'components/shared/Modal';
import { BsFillCheckCircleFill, BsFillCircleFill } from 'react-icons/bs';
import { TiWarning } from 'react-icons/ti';
import { flexer } from 'constants/globalStyles';

const SubTaskNameColumn = ({
  taskIndex,
  row: { index, original: subTask }
}: {
  taskIndex: number;
  row: Row<SubTask>;
}) => {
  const [showModal, setModal] = useState<{ key?: ModalTypes; status: boolean }>({ status: false });
  const { setContext } = useContext(PMStoreContext);
  const { isOfType } = useRole();

  const { load: deleteLoad, isLoading: isDeleting } = useFetch();

  const toggleModal = (key?: ModalTypes) => {
    // setShowEditModal((prev) => !prev);
    setModal((prev) => ({ status: !prev.status, key }));
  };

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

  const EditRequestUI = isOfType(UserRoles.Contractor) ? (
    <StatusBanner type="completed" className="!w-fit !mt-2" label="Awaiting Edit Approval" />
  ) : (
    !isOfType(UserRoles.Consultant) && (
      <Button
        btnHasEvent
        type="primary"
        className="!w-fit !mt-2 !px-2 !py-1 !text-sm"
        text="Review Pending Approval"
        onClick={(e) => {
          e?.stopPropagation();
          toggleModal('editRequest');
        }}
      />
    )
  );

  const DeleteRequestUI = isOfType(UserRoles.Contractor) ? (
    <StatusBanner type="not started" className="!w-fit !mt-2" label="Awaiting Delete Approval" />
  ) : (
    !isOfType(UserRoles.Consultant) && (
      <Button
        btnHasEvent
        type="danger"
        className="!w-fit !mt-2 !px-2 !py-1 !text-sm"
        text="Approve Deletion"
        onClick={(e) => {
          e?.stopPropagation();
          toggleModal('deletePrompt');
        }}
      />
    )
  );

  return (
    <Fragment>
      <div className="flex items-center gap-5 min-w-[200px] p-[16px]  h-full">
        {subTask.status === SubTaskStatus.completed ? (
          <div className=" rounded-full p-1px mr-2">
            <BsFillCheckCircleFill className="text-green-500 text-xs" />
          </div>
        ) : subTask.status === SubTaskStatus.awaitingApproval ? (
          <TiWarning className={`${StatusColors[subTask.status]} text-base mr-2`} />
        ) : (
          <BsFillCircleFill className={`${SubTaskStatusColors[subTask.status]} text-xs mr-2`} />
        )}
        <p className="text-black font-Medium text-sm truncate capitalize">{subTask.name}</p>
        <div className="transform -translate-y-1">
          {subTask.deletionRequest?.status
            ? DeleteRequestUI
            : subTask.pendingUpdates?.status
              ? EditRequestUI
              : null}
        </div>
      </div>
      <Modal
        overlayClassName="opacity-50 backdrop-blur-0"
        className="backdrop-blur-0 drop-shadow-lg"
        visible={showModal.status}
        toggle={toggleModal}
      >
        {ModalView()}
      </Modal>
    </Fragment>
  );
};

export default SubTaskNameColumn;
