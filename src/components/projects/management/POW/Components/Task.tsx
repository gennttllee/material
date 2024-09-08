import React, { memo, useContext, useEffect } from 'react';
import { centered } from '../../../../../constants/globalStyles';
import noContentImg from '../../../../../assets/nocontent.svg';
import { useNavigate, useParams } from 'react-router-dom';
import { getOneTasks } from '../../../../../apis/tasks';
import useFetch from '../../../../../Hooks/useFetch';
import { getOnePow } from '../../../../../apis/pow';
import { POW, ProjectTask } from '../../types';
import { PMStoreContext } from '../../Context';
import Loader from '../../../../shared/Loader';
import TaskBreadCram from './TaskBreadCram';
import TaskProgress from './TaskProgress';
import Activities from '../Activities';
import { displayError } from 'Utils';
import TaskViews from './TaskViews';

const TaskView = () => {
  const navigate = useNavigate();
  const { load: powLoad, error: powError } = useFetch<POW[]>();
  const { load: taskLoad, error: taskError } = useFetch<ProjectTask[]>();
  const { powId, taskId, projectId } = useParams() as { [key: string]: string };
  const { tasks, activePow, setContext, activeTask, activeSubTask } = useContext(PMStoreContext);

  useEffect(() => {
    if (tasks[powId] && (!activeTask || activeTask?._id !== taskId)) {
      setContext((prev) => ({
        ...prev,
        activeTask: tasks[powId].find((one) => one._id === taskId)
      }));
    } else if (!tasks[powId]) {
      (async () => {
        try {
          const taskRes = await taskLoad(getOneTasks(taskId)).then((res) => res.data);
          const powRes = await powLoad(getOnePow(powId)).then((powRes) => powRes.data);
          setContext((prev) => ({
            ...prev,
            pows: powRes,
            activePow: powRes[0],
            tasks: { [powId]: taskRes },
            activeTask: taskRes ? taskRes.find((one: any) => one._id === taskId) : undefined
          }));
        } catch (er) {
          displayError('Pow or task is invalid, please check your link, and try again');
        }
      })();
    }
  }, [powId, powLoad, setContext, taskId, taskLoad, tasks, activeTask]);

  const goBack = (index: number) => {
    if (activeTask) {
      setContext((prev) => ({
        ...prev,
        activeTask: undefined,
        tasks: {
          ...prev.tasks,
          [powId]: prev.tasks[powId].map((one) => (activeTask?._id === one._id ? activeTask : one))
        }
      }));
    }
    if (index === -2) {
      navigate(`/projects/${projectId}/management`);
    } else {
      navigate(`/projects/${projectId}/management/${powId}`);
    }
  };

  const Header = (
    <TaskBreadCram {...{ goBack }} taskName={activeTask?.name} powName={activePow?.name} />
  );

  if (taskError || powError || !activeTask)
    return (
      <>
        {Header}
        <div className={centered + 'h-full flex-col'}>
          <img alt="" loading="lazy" decoding="async" src={noContentImg} className=" w-56 h-56" />
          <h1 className="font-bold text-2xl mt-6 mb-2">
            {taskError} {powError}
          </h1>
          <p className="text-bash text-base text-center mb-5">
            please check the spelling and come back, you would see the task description here
          </p>
        </div>
      </>
    );

  if (!activePow) return <Loader />;

  if (activeSubTask) return <Activities />;

  return (
    <div className="h-full w-full">
      {Header}
      <TaskProgress />
      <TaskViews />
    </div>
  );
};

export default memo(TaskView);
