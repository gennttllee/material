import Moment from 'react-moment';
import { HiChevronUpDown } from 'react-icons/hi2';
import { TbCalendar, TbMessages } from 'react-icons/tb';
import { memo, useContext, useEffect, useMemo, useState } from 'react';
import { ConstructionStatus, StatusBgs, SubTaskStatus } from '../../types';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import StatusLabel from '../../../../shared/StatusLabel';
import { useNavigate, useParams } from 'react-router-dom';
import { dateFormat } from '../../../../../constants';
import TaskMenuDropDown from './TaskMenuDropDown';
import { PMStoreContext } from '../../Context';
import { isAwaiting } from '../helpers';
import { useAppDispatch } from 'store/hooks';
import { setMessageModal } from 'store/slices/taskMessagesModalSlice';
import { getEndDateFromTaskList, getStartDateFromTaskList } from './PowCard';

const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

const TaskProgress = () => {
  const { powId, projectId } = useParams() as { [key: string]: string };
  const { tasks, activeTask } = useContext(PMStoreContext);
  const [taskProgress, setTaskProgress] = useState({ percentage: 0, diff: 0 });
  const [tracker, setTracker] = useState<'Sub task' | 'Duration'>('Duration');
  const [{ hasEnded, hasStarted }, setPosition] = useState({
    hasStarted: false,
    hasEnded: false
  });
  /** Others */
  const { startDate, endDate } = useMemo(() => {
    //
    console.log(activeTask);
    if (activeTask && activeTask?.subTasks.length > 0) {
      let res = {
        startDate: getStartDateFromTaskList([activeTask]),
        endDate: getEndDateFromTaskList([activeTask])
      }
      console.log(res)
      return res;
    } else return { startDate: null, endDate: null };
  }, [activeTask]);

  const today = useMemo(() => new Date(date).getTime(), []);
  const start = useMemo(() => (startDate ? new Date(startDate).getTime() : null), [startDate]);
  const end = useMemo(() => (endDate ? new Date(endDate).getTime() : null), [endDate]);
  const navigate = useNavigate();
  //
  useEffect(() => {
    if (activeTask && tasks[powId]) {
      // check to see if the task has been deleting
      const exist = tasks[powId].find((one) => one._id === activeTask._id);
      if (!exist) {
        navigate(`/projects/${projectId}/management/${powId}`);
      }
    }
  }, [tasks, activeTask]);
  //
  useEffect(() => {
    // check the time line
    if (start && end) {
      const hasStarted = today >= start;
      const hasEnded = today > end;

      setPosition({ hasStarted, hasEnded });

      const diff = hasEnded ? 0 : end - today;

      const dayDiff = diff / (1000 * 60 * 60 * 24);

      const totalDiff = end - start;
      const totalDaysDiff = totalDiff / (1000 * 60 * 60 * 24);
      const percentage = 100 - (dayDiff * 100) / totalDaysDiff;

      setTaskProgress({
        percentage,
        diff: hasEnded ? 0 : +dayDiff.toFixed(0)
      });
    }
  }, [start, end, today]);
  //
  useEffect(() => {
    if (end) {
      let percentage: number = 0,
        dayDiff: number = 0;
      if (!tracker || tracker === 'Duration') {
        const diff = hasEnded ? 0 : end - today;
        dayDiff = diff / (1000 * 60 * 60 * 24);
        const totalDiff = !start ? 0 : end - start;
        const totalDaysDiff = totalDiff / (1000 * 60 * 60 * 24);
        percentage = 100 - (dayDiff * 100) / totalDaysDiff;
      } else if (activeTask) {
        const readyTasks = activeTask.subTasks.filter(
          (one) => one.status === SubTaskStatus.verified
        );
        dayDiff = activeTask.subTasks.length - readyTasks.length;
        percentage = (readyTasks.length / activeTask.subTasks.length) * 100;
      }

      setTaskProgress({
        percentage,
        diff: hasEnded ? 0 : +dayDiff.toFixed(0)
      });
    }
  }, [tracker, end, start]);

  const toggleTracker = () => {
    setTracker((prev) => (prev === 'Duration' ? 'Sub task' : 'Duration'));
  };
  let dispatch = useAppDispatch();
  const toggleMessageModal = () => {
    dispatch(setMessageModal({ isOpen: true, taskId: activeTask?._id }));
  };
  const SubTasksAwaitingApproval = activeTask?.subTasks.filter(
    (one) => one.status === SubTaskStatus.awaitingApproval
  );

  const NotificationLabels = SubTasksAwaitingApproval && SubTasksAwaitingApproval[0] && (
    <StatusLabel
      type="pending"
      title="Awaiting Approval"
      description={`You have ${
        SubTasksAwaitingApproval.length > 1 ? 'subtasks that are' : 'a subtask that is'
      } not approved`}
    />
  );

  const Progress = (
    <div className="bg-white p-6 rounded-md my-3">
      <div className={flexer + 'mt-4'}>
        <h2 className="font-semibold text-3xl truncate capitalize">{activeTask?.name}</h2>
        <div className={flexer + 'ml-1'}>
          <TbMessages onClick={toggleMessageModal} className={hoverFade + 'text-bash text-base'} />
          <p className="text-sm text-bash ml-1">{activeTask?.messages}</p>
          {activeTask ? <TaskMenuDropDown {...activeTask} /> : null}
        </div>
      </div>
      <div className="my-6">
        <div className={flexer}>
          <div className={'flex items-center py-2 gap-1 group' + hoverFade} onClick={toggleTracker}>
            <HiChevronUpDown className="text-bash text-base group-hover:scale-110 " />
            <p className="text-sm font-Medium">{tracker}</p>
          </div>
          <label className="text-sm text-bash tracker">
            {!activeTask?.startDate
              ? '0/0'
              : tracker === 'Duration'
                ? !activeTask?.duration
                  ? 'Not Started'
                  : `${Number(activeTask?.duration.value).toFixed(0)} Days`
                : taskProgress.percentage > 99
                  ? `${activeTask?.subTasks.length}`
                  : `${activeTask?.subTasks.filter((one) => one.status === SubTaskStatus.verified)
                      .length}/${activeTask?.subTasks.length}`}
          </label>
        </div>
        <div className="mt-1 bg-ashShade-3 rounded-3xl h-2 overflow-hidden">
          {activeTask ? (
            <div
              className={` 
                ${StatusBgs[activeTask.status]} h-full rounded-3xl
            `}
              style={{
                width:
                  isAwaiting(activeTask.status) ||
                  activeTask.preConstructionStatus === ConstructionStatus.Draft
                    ? '0%'
                    : `${taskProgress.percentage}%`
              }}
            />
          ) : null}
        </div>
      </div>
      <div className={flexer}>
        <div className={flexer}>
          <div>
            <p className="text-sm font-Medium truncate">Start{hasStarted ? 'ed' : 's'} </p>
            <p className="text-sm text-bash font-Medium">
              {startDate ? <Moment format={dateFormat}>{startDate}</Moment> : 'Not Set'}
            </p>
          </div>
          <div className="ml-6 mr-auto">
            <p className="text-sm font-Medium">End{hasEnded ? 'ed' : 's'} </p>
            <p className="text-sm text-bash font-Medium">
              {endDate ? <Moment format={dateFormat}>{endDate}</Moment> : 'Not Set'}
            </p>
          </div>
        </div>
        <div className={flexer}>
          <TbCalendar className="text-black" />
          <p className="text-sm ml-2 text-bash font-Medium">
            <Moment format={dateFormat}>{new Date()}</Moment>
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {NotificationLabels}
      {Progress}
    </>
  );
};

export default memo(TaskProgress);
