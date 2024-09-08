import { centered, flexer, hoverFade } from 'constants/globalStyles';
import React, { memo, useContext, useEffect, useRef, useState } from 'react';
import { TbArrowNarrowLeft, TbSortDescending, TbChevronLeft } from 'react-icons/tb';
import GridTaskView from './Components/GridTaskView';
import noContentImg from '../../../../assets/nocontent.svg';
import ListTaskView from './Components/Table';
import { MdCopyAll } from 'react-icons/md';
import { IconType } from 'react-icons';
import { BsTable } from 'react-icons/bs';
import { PMStoreContext } from '../Context';
import { RiMenu4Fill } from 'react-icons/ri';
import NewTaskBtn from './Components/NewTaskBtn';
import GanttChartView from './Components/GanttChartView';
import { useNavigate, useParams } from 'react-router-dom';
import { getTasksByPOW } from '../../../../apis/tasks';
import useFetch from '../../../../Hooks/useFetch';
import { getOnePow } from '../../../../apis/pow';
import Loader from '../../../shared/Loader';
import { TiWarning } from 'react-icons/ti';
import StatusLabel from 'components/shared/StatusLabel/StatusLabel';
import { POW, ProjectTask, TaskStatus } from '../types';
import { displayError } from 'Utils';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import StatusFilter from 'components/shared/StatusFilter';
import MessagesModal from './Components/MessagesModal';
import { setMessageModal } from 'store/slices/taskMessagesModalSlice';

