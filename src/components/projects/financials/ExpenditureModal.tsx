import useFetch from 'Hooks/useFetch';
import React, { useContext, useMemo, useState } from 'react';
import Button from 'components/shared/Button';
import { recordExpenditure } from 'apis/financials';
import { yupResolver } from '@hookform/resolvers/yup';
import NumericInput from 'components/shared/NumericInput';
import SelectField from 'components/shared/SelectField';
import SuperModal from 'components/shared/SuperModal';
import TextArea from 'components/shared/TextArea';
import { flexer } from 'constants/globalStyles';
import { formatNumberWithCommas, parseNumberWithoutCommas } from 'helpers';
import { Controller, useForm } from 'react-hook-form';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { TFinance, closeModal, populate } from 'store/slices/financeSlice';
import { expenditureSchema } from 'validation/financials';
import { getTasksByProject } from 'apis/tasks';
import { useParams } from 'react-router-dom';
import { ProjectTask } from '../management/types';
import InputField from 'components/shared/InputField';
import { StoreContext } from 'context';

interface Form {
  taskId: string;
  title: string;
  amount: number;
  description?: string;
}

const ExpenditureModal = () => {
  const dispatch = useAppDispatch();
  const { projectId } = useParams();
  const [showTitle, setShowTitle] = useState(false);
  const { selectedProject } = useContext(StoreContext);
  const { data: finance } = useAppSelector((m) => m.finance);

  const { isLoading, load, success } = useFetch<TFinance>({
    onSuccess: (response) => {
      dispatch(populate(response));
      const id = setTimeout(() => {
        closeModalHandler();
        clearTimeout(id);
      }, 500);
    }
  });

  const { isLoading: TasksLoading, successResponse } = useFetch<ProjectTask[]>({
    onLoadRequest: getTasksByProject(projectId as string),
    showDisplayError: false
  });

  const {
    control,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<Form>({
    reValidateMode: 'onChange',
    resolver: yupResolver(expenditureSchema(showTitle))
  });

  const closeModalHandler = () => {
    dispatch(closeModal());
  };

  const submitHandler = handleSubmit((data) => {
    load(
      recordExpenditure({
        ...data,
        financeId: finance._id,
        amount: String(data.amount),
        title: showTitle ? data.title : undefined,
        taskId: showTitle ? undefined : data.taskId
      })
    );
  });

  const tasks = useMemo(() => {
    const data = [{ value: 'other', label: 'Other' }];
    if (!successResponse) return data;
    return successResponse.map((task) => ({ label: task.name, value: task._id })).concat(data);
  }, [successResponse]);

  return (
    <SuperModal closer={closeModalHandler} classes="bg-black bg-opacity-80 flex justify-center">
      <form
        onClick={(e) => {
          e.stopPropagation();
        }}
        onSubmit={submitHandler}
        className=" bg-white h-max mt-[10%] rounded-lg w-full max-w-[484px] p-6">
        <div className={flexer}>
          <p className="font-Medium text-xl">Record Expenditure</p>
          <button className="text-bash font-Medium" onClick={closeModalHandler}>
            Close
          </button>
        </div>
        <div className="my-3" />
        <Controller
          name="taskId"
          {...{ control }}
          render={({ field: { value, onChange } }) => (
            <SelectField
              data={tasks}
              label="Task"
              isLoading={TasksLoading}
              {...{ value }}
              onChange={(val) => {
                if (val === 'other') {
                  setShowTitle(true);
                } else if (showTitle) {
                  setShowTitle(false);
                }
                onChange(val);
              }}
              placeholder="e.g Substructure"
              error={errors.taskId?.message}
            />
          )}
        />
        {showTitle && (
          <InputField
            error={errors.title?.message}
            register={register('title')}
            placeholder="Expense title"
            label="Title"
            type="text"
          />
        )}
        <Controller
          name="amount"
          {...{ control }}
          render={({ field: { value, onChange, onBlur } }) => (
            <NumericInput
              onBlur={onBlur}
              value={formatNumberWithCommas(value)}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                const newValue = parseNumberWithoutCommas(e.target.value);
                if (/^[0-9e]*$/.test(newValue)) {
                  onChange(newValue);
                }
              }}
              placeholder={selectedProject.currency?.label || 'Enter...'}
              error={errors.amount?.message}
              label="Amount"
              type="text"
            />
          )}
        />
        <TextArea
          label="Description"
          register={register('description')}
          error={errors.description?.message}
          placeholder="Enter a  description"
        />
        <div className="my-5" />
        <div className="flex justify-end items-center gap-5">
          <Button text="Cancel" type="secondary" btnType="button" onClick={closeModalHandler} />
          <Button text="Submit Expenditure" {...{ isLoading, success }} />
        </div>
      </form>
    </SuperModal>
  );
};

export default ExpenditureModal;
