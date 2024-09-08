import { useForm } from 'react-hook-form';
import { ProjectTask } from '../../types';
import { TbDragDrop, TbPlus } from 'react-icons/tb';
import { yupResolver } from '@hookform/resolvers/yup';
import { createTask } from '../../../../../apis/tasks';
import { useNavigate, useParams } from 'react-router-dom';
import React, { useContext, useEffect, useRef, useState } from 'react';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import { taskSchema } from '../../../../../validation/task';
import TaskDependencyPicker from './TaskDependencyPicker';
import InputField from '../../../../shared/InputField';
import useFetch from '../../../../../Hooks/useFetch';
import useRole from '../../../../../Hooks/useRole';
import Button from '../../../../shared/Button';
import { PMStoreContext } from '../../Context';
import Modal from '../../../../shared/Modal';

type Form = {
  name: string;
  dependencies: any[];
};

export default function NewTaskBtn({ callBack }: { callBack?: () => void }) {
  const { role } = useRole();
  const navigation = useNavigate();
  const modalRef = useRef<HTMLDivElement>(null);
  const { setContext } = useContext(PMStoreContext);
  const { powId } = useParams() as { powId: string };
  const { isLoading, load } = useFetch<ProjectTask>();
  const [showModal, setModal] = useState({ status: false, active: 0 });
  const [addSubtaskAfterSubmission, setAddSubtask] = useState(false);

  useEffect(() => {
    let mousePosition;
    let offset = [0, 0];
    let isDown = false;
    const refCleanUpVariable: React.RefObject<HTMLDivElement>['current'] = modalRef.current;
    //
    if (refCleanUpVariable)
      refCleanUpVariable.addEventListener(
        'mousedown',
        (e) => {
          if (refCleanUpVariable) {
            isDown = true;
            offset = [
              // set offset
              refCleanUpVariable.offsetLeft - e.clientX,
              refCleanUpVariable.offsetTop - e.clientY
            ];
            refCleanUpVariable.style.cursor = 'grabbing'; // change mouse
          }
        },
        true
      );
    //
    document.addEventListener(
      'mouseup',
      () => {
        isDown = false;
        if (refCleanUpVariable) refCleanUpVariable.style.cursor = 'grab'; // reset mouse
      },
      true
    );
    //
    document.addEventListener(
      'mousemove',
      function (event) {
        event.preventDefault();
        if (isDown) {
          mousePosition = {
            x: event.clientX,
            y: event.clientY
          };
          if (refCleanUpVariable) {
            refCleanUpVariable.style.left = mousePosition.x + offset[0] + 'px';
            refCleanUpVariable.style.top = mousePosition.y + offset[1] + 'px';
          }
        }
      },
      true
    );

    return () => {
      refCleanUpVariable?.removeEventListener('mousedown', () => {});
      document.removeEventListener('mousedown', () => {});
      document.removeEventListener('mousemove', () => {});
    };
  }, [showModal]);

  useEffect(() => {
    if (showModal.status) {
      setFocus('name');
    }
  }, [showModal.status]);

  useEffect(() => {
    if (addSubtaskAfterSubmission) {
      submitHandler();
    }
  }, [addSubtaskAfterSubmission]);

  const toggleModal = (ModalId?: number) => {
    if (showModal) {
      clearErrors(); // reset the errors settings
      setAddSubtask(false); // reset the button settings
    }
    setModal(({ status }) => ({ status: !status, active: ModalId || 0 }));
  };

  const {
    reset,
    register,
    setFocus,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    reValidateMode: 'onChange',
    resolver: yupResolver(taskSchema)
  });

  const submitHandler = handleSubmit((data) => {
    load(
      createTask({
        ...data,
        powId
      })
    ).then((res) => {
      reset();
      setContext((prev) => ({
        ...prev,
        tasks: { ...prev.tasks, [powId]: [...prev.tasks[powId], res.data] }
      }));
      if (addSubtaskAfterSubmission) {
        navigation(`newTask/${res.data._id}`);
        setAddSubtask(false);
      } else {
        if (callBack) callBack();
        toggleModal();
      }
    });
  });

  const NewTaskModal = () => (
    <>
      <div className={flexer + 'mb-5'}>
        <h3 className="font-semibold text-base">Create Task</h3>
        <strong
          onClick={() => toggleModal()}
          className={'text-bash text-sm font-Medium' + hoverFade}
        >
          Close
        </strong>
      </div>
      <form className="w-full" onSubmit={submitHandler}>
        <InputField
          error={errors.name?.message}
          register={register('name')}
          placeholder="Foundation"
          label="Name"
        />
        <div className={flexer + 'mt-5'}>
          <Button
            onClick={() => {
              setAddSubtask(true);
            }}
            btnType="button"
            text="Add subtask"
            iconStyle="!text-bblue"
            textStyle="text-bblue text-sm font-Medium"
            isLoading={isLoading && addSubtaskAfterSubmission}
            LeftIcon={<TbPlus className="text-bblue mr-1" />}
            className="bg-transparent w-fit border-none !px-0 !py-0"
          />
          <div className="flex items-center ml-auto gap-2">
            <Button text="Cancel" type="secondary" btnType="button" onClick={() => toggleModal()} />
            <Button
              text="Submit"
              onClick={() => {
                setAddSubtask(false);
              }}
              isLoading={isLoading && !addSubtaskAfterSubmission}
            />
          </div>
        </div>
      </form>
    </>
  );

  const ModalView = (
    <div
      ref={modalRef}
      className="bg-white absolute cursor-auto  w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg z-10"
    >
      <NewTaskModal />
    </div>
  );

  return (
    <>
      <Button
        className={`${role !== 'contractor' && 'hidden'}`}
        LeftIcon={<TbPlus className="text-white" />}
        onClick={() => toggleModal()}
        textStyle="ml-2"
        text="Add task"
      />
      <Modal
        toggle={toggleModal}
        visible={showModal.status}
        className="backdrop-blur-0 drop-shadow-lg"
        overlayClassName="opacity-50 backdrop-blur-0"
      >
        {ModalView}
      </Modal>
    </>
  );
}
