import { useEffect, useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { TbEdit, TbTrash } from 'react-icons/tb';
import Moment from 'react-moment';
import { deleteSubTask } from '../../../../../apis/tasks';
import { ProjectTask, SubTask, SubTaskStatus } from '../../types';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import useFetch from '../../../../../Hooks/useFetch';
import Modal from '../../../../shared/Modal';
import SubTaskForm from './subTaskForm';
import { useParams } from 'react-router-dom';

interface Props {
  subtask: SubTask;
}

const SubTaskCard = ({ subtask: initialSubtask }: Props) => {
  const { newTaskId: taskId } = useParams() as { [key: string]: string };
  const [subTask, setSubTask] = useState(initialSubtask);
  const [showModal, setModal] = useState(false);
  const { isLoading: isDeleting, success: isDeleted, load: loadDelete } = useFetch();
  //
  useEffect(() => {
    setSubTask(initialSubtask);
  }, [initialSubtask]);

  const { status, startDate, name, endDate, ...rest } = subTask;

  const isCompleted = status === SubTaskStatus.completed || status === SubTaskStatus.verified;

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const handleDelete = () => {
    loadDelete(deleteSubTask(rest._id));
  };

  const SubTaskView = (
    <div className="bg-white relative cursor-auto  w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg z-10">
      <SubTaskForm {...{ toggleModal, taskId }} initialValues={subTask} />
    </div>
  );

  return (
    <div
      className={
        `${isCompleted ? 'bg-green-100' : 'bg-blue-100'} p-4 rounded border-l-4 ${
          isCompleted ? 'border-green-600' : 'border-bblue'
        } mb-3 ${isDeleted && 'hidden'} ` + flexer
      }
    >
      <div className="flex-1">
        <p className="font-semibold text-base truncate capitalize">{name}</p>
        <p className="text-sm text-bash">
          <span>
            <Moment format="MMM Do">{startDate.value}</Moment>
          </span>
          <span className="mx-3">-</span>
          <span>
            <Moment format="MMM Do">{endDate}</Moment>
          </span>
        </p>
      </div>
      <div className="flex items-center">
        <TbEdit onClick={toggleModal} className={'text-bash text-lg' + hoverFade} />
        {isDeleting ? (
          <div className="ml-2">
            <AiOutlineLoading className={'text-bash animate-spin text-lg' + hoverFade} />
          </div>
        ) : (
          <TbTrash onClick={handleDelete} className={'text-bash text-lg ml-2' + hoverFade} />
        )}
      </div>
      <Modal toggle={toggleModal} visible={showModal}>
        {SubTaskView}
      </Modal>
    </div>
  );
};

export default SubTaskCard;
