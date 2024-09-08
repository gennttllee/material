import StatusBanner from 'components/projects/bids/contractor/components/StatusBanner';
import { flexer, hoverFade } from 'constants/globalStyles';
import moment from 'moment';
import Moment from 'react-moment';
import React, { memo, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { BsFillCheckCircleFill, BsFillCircleFill } from 'react-icons/bs';
import { TbArrowLeft, TbPlus } from 'react-icons/tb';
import Modal from '../../../../shared/Modal';
import SubTaskForm from './subTaskForm';
import {
  SubTask as SubTaskType,
  SubTaskStatusColors,
  SubTaskStatusBgs,
  SubTaskStatus
} from '../../types';
import SubTask from './SubTaskCard';
import useRole, { UserRoles } from '../../../../../Hooks/useRole';
import { PMStoreContext } from '../../Context';
import { useParams } from 'react-router-dom';
import { isAwaiting } from '../helpers';

const ListView = () => {
  const [subTasks, setSubTasks] = useState<SubTaskType[]>([]);
  const { taskId } = useParams() as { [key: string]: string };
  const { activeTask } = useContext(PMStoreContext);
  const [showModal, setModal] = useState(false);
  const { isOfType } = useRole();

  useEffect(() => {
    if (activeTask) setSubTasks(activeTask.subTasks);
  }, [activeTask]);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const ModalView = showModal && (
    <div className="bg-white absolute cursor-auto  w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg z-10">
      <SubTaskForm {...{ toggleModal, taskId }} />
    </div>
  );

  return (
    <div className={'flex justify-between md:flex-row h-full flex-col pb-2'}>
      <div className="bg-white rounded-md p-6 h-full w-full overflow-hidden">
        <div className={flexer}>
          <strong className="text-xl font-semibold">SubTasks</strong>
          <button
            className={flexer + hoverFade + `${!isOfType(UserRoles.Contractor) && 'hidden'}`}
            onClick={toggleModal}
          >
            <TbPlus className={'text-borange'} />
            <strong className="text-sm font-semibold text-borange ml-1">Add Subtask</strong>
          </button>
        </div>
        <SubTasksList {...{ subTasks }} />
      </div>
      <Modal
        visible={showModal}
        toggle={toggleModal}
        overlayClassName="opacity-50 backdrop-blur-0"
        className="backdrop-blur-0 drop-shadow-lg"
      >
        {ModalView}
      </Modal>
    </div>
  );
};

const SubTasksList = ({ subTasks }: { subTasks: SubTaskType[] }) => {
  const [scrollX, setScrollX] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const [activeNav, setNav] = useState<SubTaskStatus>(SubTaskStatus.awaitingApproval);
  const filterSubTaskByStatus = useMemo(
    () => subTasks.filter((one) => one.status === activeNav),
    [subTasks, activeNav]
  );

  useEffect(() => {
    const handleScroll = () => {
      if (carouselRef.current) {
        setScrollX(carouselRef.current.scrollLeft);
      }
    };

    if (carouselRef.current) {
      carouselRef.current.addEventListener('scroll', handleScroll);
    }

    return () => {
      if (carouselRef.current) {
        carouselRef.current.removeEventListener('scroll', handleScroll);
      }
    };
  }, []);

  const Navigations = Object.values(SubTaskStatus).map((value, index) => {
    const AwaitingTasks = !isAwaiting(value) ? [] : subTasks.filter((one) => one.status === value);
    return (
      <div
        className={`flex-none mx-6 flex justify-center relative h-fit ` + hoverFade}
        onClick={() => setNav(value)}
      >
        <div
          className={`${
            activeNav === value ? 'text-bblue' : 'text-bash'
          } flex items-center font-Medium whitespace-nowrap mb-2 text-center`}
        >
          {AwaitingTasks[0] ? (
            <div
              className={` ${
                activeNav === SubTaskStatus.awaitingApproval ? 'bg-bblue' : 'bg-byellow-1'
              } w-5 h-5 rounded-full mr-1`}
            >
              <p className="text-white text-sm">{AwaitingTasks.length}</p>
            </div>
          ) : null}
          <p>{isAwaiting(value) ? 'Awaiting Approval' : value}</p>
        </div>
        {activeNav === value && (
          <span className="absolute w-[24px] border rounded-full border-bblue bottom-0"></span>
        )}
      </div>
    );
  });

  return (
    <>
      <nav className="my-3 relative border-b border-ashShade-4">
        <div ref={carouselRef} className="flex justify-start overflow-x-scroll no-scrollbar">
          {React.Children.toArray(Navigations)}
        </div>
        {scrollX ? (
          <div className="absolute top-0 left-0 h-full w-10 bg-gradient-to-l from-transparent to-white " />
        ) : null}
        <div className="absolute top-0 right-0 h-full w-10 bg-gradient-to-r from-transparent to-white " />
      </nav>
      <div className="h-full overflow-y-scroll">
        {subTasks[0] ? (
          filterSubTaskByStatus[0] ? (
            filterSubTaskByStatus.map((subTask) => (
              <div key={subTask._id}>
                <SubTask type="pro" hasMenu hasBorder {...{ subTask }} />
              </div>
            ))
          ) : (
            <h3 className="text-center font-Medium text-bash opacity-70 capitalize text-lg">
              No {activeNav.toString()} subtask
            </h3>
          )
        ) : (
          <h3 className="text-center font-Medium text-bash opacity-70 capitalize text-lg">
            create your first subtask
          </h3>
        )}
      </div>
    </>
  );
};

export default memo(ListView);
