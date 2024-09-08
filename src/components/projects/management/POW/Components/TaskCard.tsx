import StatusBanner from 'components/projects/bids/contractor/components/StatusBanner';
import { flexer, hoverFade } from 'constants/globalStyles';
import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TbMessages } from 'react-icons/tb';
import { HiChevronUpDown } from 'react-icons/hi2';
import Moment from 'react-moment';
import { ConstructionStatus, ProjectTask, StatusBgs, SubTaskStatus, TaskStatus } from '../../types';
import Button from '../../../../shared/Button';
import { TiInfo } from 'react-icons/ti';
import { isAwaiting } from '../helpers';
import { dateFormat } from '../../../../../constants';
import { AiOutlinePlus } from 'react-icons/ai';
import { useNavigate } from 'react-router-dom';
import { PMStoreContext } from '../../Context';
import { BsCheckCircle, BsCheckCircleFill, BsCircle } from 'react-icons/bs';
import useRole, { UserRoles } from 'Hooks/useRole';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import MessagesModal from './MessagesModal';
import { setMessageModal } from 'store/slices/taskMessagesModalSlice';
import { countPending } from 'components/projects/Team/Views/Components/UsePending';
import { getEndDateFromTaskList, getStartDateFromTaskList } from './PowCard';

interface Props {
  task: ProjectTask;
  onClick?: () => void;
}

const date = `${new Date().getFullYear()}-${new Date().getMonth() + 1}-${new Date().getDate()}`;

