import { yupResolver } from '@hookform/resolvers/yup';
import Button from 'components/shared/Button';
import InputField from 'components/shared/InputField';
import Modal from 'components/shared/Modal';
import { flexer, hoverFade } from 'constants/globalStyles';
import React, { useContext, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { TbArrowNarrowLeft, TbChevronLeft, TbEdit, TbPlus } from 'react-icons/tb';
import { displayError } from 'Utils';
import { ProjectTask } from '../../types';
import { editTask, getOneTasks } from '../../../../../apis/tasks';
import useFetch from '../../../../../Hooks/useFetch';
import { taskSchema } from '../../../../../validation/task';
import SubTaskCard from './newSubTaskCard';
import SubTaskForm from './subTaskForm';
import { PMStoreContext } from '../../Context';
import { useNavigate, useParams } from 'react-router-dom';
import Loader from 'components/shared/Loader';

const NewTask = () => {
  const { newTaskId, powId, projectId } = useParams() as {
    [key: string]: string;
  };
  const [showModal, setModal] = useState({ status: true, active: 1 });
  const { handleContext, activeTask, setContext } = useContext(PMStoreContext);
  const { isLoading, load } = useFetch<ProjectTask[]>();
  const navigate = useNavigate();

  useEffect(() => {
    handleFetch();
  }, []);

  const handleFetch = async (isExiting?: boolean) => {
    return load(getOneTasks(newTaskId)).then((res) => {
      // handleContext("activeTask", res.data[0]);

      setContext((prev) => {
        const newTasks = { ...prev.tasks };

        if (prev.tasks[powId]) {
          // find if it exists
          const exists = prev.tasks[powId].find((one) => one._id === newTaskId);
          if (exists) {
            // if exists, update the version
            newTasks[powId] = newTasks[powId].map((one) =>
              one._id === newTaskId ? res.data[0] : one
            );
          } else {
            // if doesn't exists, append a new one
            newTasks[powId] = [...newTasks[powId], res.data[0]];
          }
        } else {
          newTasks[powId] = res.data;
        }

        return {
          ...prev,
          tasks: newTasks,
          activeTask: isExiting ? undefined : res.data[0]
        };
      });
    });
  };

  const {
    reset,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ name: string }>({
    reValidateMode: 'onChange',
    resolver: yupResolver(taskSchema)
  });

  const submitHandler = handleSubmit(({ name }) => {
    if (activeTask) {
      const payload = { name };
      load(editTask(newTaskId, payload)).then(() => {
        handleContext('activeTask', { ...activeTask, name });
        toggleModal();
      });
    }
  });

  const toggleModal = (ModalId?: number) => {
    setModal(({ status }) => ({ status: !status, active: ModalId || 0 }));
  };

  const editTaskModal = (
    <>
      <div className={flexer + 'mb-5'}>
        <h3 className="font-semibold text-base">Edit Task</h3>
        <strong
          onClick={() => toggleModal()}
          className={'text-bash text-sm font-Medium' + hoverFade}
        >
          Close
        </strong>
      </div>
      <form onSubmit={submitHandler}>
        <InputField
          register={register('name')}
          error={errors.name?.message}
          placeholder="Foundation"
          label="Name"
        />
        <Button text="Save" {...{ isLoading }} className="w-full mt-5" />
      </form>
    </>
  );

  const ModalView = (
    <div className="bg-white relative cursor-auto  w-11/12 md:w-1/2 lg:w-1/3 h-fit p-6 flex-col rounded-lg z-10">
      {(() => {
        switch (showModal.active) {
          case 0:
            return editTaskModal;
          default:
            return <SubTaskForm taskId={newTaskId} {...{ toggleModal }} />;
        }
      })()}
    </div>
  );

  const handleExit = () => {
    handleFetch(true).then(() => {
      navigate(`/projects/${projectId}/management/${powId}`);
    });
  };

  if (!activeTask) return <Loader />;

  const header = (
    <div className={flexer + 'relative mt-5 mb-2'}>
      <div
        className={'flex md:hidden items-center mb-3' + hoverFade}
        onClick={() => {
          if (!activeTask.subTasks[0]) {
            displayError('Your must atleast add one subtask, and then submit');
          } else {
            handleExit();
          }
        }}
      >
        <TbChevronLeft className="text-bash" />
        <p className="text-bash">Back</p>
      </div>
      <div
        className={'flex items-center cursor-pointer' + hoverFade}
        onClick={() => {
          if (!activeTask.subTasks[0]) {
            displayError('Your must at-least add one subtask, and then submit');
          } else {
            handleExit();
          }
        }}
      >
        <TbArrowNarrowLeft className="text-bblue text-xl mr-2" />
        <p className="text-black text-sm">Back</p>
      </div>
    </div>
  );

  return (
    <div className="h-full">
      {header}
      <div className={flexer + 'bg-white rounded-md p-6 w-full md:w-1/2 my-5'}>
        <h1 className="font-Medium text-2xl capitalize">{activeTask.name}</h1>
        <TbEdit
          className={'text-ashShade-4' + hoverFade}
          onClick={() => {
            reset({ name: activeTask.name });
            toggleModal(0);
          }}
        />
      </div>
      <div className="bg-white p-6 rounded-md w-full md:w-1/2">
        <h3 className="font-semibold font-base">Subtasks</h3>
        <div className="mt-5 max-h-64 h-fit overflow-y-scroll">
          {React.Children.toArray(
            activeTask.subTasks && activeTask.subTasks[0]
              ? activeTask.subTasks.map((subtask) => <SubTaskCard {...{ subtask }} />)
              : null
          )}
        </div>
        <div
          onClick={() => toggleModal(1)}
          className={'flex items-center ml-auto w-fit my-6' + hoverFade}
        >
          <TbPlus className="text-borange mr-1" />
          <strong className="text-borange text-sm font-Medium">Add subtask</strong>
        </div>
        <Button
          onClick={handleExit}
          type={activeTask.subTasks && activeTask.subTasks[0] ? 'primary' : 'muted'}
          isLoading={isLoading && !!activeTask}
          className="w-full mt-2"
          text="Submit"
        />
      </div>
      <Modal toggle={toggleModal} visible={showModal.status}>
        {ModalView}
      </Modal>
    </div>
  );
};

export default NewTask;
