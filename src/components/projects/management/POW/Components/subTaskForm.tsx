import { yupResolver } from '@hookform/resolvers/yup';
import React, { useContext, useMemo, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { TbDragDrop } from 'react-icons/tb';
import {
  createSubTask,
  editSubTask,
  getOneTasks,
  requestSubTaskChange
} from '../../../../../apis/tasks';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import { formatNumberWithCommas, parseNumberWithoutCommas } from 'helpers';
import NumericInput from 'components/shared/NumericInput/NumericInput';
import useFetch from '../../../../../Hooks/useFetch';
import { subTaskSchema } from '../../../../../validation/task';
import Button from '../../../../shared/Button';
import InputField from '../../../../shared/InputField';
import SelectDate from '../../../../shared/SelectDate';
import { PMStoreContext } from '../../Context';
import SubTaskDependencyPicker from './SubTaskDependencyPicker';
import { useParams } from 'react-router-dom';
import { ProjectTask, SubTask, SubTaskStatus } from '../../types';
import { displaySuccess } from 'Utils';
import { ChildComponentProps } from 'components/shared/CompleteModal/CompleteModal';
import useRole from 'Hooks/useRole';

interface Props extends Partial<ChildComponentProps> {
  taskId?: string;
  initialValues?: SubTask;
  callBack?: (subTask: SubTask) => void;
}

interface Form {
  name: string;
  budget?: number;
  duration?: number;
  plannedStartDate?: Date;
  startDate?: Date;
  dependencies: string[];
}

const SubTaskForm = ({ initialValues, toggleModal, callBack, taskId }: Props) => {
  const { isProfessional } = useRole();
  const { powId } = useParams() as { powId: string };
  const [formChanged, setFormChanged] = useState(false);
  const [formChanges, setFormChanges] = useState<string[]>([]);
  const { activeTask, tasks, setContext } = useContext(PMStoreContext);

  const getLastDate = () => {
    let end = 0;
    activeTask?.subTasks.forEach((element) => {
      end = Math.max(end, new Date(element?.endDate || null).getTime());
    });
    return end === 0 ? new Date() : new Date(end);
  };

  const defaultValues: Form = useMemo(
    () =>
      initialValues
        ? {
            name: initialValues.name,
            budget: initialValues.budget.value,
            duration: initialValues.duration.value,
            dependencies: initialValues.dependencies,
            startDate: new Date(initialValues.startDate.value)
          }
        : {
            name: '',
            dependencies: [],
            plannedStartDate: getLastDate()
          },
    [initialValues]
  );
  const {
    reset,
    control,
    setValue,
    register,
    clearErrors,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    defaultValues,
    reValidateMode: 'onChange',
    resolver: yupResolver(subTaskSchema)
  });

  const parentTaskId = taskId || activeTask?._id;

  const { isLoading, load } = useFetch();

  const updateTaskAndSubtask = () => {
    if (parentTaskId) {
      getOneTasks<ProjectTask[]>(parentTaskId).then((res) => {
        setContext((prev) => ({
          ...prev,
          activeTask: res.data[0], // update the task on the temporary variable
          tasks: {
            ...prev.tasks,
            [powId]: prev.tasks[powId].map((one) => (one._id === parentTaskId ? res.data[0] : one)) // update the task in the POW store
          }
        }));
      });
    }
  };

  const submitHandler = handleSubmit((data) => {
    if (!parentTaskId) return;

    const payload = {
      name: initialValues?.name === data.name ? undefined : data.name,
      task: parentTaskId,
      startDate: !formChanges.includes('startDate') ? undefined : data.startDate,
      dependencies:
        !data.dependencies[0] || !formChanges.includes('dependencies')
          ? undefined
          : data.dependencies,
      duration:
        initialValues?.duration.value === Number(data.duration) ? undefined : Number(data.duration),
      powId: powId || activeTask?.powId,
      plannedStartDate: data.plannedStartDate,
      budget: !initialValues
        ? data.budget
        : !formChanges.includes('budget')
          ? undefined
          : Number(data.budget)
    };

    (() => {
      if (initialValues) {
        const newPayload: { [key: string]: any } = {};

        for (const [key, value] of Object.entries(initialValues)) {
          // check for changed fields
          if (
            payload[key as keyof typeof payload] &&
            payload[key as keyof typeof payload] !== value
          ) {
            newPayload[key] = payload[key as keyof typeof payload];
          }
        }

        if (isProfessional && initialValues.status !== SubTaskStatus.awaitingApproval) {
          // for professional request
          return load(requestSubTaskChange(initialValues._id, newPayload));
        } else {
          return load(editSubTask(initialValues._id, newPayload));
        }
      } else {
        return load(createSubTask(payload));
      }
    })().then((res) => {
      if (toggleModal) toggleModal();
      updateTaskAndSubtask();
      displaySuccess(res.message);
      if (callBack) callBack(res.data.subTask);
      reset(); //reset form
    });
  });

  const handleCancel = () => {
    reset(defaultValues);
    clearErrors();
    if (toggleModal) toggleModal();
  };

  const dependenciesToIgnore = useMemo(() => {
    const response: string[] = [];

    if (!initialValues || !powId || !tasks[powId]) return response;

    for (const task of tasks[powId]) {
      for (const St of task.subTasks) {
        if (St.dependencies.includes(initialValues._id)) {
          response.push(St._id);
        }
      }
    }

    return response;
  }, [initialValues, powId, tasks]);

  return (
    <>
      <div className={flexer + 'mb-5'}>
        <h3 className="font-semibold text-base">
          {initialValues ? 'Edit Subtask' : 'Create Subtask'}
        </h3>
        <strong
          onClick={() => {
            if (toggleModal) toggleModal();
          }}
          className={'text-bash text-sm font-Medium' + hoverFade}>
          Close
        </strong>
      </div>
      <form
        onChange={(ev) => {
          if (!formChanged) {
            setFormChanged(true);
          }
        }}
        onSubmit={submitHandler}
        className="w-full">
        <InputField
          error={errors.name?.message}
          register={register('name')}
          placeholder="Foundation"
          label="Subtask name"
          autoFocus
        />
        <div className="flex items-start">
          <Controller
            name={initialValues ? 'startDate' : 'plannedStartDate'}
            control={control}
            render={({ field: { onChange, value } }) => {
              return (
                <SelectDate
                  initialValue={value}
                  value={value}
                  label="Start date"
                  minDate={new Date(0)}
                  placeholder={`July 20, ${new Date().getFullYear()}`}
                  error={
                    initialValues ? errors.startDate?.message : errors.plannedStartDate?.message
                  }
                  onChange={(val, userAction) => {
                    if (!formChanged && userAction) {
                      setFormChanged(true);
                    }
                    // if (userAction)
                    setFormChanges((prev) => [
                      ...prev,
                      initialValues ? 'startDate' : 'plannedStartDate'
                    ]);
                    const date = new Date(val.setHours(0, 0, 0, 0));
                    onChange(date);
                  }}
                />
              );
            }}
          />
          <div className="mx-2" />
          <NumericInput
            error={errors.duration?.message}
            register={register('duration')}
            placeholder="12 Days"
            label="Duration"
            type="number"
          />
        </div>
        <Controller
          name="budget"
          control={control}
          render={({ field: { onChange, onBlur, value } }) => (
            <NumericInput
              onBlur={onBlur}
              value={formatNumberWithCommas(value)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseNumberWithoutCommas(e.target.value);
                if (/^[0-9e]*$/.test(newValue)) {
                  onChange(newValue);
                  setFormChanges((prev) => [...prev, 'budget']);
                }
              }}
              error={errors.budget?.message}
              placeholder="20,000,000"
              label="Budget (optional)"
              type="text"
            />
          )}
        />
        <SubTaskDependencyPicker
          {...{ dependenciesToIgnore }}
          disabledOption={initialValues?._id}
          initialValue={initialValues?.dependencies}
          onChange={(value) => {
            if (!formChanged) {
              setFormChanged(true);
              setFormChanges((prev) => [...prev, 'dependencies']);
            }
            setValue('dependencies', value);
          }}
        />
        <div className={flexer + 'mt-5'}>
          <div
            title="Click and hold to move around"
            className={'flex items-center mr-auto max-w-1/4 cursor-grab ' + hoverFade}>
            <TbDragDrop className="text-xl text-gray-500" />
            <p className="text-ashShade-4 text-sm font-Medium truncate ml-2">Click & Hold...</p>
          </div>
          <div className={flexer}>
            <Button text="Cancel" btnType="button" type="secondary" onClick={handleCancel} />
            <Button
              text={initialValues ? 'Update' : 'Add subtask'}
              type={!formChanged ? 'muted' : 'primary'}
              {...{ isLoading }}
              className="ml-2"
            />
          </div>
        </div>
      </form>
    </>
  );
};

export default SubTaskForm;