const TaskCard = ({ task, onClick }: Props) => {
  const { isOfType } = useRole();
  const navigation = useNavigate();
  const { setContext, draftsToSubmit } = useContext(PMStoreContext);
  const [tracker, setTracker] = useState<'Sub task' | 'Duration'>('Duration');
  const [taskProgress, setTaskProgress] = useState({ percentage: 0, diff: 0 });
  const [{ hasEnded, hasStarted }, setPosition] = useState({
    hasStarted: false,
    hasEnded: false
  });
  const [showMessages, setShowMessages] = useState(false);
  /** */
  const today = useMemo(() => new Date(date).getTime(), []);
  const start = useMemo(() => {
    if (task.duration) return new Date(task.startDate).getTime();
    else return null;
  }, [task]);
  const end = useMemo(() => {
    if (task.duration) return new Date(task.endDate).getTime();
    else return null;
  }, [task]);
  //
  const OptRef = useRef<HTMLButtonElement>(null);
  const ParentRef = useRef<HTMLDivElement>(null);
  const DraftBtnRef = useRef<HTMLButtonElement>(null);
  const messageBtnRef = useRef<HTMLDivElement>(null);
  let user = useAppSelector((m) => m.user);
  const isDraftSelected = useMemo(() => {
    if (task.status !== TaskStatus.draft) return false;
    return draftsToSubmit.find((one) => one._id === task._id) ? true : false;
  }, [draftsToSubmit, task.status]);

  useEffect(() => {
    // check the time line
    if (end) {
      const hasStarted = !start ? false : today >= start;
      const hasEnded = today > end;

      setPosition({ hasStarted, hasEnded });
    }
  }, [task, start, end, today]);
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
      } else {
        const readyTasks = task.subTasks.filter((one) => one.status === SubTaskStatus.verified);
        dayDiff = task.subTasks.length - readyTasks.length;
        percentage = (readyTasks.length / task.subTasks.length) * 100;
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

  const toggleModal = () => {
    dispatch(setMessageModal({ isOpen: true, taskId: task._id }));
  };
  useEffect(() => {
    const parent = ParentRef.current;
    if (parent)
      parent.addEventListener('click', (e: any) => {
        e.stopPropagation();
        e.preventDefault();
        e.stopPropagation();
        // check if the click originates from a tracker toggle handler div
        if (
          messageBtnRef &&
          (messageBtnRef.current?.contains(e.target) || e.target.classList.contains('message-btn'))
        ) {
          toggleModal();
          return;
        }
        if (
          OptRef.current &&
          (OptRef.current.contains(e.target) || e.target.classList.contains('tracker'))
        ) {
          if (task.startDate) {
            // handle duration ans subtask toggle
            toggleTracker();
          } else {
            // handles add subtask
            navigation(`newTask/${task._id}`);
            // if (onClick) onClick();
          }
        } else if (
          DraftBtnRef.current &&
          (DraftBtnRef.current.contains(e.target) || e.target.classList.contains('draft'))
        ) {
          handleDraftSubmit();
        } else if (
          messageBtnRef.current &&
          (messageBtnRef.current.contains(e.target) || e.target.classList.contains('message-btn'))
        ) {
          toggleModal();
        } else if (onClick) onClick();
      });
    return () => {
      parent?.removeEventListener('click', () => {});
    };
  }, [ParentRef, onClick, OptRef, DraftBtnRef, messageBtnRef, draftsToSubmit]);

  const StatusType = useMemo(() => {
    switch (task.status) {
      case TaskStatus.awaitingApproval:
        return 'dormant';
      case TaskStatus.notStarted:
        return 'not started';
      case TaskStatus.ongoing:
        return 'pending';
      case TaskStatus.completed:
        return 'done';
      default:
        return 'completed';
    }
  }, [task.status]);

  const chats = useAppSelector((m) => m.chats);

  const handleDraftSubmit = () => {
    if (task.status === TaskStatus.draft && isOfType(UserRoles.Contractor)) {
      setContext((prev) => {
        // 1. check if the task already exists
        const exists = prev.draftsToSubmit.find((one) => one._id === task._id);
        // 2. define new drafts
        const newDrafts = exists
          ? prev.draftsToSubmit.filter((one) => one._id !== task._id) // remove task
          : [...prev.draftsToSubmit, task]; // add task
        return {
          ...prev,
          draftsToSubmit: newDrafts
        };
      });
    }
  };

  const messageCount = useMemo(() => {
    return countPending(chats?.Tasks.groups[task._id] ?? [], user._id);
  }, [chats.Tasks.groups]);

  let { taskStart, taskEnd } = useMemo(() => {
    let start = getStartDateFromTaskList([task]);
    let end = getEndDateFromTaskList([task]);

    return { taskStart: start, taskEnd: end };
  }, [task]);

  return (
    <>
      <div
        className={`${
          isAwaiting(task.status) || task.preConstructionStatus === ConstructionStatus.Draft
            ? 'bg-ashShade-3'
            : 'bg-white'
        } py-8 px-6 rounded-md cursor-pointer group`}
        ref={ParentRef}>
        <div className={flexer + 'overflow-hidden gap-2 w-full'}>
          <button ref={DraftBtnRef} className={flexer + 'gap-3  w-11/12 draft'}>
            {isDraftSelected ? (
              <BsCheckCircleFill className="text-bgreen-0" />
            ) : task.status === TaskStatus.draft ? (
              <>
                <BsCheckCircle className="text-bash text-sm hidden group-hover:block" />
                <BsCircle className="text-bash text-sm group-hover:hidden" />
              </>
            ) : null}
            <h2
              className={`font-Medium ${
                isAwaiting(task.status) ? 'text-bash' : 'text-black'
              } text-2xl w-full truncate text-left capitalize`}
              title={task.name}>
              {task.name}
            </h2>
          </button>

          <div className={flexer}>
            {task.preConstructionStatus === ConstructionStatus.Draft ? (
              <TiInfo className={hoverFade + 'text-bash text-xl'} />
            ) : (
              <span
                ref={messageBtnRef}
                onClick={(e) => {
                  toggleModal();
                }}
                className=" message-btn flex items-center">
                <TbMessages className={hoverFade + 'text-bash text-base'} />
                {messageCount > 0 && (
                  <p className="text-sm text-bash ml-1">
                    {messageCount > 99 ? '99+' : messageCount}
                  </p>
                )}
              </span>
            )}
          </div>
        </div>

        <div className="my-6">
          <div className={flexer + hoverFade}>
            {!task.startDate ? (
              <Button
                ref={OptRef}
                type="transparent"
                text="Add a subtask"
                textStyle="text-bblue font-Medium ml-1"
                className="group !px-0 !border-transparent !bg-transparent hover:!bg-transparent tracker"
                LeftIcon={<AiOutlinePlus className="text-bblue text-base group-hover:scale-110 " />}
              />
            ) : (
              <Button
                ref={OptRef}
                text={tracker}
                type="transparent"
                className="group !px-2 !hover:bg-gray-100 !border-transparent tracker"
                textStyle={`${isAwaiting(task.status) ? 'text-bash' : 'text-black'}  ml-1`}
                LeftIcon={
                  <HiChevronUpDown className="text-bash text-base group-hover:scale-110 " />
                }
              />
            )}

            <label className="text-sm text-bash tracker">
              {!task.duration
                ? '0/0'
                : tracker === 'Duration'
                  ? `${Number(task.duration.value).toFixed(0)} Days`
                  : taskProgress.percentage > 99
                    ? `${task.subTasks.length}`
                    : `${
                        task.subTasks.filter((one) => one.status === SubTaskStatus.verified).length
                      }/${task.subTasks.length}`}
            </label>
          </div>
          <div
            className={`mt-1 ${
              isAwaiting(task.status) ? 'bg-white' : 'bg-ashShade-3'
            } rounded-3xl h-2 overflow-hidden`}>
            <div
              className={`${StatusBgs[task.status]} h-full rounded-3xl`}
              style={{
                width:
                  isAwaiting(task.status) || task.preConstructionStatus === ConstructionStatus.Draft
                    ? '0%'
                    : `${taskProgress.percentage}%`
              }}
            />
          </div>
        </div>

        <div className={flexer}>
          <div className={flexer}>
            <div>
              <p className="text-sm font-Medium truncate">Start{hasStarted ? 'ed' : 's'} </p>
              <p className="text-xs text-bash font-Medium">
                {task.duration && taskStart ? (
                  <Moment format={dateFormat}>{taskStart}</Moment>
                ) : (
                  'Not Set'
                )}
              </p>
            </div>
            <div className="ml-5">
              <p className="text-sm font-Medium">End{hasEnded ? 'ed' : 's'} </p>
              <p className="text-xs text-bash font-Medium">
                {task.duration && taskEnd ? (
                  <Moment format={dateFormat}>{taskEnd}</Moment>
                ) : (
                  'Not Set'
                )}
              </p>
            </div>
          </div>
          {task.status === TaskStatus.draft ? (
            <p className="text-bash opacity-80">
              <span className="text-2xl">&bull;</span> <span className="font-Medium">Drafts</span>
            </p>
          ) : (
            <StatusBanner
              type={StatusType}
              label={task.status}
              className={`${isAwaiting(task.status) ? 'bg-white' : ''} ml-auto`}
            />
          )}
        </div>
      </div>
    </>
  );
};

export default memo(TaskCard);
