import { yupResolver } from '@hookform/resolvers/yup';
import React, { Fragment, useContext, useMemo, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';
import { ProjectTask, SubTask, SubTaskStatus } from '../../types';
import { editSubTask, getOneTasks, requestSubTaskChange } from '../../../../../apis/tasks';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import SelectDate from '../../../../shared/SelectDate';
import { DateFormProps } from './SubTable/Components';
import useFetch from '../../../../../Hooks/useFetch';
import { PMStoreContext } from '../../Context';
import Button from '../../../../shared/Button';
import * as yup from 'yup';
import useRole from 'Hooks/useRole';

interface Props {
  powId: string;
  taskId: string;
  option: DateFormProps;
  toggleModal: () => void;
  callBack?: (subTask: SubTask) => void;
}

const subTaskDateSchema = (direction: 'above' | 'below', targetDate: Date, message: string) => {
  if (direction === 'above') {
    return yup
      .object({
        startDate: yup.date().min(targetDate, message).required('Provide this field')
      })
      .required();
  } else {
    return yup
      .object({
        startDate: yup.date().max(targetDate, message).required('Provide this field')
      })
      .required();
  }
};

const SubTaskDateForm = ({ toggleModal, callBack, option, taskId, powId }: Props) => {
  const { isProfessional } = useRole();
  const { setContext } = useContext(PMStoreContext);
  const [formChanged, setFormChanged] = useState(false);
  const { message, direction, initialValue, targetDate } = option;

  const schema = useMemo(() => {
    if (!targetDate || !direction || !message) return undefined;
    else return yupResolver(subTaskDateSchema(direction, targetDate, message));
  }, [targetDate, direction, message]);

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<{ startDate: Date }>({
    reValidateMode: 'onChange',
    defaultValues: !initialValue
      ? undefined
      : { startDate: new Date(initialValue.startDate.value) },
    resolver: schema
  });

  const { isLoading, load } = useFetch<{
    subTask: SubTask;
    task: ProjectTask;
  }>();

  const updateTaskAndSubtask = () => {
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

  const submitHandler = handleSubmit((data) => {
    load(
      (() => {
        if (isProfessional && initialValue.status !== SubTaskStatus.awaitingApproval) {
          // for professional request
          return load(requestSubTaskChange(initialValue._id, data));
        } else {
          return load(editSubTask(initialValue._id, data));
        }
      })()
    ).then((res) => {
      toggleModal();
      updateTaskAndSubtask();
      if (callBack) callBack(res.data.subTask);
      reset(); //reset form
    });
  });

  return (
    <Fragment>
      <div className={flexer + 'mb-5'}>
        <h3 className="font-semibold text-base">Update subtask</h3>
        <strong
          onClick={() => toggleModal()}
          className={'text-bash text-sm font-Medium' + hoverFade}
        >
          Close
        </strong>
      </div>
      <p className="text-xl text-center font-Medium px-10 text-bash my-5">
        <span>Update {initialValue.name} to start</span>
        <span className="text-bblue"> {message}</span>
      </p>
      <form onSubmit={submitHandler} className="w-full">
        <Controller
          {...{ control }}
          name="startDate"
          render={({ field: { onChange, value } }) => (
            <SelectDate
              {...{ value }}
              label="Current start date"
              placeholder="July 20, 2022"
              error={errors.startDate?.message}
              minDate={direction === 'above' ? targetDate : undefined}
              maxDate={direction === 'below' ? targetDate : undefined}
              onChange={(val, isUser) => {
                if (isUser && !formChanged) setFormChanged(true);
                const date = new Date(val.setHours(0, 0, 0, 0));
                onChange(date);
              }}
            />
          )}
        />
        <Button
          text="Save"
          className="w-full"
          {...{ isLoading }}
          type={formChanged ? 'primary' : 'muted'}
        />
      </form>
    </Fragment>
  );
};

export default SubTaskDateForm;
