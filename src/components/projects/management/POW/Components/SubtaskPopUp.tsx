import { ModalProps } from 'components/shared/Modal/Modal';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { SubTask, SubTaskStatus, SubTaskStatusBgs, SubTaskStatusColors } from '../../types';
import { flexer, hoverFade } from 'constants/globalStyles';
import { TbArrowLeft } from 'react-icons/tb';
import { BsFillCheckCircleFill, BsFillCircleFill } from 'react-icons/bs';
import StatusBanner from 'components/projects/bids/contractor/components/StatusBanner';
import CustomModal from 'components/shared/CustomModal/CustomModal';
import { PMStoreContext } from '../../Context';
import { useParams } from 'react-router-dom';
import Moment from 'react-moment';
import Switch from 'react-switch';
import ActionModal from 'components/shared/ActionModal';
import useFetch from 'Hooks/useFetch';
import { getOneSubTask } from 'apis/tasks';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import useRole from 'Hooks/useRole';
import Activity from './Activity';

interface SubtaskPopUpProps extends ModalProps {
  subtask: SubTask;
}

export default function SubtaskPopUp({ subtask, ...modalProps }: SubtaskPopUpProps) {
  const { powId } = useParams() as { [key: string]: string };
  const { tasks, handleContext, activeTask } = useContext(PMStoreContext);
  const [phaseGate, setPhaseGate] = useState(false);
  const [showModal, setModal] = useState(false);
  const { isProfessional } = useRole();

  const { load, isLoading, usageCount, setUsageCount, successResponse } = useFetch<SubTask>();

  useEffect(() => {
    setUsageCount(0);
  }, [modalProps.visible]);

  useEffect(() => {
    if (!usageCount && modalProps.visible) load(getOneSubTask(subtask._id));
  }, [subtask, modalProps.visible]);

  const dependencies = useMemo(() => {
    const data: {
      name: string;
      taskIndex: number;
      subTaskIndex: number;
      status: SubTaskStatus;
    }[] = [];

    for (const depId of subtask.dependencies) {
      for (let i = 0; i < tasks[powId].length; i++) {
        let task = tasks[powId][i];
        for (let j = 0; j < task.subTasks.length; j++) {
          const { _id, name, status } = task.subTasks[j];
          if (_id === depId) {
            data.push({ name, taskIndex: i, subTaskIndex: j, status });
            break;
          }
        }
      }
    }

    return data;
  }, [subtask, tasks]);

  const miniActivities = useMemo(() => {
    if (!successResponse || !successResponse.activities) return [];
    if (successResponse.activities.length > 3)
      return [...successResponse.activities].reverse().slice(0, 3);
    return [...successResponse.activities].reverse();
  }, [successResponse]);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const togglePhase = () => {
    setPhaseGate((prev) => !prev);
  };

  if (!modalProps.visible) return <></>;

  const ModalView = (
    <div className="bg-white rounded-md p-6 !pr-0 h-fit w-11/12 md:w-full max-w-[95%] md:max-w-400px md:min-w-[400px]">
      <button className={flexer + 'mb-5 w-full'} onClick={modalProps.toggle}>
        <TbArrowLeft className={'text-bblue' + hoverFade} />
        <p className={'text-bash text-base' + hoverFade}>Close</p>
      </button>
      <strong className="font-semibold text-xl truncate capitalize">{subtask.name}</strong>
      <div className={flexer + 'my-7'}>
        <p className="text-bash text-base w-1/3">Status</p>
        <div className="flex-1 flex items-center">
          {subtask.status === SubTaskStatus.completed ? (
            <div className="bg-white rounded-full p-1px">
              <BsFillCheckCircleFill className="text-green-500 text-[10px]" />
            </div>
          ) : (
            <BsFillCircleFill className={`${SubTaskStatusColors[subtask.status]} text-[10px]`} />
          )}
          <span className="text-base font-Medium text-black ml-2">{subtask.status}</span>
        </div>
      </div>
      <div className={flexer}>
        <p className="text-bash text-base w-1/3 mb-2">Duration</p>
        <p className="text-base text-black flex-1 truncate">
          {Number(subtask.duration.value).toFixed(0) + ' '} Days
        </p>
      </div>
      <div className={flexer + 'my-7'}>
        <p className="text-bash text-base w-1/3">Timeline</p>
        <p className="text-base text-black flex-1 truncate">
          <Moment format="MMM Do YYYY">{subtask.startDate.value}</Moment>
          <span className="mx-1">-</span>
          <Moment format="MMM Do YYYY">{subtask.endDate}</Moment>
        </p>
      </div>
      <div className="flex mt-2">
        <p className="text-bash text-base w-1/3">Predecessors</p>
        <div className="flex flex-wrap w-full gap-2 flex-1">
          {dependencies[0] ? (
            React.Children.toArray(
              dependencies.map(({ name, status }) => (
                <StatusBanner
                  label={name}
                  type="dormant"
                  className={`text-center ${SubTaskStatusBgs[status]} font-semibold !text-white`}
                />
              ))
            )
          ) : (
            <StatusBanner label="N/A" type="dormant" />
          )}
        </div>
      </div>

      {!successResponse || !successResponse.activities || !successResponse.activities[0] ? null : (
        <>
          <hr className="mt-8 mb-5" />
          <div className="w-full">
            <div className={flexer + 'mb-1'}>
              <div className={flexer}>
                <p className="font-Medium mr-2">Changes</p>
                {isLoading && (
                  <AiOutlineLoading3Quarters className="text-bblue text-sm animate-spin" />
                )}
              </div>
              {successResponse.activities.length > 3 && activeTask ? (
                <button
                  onClick={() => handleContext('activeSubTask', successResponse)}
                  className={'text-bblue font-Medium' + hoverFade}
                >
                  View more updates
                </button>
              ) : null}
            </div>
            <div className="bg-blue-50 rounded-md p-4 max-h-[200px] overflow-y-scroll">
              {React.Children.toArray(
                miniActivities.map((item, index) => <Activity {...{ ...item, index }} />)
              )}
            </div>
          </div>
        </>
      )}

      {!isProfessional && (
        <div className="flex items-center gap-14 mt-5">
          <p className="font-Medium">Phase gate</p>
          <Switch
            checked={phaseGate}
            checkedIcon={false}
            uncheckedIcon={false}
            onChange={() => {
              toggleModal();
            }}
          />
        </div>
      )}
    </div>
  );

  return showModal ? (
    <ActionModal
      visible={showModal}
      toggle={toggleModal}
      actionRequest={() => {
        togglePhase();
        toggleModal();
      }}
      actionLabel="Yes, I'm sure!"
      title="Phase Gate"
      description="All project operations will be paused"
      heading="Are you sure you want to initiate Phase gate?"
    />
  ) : (
    <CustomModal
      {...modalProps}
      key={subtask._id + 'popup'}
      overlayClassName="opacity-50 backdrop-blur-0"
      className="backdrop-blur-0 drop-shadow-lg"
    >
      {ModalView}
    </CustomModal>
  );
}
