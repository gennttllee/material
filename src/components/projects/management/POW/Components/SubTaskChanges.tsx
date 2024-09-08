import { flexer } from 'constants/globalStyles';
import React, { Fragment, useContext, useMemo, useState } from 'react';
import { TbGitCompare, TbInfoCircleFilled } from 'react-icons/tb';
import Button from 'components/shared/Button';
import { yupResolver } from '@hookform/resolvers/yup';
import { reasonSchema } from 'validation/task';
import { useForm } from 'react-hook-form';
import { SubTask } from '../../types';
import moment from 'moment';
import useFetch from 'Hooks/useFetch';
import { dateFormat } from '../../../../../constants';
import { editSubTask, rejectSubTaskChange } from 'apis/tasks';
import { PMStoreContext } from '../../Context';
import { useParams } from 'react-router-dom';
import { displayError } from 'Utils';
import useRole from 'Hooks/useRole';

interface SubTaskChangesProps {
  subTask: SubTask;
  toggleModal: () => void;
  updateTaskAndSubtask: () => void;
}

const SubTaskChanges = ({ subTask, toggleModal, updateTaskAndSubtask }: SubTaskChangesProps) => {
  const { isProfessional } = useRole();
  const { powId } = useParams() as { powId: string };
  const [showReason, setShowReason] = useState(false);
  const {
    handleSubmit,
    register,
    formState: { errors }
  } = useForm<{ reason: string }>({
    reValidateMode: 'onChange',
    resolver: yupResolver(reasonSchema)
  });
  const { tasks } = useContext(PMStoreContext);
  const { load: loadApproving, isLoading: isApproving } = useFetch();
  const { load: loadDecline, isLoading: isDeclining } = useFetch();

  const submitDeclineReason = handleSubmit(({ reason }) => {
    loadDecline(rejectSubTaskChange(subTask._id, reason)).then(updateTaskAndSubtask);
  });

  const newDependencies = useMemo(() => {
    const data: string[] = [];
    if (!subTask.pendingUpdates || !subTask.pendingUpdates?.dependencies[0]) return [];

    for (const depId of subTask.pendingUpdates?.dependencies ?? []) {
      for (let i = 0; i < tasks[powId].length; i++) {
        let task = tasks[powId][i];
        for (let j = 0; j < task.subTasks.length; j++) {
          const { _id, name } = task.subTasks[j];
          if (_id === depId) {
            data.push(name);
            break;
          }
        }
      }
    }

    return data;
  }, [subTask.pendingUpdates, tasks, powId]);

  const oldDependencies = useMemo(() => {
    const data: string[] = [];
    if (!subTask.dependencies || !subTask.dependencies[0]) return [];

    for (const depId of subTask.dependencies) {
      for (let i = 0; i < tasks[powId].length; i++) {
        let task = tasks[powId][i];
        for (let j = 0; j < task.subTasks.length; j++) {
          const { _id, name } = task.subTasks[j];
          if (_id === depId) {
            data.push(name);
            break;
          }
        }
      }
    }

    return data;
  }, [subTask, tasks, powId]);

  const changes = useMemo(() => {
    return subTask.pendingUpdates
      ? Object.entries(subTask.pendingUpdates)
          .filter(([key]) => key !== 'user' && key !== 'status' && key !== 'reason')
          .filter(([key, value]) =>
            key === 'dependencies' // remove dependencies if item is there
              ? Array.isArray(value) && !value[0]
                ? false
                : true
              : true
          )
      : [];
  }, [subTask]);

  const handleApprove = () => {
    if (!changes) return displayError('No changes available');
    const payload: { [key: string]: any } = {};
    for (const [key, value] of changes) {
      payload[key] = value;
    }
    loadApproving(editSubTask(subTask._id, payload)).then(updateTaskAndSubtask);
  };

  return (
    <Fragment key={subTask._id}>
      <div className={flexer}>
        <div className={flexer}>
          <TbGitCompare className="text-byellow-1 text-xl group-hover:text-gray-900 mr-2" />
          <p className="capitalize font-Demibold text-xl truncate flex-1">{subTask.name}</p>
        </div>
        <button className="text-bash font-Medium" onClick={() => toggleModal()}>
          Close
        </button>
      </div>
      {subTask.pendingUpdates?.status === 'Rejected' && (
        <div className={flexer + 'gap-2 bg-red-100 rounded-md py-2 px-3 mt-3 -mb-3'}>
          <TbInfoCircleFilled className="text-bred" />
          <p className="text-bash font-Medium flex-1 truncate">
            The below changes have been declined
          </p>
        </div>
      )}
      {subTask.pendingUpdates?.status === 'Pending' && isProfessional ? (
        <div className={flexer + 'gap-2 bg-blue-100 rounded-md py-2 px-3 mt-3 -mb-3'}>
          <TbInfoCircleFilled className="text-bblue" />
          <p className="text-bash font-Medium flex-1 truncate">
            The below changes are awaiting approval
          </p>
        </div>
      ) : null}
      <p className="text-bash my-6">
        Some changes have been made to this subtask, they await your review
      </p>
      {subTask.pendingUpdates
        ? React.Children.toArray(
            changes.map(([key, value]) => (
              <FromTo
                title={key as keyof SubTask}
                from={
                  Array.isArray(value)
                    ? oldDependencies[0]
                      ? oldDependencies.join(',')
                      : 'Not Set'
                    : key === 'startDate'
                      ? moment(new Date(subTask.startDate.value)).format(dateFormat)
                      : String(
                          typeof subTask[key as keyof SubTask] === 'object'
                            ? //@ts-ignore
                              subTask[key as keyof SubTask]['value']
                            : subTask[key as keyof SubTask]
                        )
                }
                to={
                  Array.isArray(value)
                    ? newDependencies.join(',')
                    : key === 'startDate'
                      ? moment(new Date(value)).format(dateFormat)
                      : String(value)
                }
              />
            ))
          )
        : 'No Changes Available'}
      {showReason ? (
        <div className="w-full mt-4">
          <p className="text-bash">Reason for declining</p>
          <form
            onSubmit={submitDeclineReason}
            className={`border ${
              errors.reason?.message ? 'border-bred' : 'border-bblue'
            } rounded-md p-4 w-full`}
          >
            <textarea
              {...register('reason')}
              placeholder="State the reason"
              className="border-none w-full h-20 resize-none outline-none"
            />

            <div className={flexer + ` ${isProfessional && 'hidden'} w-full`}>
              <div />
              <div className={flexer + 'gap-2'}>
                <Button
                  text="Cancel"
                  type="secondary"
                  btnType="button"
                  onClick={() => setShowReason(false)}
                />
                <Button type="primary" text="Send" isLoading={isDeclining} />
              </div>
            </div>
          </form>
        </div>
      ) : subTask.pendingUpdates?.status !== 'Rejected' ? (
        <div className={flexer + `${isProfessional && 'hidden'}`}>
          <div />
          <div className={flexer + 'gap-2'}>
            <Button
              text="Decline"
              type="secondary"
              btnType="button"
              onClick={() => setShowReason(true)}
            />
            <Button
              type="primary"
              text="Approve"
              btnType="button"
              isLoading={isApproving}
              onClick={handleApprove}
            />
          </div>
        </div>
      ) : (
        <div className="w-full mt-4">
          <p className="text-bash">Reason for declining</p>
          <div className={`bg-pbg rounded-md p-4 w-full mt-1`}>
            <p className="text-black ">{subTask.pendingUpdates.reason}</p>
          </div>
        </div>
      )}
    </Fragment>
  );
};

export default SubTaskChanges;

const FromTo = ({ from, to, title }: { from: string; to: string; title: keyof SubTask }) => (
  <div className="rounded-md bg-pbg mb-4 p-5">
    <p className="font-Demibold test-sm text-black capitalize">{title} Changed</p>
    <div className="flex items-center flex-nowrap mt-3 gap-5">
      <p title={from} className="text-sm truncate">
        <span className="text-bash">From: </span>
        <span className="text-black font-Medium">
          {title === 'budget' ? Number(from).toLocaleString() : from}
        </span>
      </p>
      <p title={to} className="text-sm truncate flex-1">
        <span className="text-bash">To: </span>
        <span className="text-black font-Medium">
          {title === 'budget' ? Number(to).toLocaleString() : to}
        </span>
      </p>
    </div>
  </div>
);