export default function ActivePOW() {
  const navigate = useNavigate();
  let dispatch = useAppDispatch();
  const containerRef = useRef<HTMLDivElement>(null);
  const { powId, projectId } = useParams() as { [key: string]: string };
  let messageModal = useAppSelector((m) => m.messageModal);
  const {
    setContext,
    activePow,
    tasks,
    pows,
    handleContext,
    hasFetchedAllTasks,
    taskStatusFilter
  } = useContext(PMStoreContext);
  const [powTasks, setPowTasks] = useState<ProjectTask[]>([]);
  const [mainViewMode, setViewMode] = useState<'grid' | 'table' | 'gantt'>('grid');
  const { isLoading, load } = useFetch<POW[]>({ showDisplayError: false });
  const {
    load: TaskLoad,
    success: TaskSuccess,
    isLoading: isTaskLoading
  } = useFetch<ProjectTask[]>({ showDisplayError: false });

  useEffect(() => {
    (async () => {
      try {
        const validPows =
          pows && pows[0] ? pows : await load(getOnePow(powId)).then((res) => res.data);
        setContext((prev) => ({
          ...prev,
          pows: validPows,
          activePow: validPows.find((one) => one._id === powId)
        }));
      } catch (er) {
        displayError("POW doesn't exist");
        goBack();
      }
    })();
  }, []);

  useEffect(() => {
    if (hasFetchedAllTasks) {
      setPowTasks(
        (() => {
          /**
           * filter task depending on their status
           * ongoing, ... etc
           */
          if (!tasks[powId]) return [];
          if (taskStatusFilter) {
            return [...tasks[powId]].filter((one) => one.status === taskStatusFilter);
          } else {
            return [...tasks[powId]];
          }
        })()
      );
      handleContext(
        'activePow',
        pows.find((one) => one._id === powId)
      );
    } else {
      (async () => {
        try {
          const tasks = await TaskLoad(getTasksByPOW(powId)).then((res) => res.data);
          setContext((prev) => ({
            ...prev,
            hasFetchedAllTasks: true,
            tasks: { ...prev.tasks, [powId]: tasks }
          }));
        } catch (er) {
          setContext((prev) => ({
            ...prev,
            hasFetchedAllTasks: true,
            tasks: { ...prev.tasks, [powId]: [] }
          }));
        }
      })();
    }
  }, [tasks, TaskSuccess, taskStatusFilter]);

  if (!activePow)
    return (
      <div className={centered}>
        <Loader />
      </div>
    );

  const NavItem = ({ label, Icon }: { label: 'grid' | 'table' | 'gantt'; Icon: IconType }) => (
    <div className={'relative' + hoverFade}>
      <p
        onClick={() => setViewMode(label)}
        className={`text-base ${
          mainViewMode === label ? 'text-blue-500' : 'text-bash'
        } font-Medium pb-2 ${flexer} truncate`}>
        <Icon className="text-sm md:text-base mr-1.5 md:mr-3" />
        <span className="capitalize text-sm md:text-base">{label} view</span>
      </p>
      <span
        className={`${
          mainViewMode !== label && 'hidden'
        } absolute bottom-0 left-1/2 -translate-x-1/2 w-1/2 border-b-2 border-b-bblue `}
      />
    </div>
  );

  if (isLoading || isTaskLoading) return <Loader />;

  const tasksAwaitingApproval = tasks[powId]
    ? tasks[powId].filter((one) => one.status === TaskStatus.awaitingApproval)
    : [];

  const NotificationLabels = tasksAwaitingApproval[0] ? (
    <>
      <div className="mb-3" />
      <StatusLabel
        type="pending"
        title="Awaiting Approval "
        Icon={<TiWarning className="text-[#8A6813] text-3xl" />}
        description={`You have ${
          tasksAwaitingApproval.length > 1
            ? `${tasksAwaitingApproval.length} tasks that are`
            : 'a tasks that is'
        } not approved`}
      />
      <div className="mb-8" />
    </>
  ) : null;

  const goBack = () => {
    navigate(`/projects/${projectId}/management`);
  };

  const Header = (
    <>
      <div className="md:fixed top-12">
        <button className={'flex md:hidden items-center mt-2' + hoverFade} onClick={goBack}>
          <TbChevronLeft className="text-bash" />
          <p className="text-bash">Back</p>
        </button>
        <button
          className={'hidden md:flex items-center cursor-pointer hover:opacity-70'}
          onClick={goBack}>
          <TbArrowNarrowLeft className="text-black text-xl mr-2" />
          <p className="text-black text-sm">Back</p>
        </button>
      </div>
      <header>
        <div className={flexer + 'mb-5 w-full'}>
          <h5 className="font-Medium text-xl md:text-3xl text-black capitalize flex[.8] md:flex-auto">
            {activePow.name}
          </h5>
          <NewTaskBtn
            callBack={() => {
              // scroll to the bottom
              if (containerRef.current) {
                containerRef.current.scrollTo({
                  top: containerRef.current.scrollHeight
                });
              }
            }}
          />
        </div>
        {NotificationLabels}
        <div className={flexer + 'border-b border-b-ashShade-4 overflow-y-visible'}>
          <div className="flex items-center gap-5 md:gap-10 overflow-y-scroll flex-[.9] md:flex-auto">
            <NavItem label="grid" Icon={MdCopyAll} />
            <NavItem label="table" Icon={BsTable} />
            <NavItem label="gantt" Icon={RiMenu4Fill} />
          </div>
          <StatusFilter
            value={taskStatusFilter}
            options={Object.values(TaskStatus)}
            onChange={(val) => handleContext('taskStatusFilter', val as TaskStatus)}
          />
        </div>
      </header>
    </>
  );

  const NoTaskView = (
    <div className={centered + 'h-[50%] flex-col'}>
      <img alt="" loading="lazy" decoding="async" src={noContentImg} className=" w-56 h-56" />
      <h1 className="font-bold text-2xl mt-6 mb-2">No task has been created yet</h1>
      <p className="text-bash text-base text-center mb-5">
        As soon as a task has been submitted, you would see the task description here
      </p>
      {taskStatusFilter ? null : <NewTaskBtn />}
    </div>
  );

  return (
    <>
      {messageModal.isOpen && (
        <MessagesModal
          taskId={messageModal.taskId || ''}
          closer={() => dispatch(setMessageModal({ isOpen: false, taskId: '' }))}
        />
      )}
      <div ref={containerRef} className="w-full h-full flex flex-col ">
        {Header}
        {powTasks[0] ? <ViewHandler {...{ mainViewMode }} /> : NoTaskView}
      </div>
    </>
  );
}

const ViewHandler = memo(({ mainViewMode }: { mainViewMode: 'grid' | 'table' | 'gantt' }) => {
  switch (mainViewMode) {
    case 'grid':
      return <GridTaskView />;
    case 'table':
      return <ListTaskView />;
    case 'gantt':
      return <GanttChartView />;
    default:
      return <></>;
  }
});
