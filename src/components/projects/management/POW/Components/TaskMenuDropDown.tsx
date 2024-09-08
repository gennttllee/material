import useFetch from 'Hooks/useFetch';
import React, { Fragment, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { ProjectTask, TaskStatus } from '../../types';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { taskSchema } from 'validation/task';
import { deleteTask, editTask } from 'apis/tasks';
import { PMStoreContext } from '../../Context';
import { centered, flexer, hoverFade } from 'constants/globalStyles';
import InputField from 'components/shared/InputField';
import Button from 'components/shared/Button';
import { TbDotsVertical, TbEdit, TbTrash, TbMessages } from 'react-icons/tb';
import { AiOutlineClose } from 'react-icons/ai';
import CustomModal from 'components/shared/CustomModal';
import DeleteIcon from 'assets/Sub-task/puzzle-18 1.svg';
import { useNavigate, useParams } from 'react-router-dom';
import MessagesModal from './MessagesModal';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setMessageModal } from 'store/slices/taskMessagesModalSlice';

const TaskMenuDropDown = (task: ProjectTask) => {
  const [showModal, setModal] = useState<{ status: boolean; index?: 1 | 0 }>({
    status: false
  });
  const navigate = useNavigate();
  const [showMenu, setMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isLoading: isEditLoading, load: editLoader } = useFetch();
  const { isLoading: isDelLoading, load: deleteLoader } = useFetch();
  const { powId, projectId, taskId } = useParams() as { [key: string]: string };
  const { setContext } = useContext(PMStoreContext);
  let dispatch = useAppDispatch();
  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ name: string; dependencies: any[] }>({
    resolver: yupResolver(taskSchema),
    reValidateMode: 'onChange'
  });

  const submitHandler = handleSubmit(
    ({
      name
      //    dependencies
    }) => {
      if (task) {
        const payload = {
          name
          //dependencies
        };
        //add dependencies if it has first items
        editLoader(editTask(task._id, payload)).then(() => {
          // update the task globally
          setContext((prev) => ({
            ...prev,
            activeTask: prev.activeTask ? { ...prev.activeTask, name } : undefined,
            tasks: {
              ...prev.tasks,
              [powId]: prev.tasks[powId].map((one) =>
                one._id === task._id ? { ...one, name } : one
              )
            }
          }));
          toggleModal();
        });
      }
    }
  );

  const handleDelete = () => {
    if (task)
      deleteLoader(deleteTask(task._id)).then((res) => {
        setContext((prev) => ({
          ...prev,
          activeTask: undefined,
          tasks: {
            ...prev.tasks,
            [powId]: prev.tasks[powId].filter((one) => one._id !== task._id)
          }
        }));
        // leave the task screen (page), if we are
        if (taskId) {
          navigate(`/projects/${projectId}/management/${powId}`);
        }
      });
  };

  // const dependenciesToIgnore = useMemo(() => {
  //   const response: string[] = [];

  //   if (!tasks[powId] || !task) return response;

  //   for (const task of tasks[powId]) {
  //     for (const { _id } of task.dependencies) {
  //       if (_id === task._id) {
  //         response.push(task._id);
  //       }
  //     }
  //   }

  //   return response;
  // }, [tasks]);

  const EditForm = (
    <div className="w-full">
      <div className={flexer + 'w-full'}>
        <p className="font-semibold">Edit Task</p>
        <button onClick={() => toggleModal()} className="text-bash text-sm">
          Close
        </button>
      </div>
      <form onSubmit={submitHandler} className="w-full">
        <div className="w-full my-5">
          <InputField
            autoFocus
            label="Task name"
            placeholder="Name here..."
            register={register('name')}
            error={errors.name?.message}
          />
        </div>
        <div className={' flex justify-end items-center'}>
          <Button text="Cancel" type="secondary" btnType="button" onClick={() => toggleModal()} />
          <Button text="Update" className="ml-5" isLoading={isEditLoading} />
        </div>
      </form>
    </div>
  );

  let messageModal = useAppSelector((m) => m.messageModal);

  const DeleteModal = (
    <div className="w-full">
      <div className={flexer}>
        <p className="font-semibold">Delete Task</p>
        <button onClick={() => toggleModal()} className="text-bash text-sm">
          Close
        </button>
      </div>
      <div className={centered + 'my-5 flex-col'}>
        {/* <Image src={DeleteIcon} /> */}
        <img loading="lazy" decoding="async" src={DeleteIcon} alt="icon" />
        <p className="text-xl font-Medium">Are you sure you want to delete?</p>
        <p className="text-bash font-Medium text-base">
          All progress and data gotten on this task will be lost
        </p>
      </div>
      <div className={centered}>
        <Button text="Cancel" type="secondary" onClick={() => toggleModal()} />
        <div className="mx-5" />
        <Button type="danger" text="Delete Task" onClick={handleDelete} isLoading={isDelLoading} />
      </div>
    </div>
  );

  const ModalView = useMemo(() => {
    switch (showModal.index) {
      case 0:
        return EditForm;
      case 1:
        return DeleteModal;
      default:
        return <></>;
    }
  }, [showModal.index, isDelLoading, isEditLoading]);

  const Modal = (
    <CustomModal
      className="z-20"
      visible={showModal.status}
      toggle={() => toggleModal()}
      overlayClassName="opacity-50"
      containerClassName="z-20 w-11/12 md:w-1/2 lg:w-[584px]">
      {ModalView}
    </CustomModal>
  );

  useEffect(() => {
    // click event that's in-charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (e.target && e.target.contains(menuRef.current)) {
        setMenu(false);
      }
    });

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setMenu(false);
      });
    };
  }, []);

  const toggleModal = (index?: 1 | 0) => {
    setModal((prev) => ({ status: !prev.status, index }));
  };

  const toggleMenu = () => {
    if (!showMenu) {
      reset({ name: task?.name, dependencies: task?.dependencies });
    }
    setMenu((prev) => !prev);
  };
  let message = useAppSelector((m) => m.messageModal);


  const switchModal = () => {
    dispatch(setMessageModal({ isOpen: true, taskId }));
  };
  const Menu = (
    <div
      ref={menuRef}
      className={` ${
        !showMenu && 'hidden'
      } bg-white absolute min-w-32  right-7 shadow-xl border-pbg border rounded-md p-2 `}>
      <div
        onClick={() => toggleModal(0)}
        className={'flex items-center group hover:bg-blue-100 p-2 rounded-md' + hoverFade}>
        <TbEdit className="text-blue-600 text-sm font-Medium" />
        <p className="text-blue-600 text-sm font-Medium ml-1">Edit</p>
      </div>
      <div
        onClick={(e) => {
          e.stopPropagation();
          switchModal();
        }}
        className={'flex items-center group hover:bg-blue-100 p-2 rounded-md' + hoverFade}>
        <TbMessages className="text-blue-600 text-sm font-Medium" />
        <p className="text-blue-600 text-sm whitespace-nowrap font-Medium ml-1">Leave comment</p>
      </div>
      {task.status === TaskStatus.awaitingApproval && (
        <div
          onClick={() => toggleModal(1)}
          className={'flex items-center group hover:bg-red-100 p-2 rounded-md pr-5' + hoverFade}>
          <TbTrash className="text-red-600 text-sm font-Medium" />
          <p className="text-red-600 text-sm font-Medium ml-1">Delete</p>
        </div>
      )}
    </div>
  );

  return (
    <Fragment>
      <div className="relative z-10">
        {Menu}
        <div onClick={toggleMenu} className={'p-2' + hoverFade}>
          {showMenu ? (
            <AiOutlineClose className={'text-bash text-sm'} />
          ) : (
            <TbDotsVertical className={'text-bash'} />
          )}
        </div>
      </div>
      {Modal}
      {messageModal.isOpen && (
        <MessagesModal
          taskId={messageModal.taskId || ''}
          closer={() => dispatch(setMessageModal({ isOpen: false, taskId: '' }))}
        />
      )}
    </Fragment>
  );
};

export default TaskMenuDropDown;
