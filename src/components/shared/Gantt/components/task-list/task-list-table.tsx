import React, { Fragment, useContext, useEffect, useRef, useState } from 'react';
import styles from './task-list-table.module.css';
import { TbChevronRight, TbPlus } from 'react-icons/tb';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import Modal from '../../../Modal';
import { CustomTask } from '../../../../projects/management/POW/Components/GanttChartView';
import SubTaskForm from '../../../../projects/management/POW/Components/subTaskForm';
import { PMStoreContext } from '../../../../projects/management/Context';
import {
  ProjectTask,
  SubTaskStatus,
  SubTaskStatusColors,
  TaskStatus
} from '../../../../projects/management/types';
import useRole from '../../../../../Hooks/useRole';
import { useParams } from 'react-router-dom';
import Button from 'components/shared/Button/Button';
import { isAwaiting } from 'components/projects/management/POW/helpers';

export const TaskListTableDefault: React.FC<{
  rowHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
  locale: string;
  tasks: CustomTask[];
  selectedTaskId: string;
  setSelectedTask: (taskId: string) => void;
  onExpanderClick: (task: CustomTask) => void;
}> = ({
  rowHeight,
  rowWidth,
  tasks,
  // fontFamily,
  // fontSize,
  onExpanderClick
}) => (
  <div className={styles.taskListWrapper + ' w-72 !border-0'}>
    <div className="mb-3" />
    {tasks.map((t, i) => (
      <OneListTask {...{ t, i, rowHeight, rowWidth, onExpanderClick }} />
    ))}
  </div>
);

interface OneListTaskProps {
  i: number;
  t: CustomTask;
  rowWidth: string;
  rowHeight: number;
  onExpanderClick: (task: CustomTask) => void;
}

const OneListTask = ({ t, i, rowHeight, rowWidth, onExpanderClick }: OneListTaskProps) => {
  const { tasks } = useContext(PMStoreContext);
  const { powId } = useParams() as { powId: string };
  const [task, setTask] = useState<ProjectTask>();
  const [showModal, setModal] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);
  const { role } = useRole();

  useEffect(() => {
    const handleClick = (ev: any) => {
      if (modalRef.current && ev.target.contains(modalRef.current)) {
        setModal(true);
      }
    };

    document.onclick = handleClick;

    return () => {
      document.removeEventListener('click', handleClick);
    };
  }, []);

  useEffect(() => {
    setTask(tasks[powId].find((one) => one._id === t.id));
  }, [powId, t, tasks]);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const ModalView = (
    <div className="bg-white absolute cursor-auto  w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg">
      {!task ? 'Loading...' : <SubTaskForm taskId={t.id} {...{ toggleModal }} />}
    </div>
  );

  return (
    <Fragment key={`${t.id}row`}>
      <div style={{ background: 'transparent' }} className={styles.taskListTableRow}>
        <div
          className={styles.taskListCell}
          style={{
            minWidth: rowWidth,
            maxWidth: rowWidth
          }}>
          <div
            style={{ height: rowHeight }}
            className={
              styles.taskListNameWrapper +
              flexer +
              `ml-3 py-1 px-3 group ${
                t.hideChildren && 'bg-pbg'
              } hover:bg-pbg rounded-lg rounded-tr-none rounded-br-none`
            }
            title={t.name}
            onClick={() => onExpanderClick(t)}>
            <div
              className={
                hoverFade +
                `mr-2 transform transition-all ${t.hideChildren ? 'rotate-90' : 'rotate-0'}`
              }>
              <TbChevronRight className="text-base text-bash" />
            </div>
            <p className="truncate flex-1 text-sm capitalize cursor-pointer">
              <span className="font-Medium ">{i + 1}</span>
              <span className="ml-2 font-Medium capitalize">{t.name}</span>
            </p>
            {isAwaiting(t.status as TaskStatus) && (
              <div
                className={`${
                  t.hideChildren ? 'bg-white' : 'bg-pbg group-hover:bg-white'
                }  rounded-lg py-[2px] px-1 text-bash`}>
                <p className="truncate text-xs font-Medium">{t.status}</p>
              </div>
            )}
          </div>
          <div
            style={{
              borderLeftColor: t.styles?.backgroundColor
            }}
            className={`pl-8 transition-all ${
              !t.hideChildren ? 'zero-height  overflow-hidden' : 'auto-height  overflow-y-scroll'
            }`}>
            {t.subTask && t.subTask[0]
              ? React.Children.toArray(
                  t.subTask.map((st, index) => (
                    <div
                      style={{ height: rowHeight }}
                      className={flexer + ` ${index ? 'mt-3' : 'mt-2'} px-3`}>
                      <p
                        key={`${i}.${index}`}
                        // style={{ height: rowHeight }}
                        className={`flex-1 truncate capitalize text-sm ${
                          isAwaiting(st.status) ? 'text-bash' : 'text-black'
                        }`}
                        title={st.name}>
                        <span>
                          {i + 1}.{index + 1}
                        </span>
                        <span className="ml-2">{st.name}</span>
                      </p>
                      {isAwaiting(st.status) && (
                        <div className="bg-pbg rounded-lg px-1 text-bash">
                          <p className="truncate text-xs font-Medium">{st.status}</p>
                        </div>
                      )}
                    </div>
                  ))
                )
              : null}
            <div style={{ height: rowHeight }} className={flexer + 'mt-3'}>
              <div />
              <Button
                text="Add subtask"
                type="transparent"
                onClick={toggleModal}
                textStyle="font-Medium !text-sm text-borange"
                className={`${
                  role !== 'contractor' && 'hidden'
                } border-0 !px-3 !py-0 hover:!bg-transparent`}
                LeftIcon={<TbPlus className="text-borange !text-sm !mr-1 font-Medium" />}
              />
            </div>
          </div>
          {t.hideChildren ? null : <div className="mb-5" />}
        </div>
      </div>

      <Modal
        visible={showModal}
        toggle={toggleModal}
        overlayClassName="opacity-50 backdrop-blur-0"
        className="backdrop-blur-0 drop-shadow-lg !z-[25]">
        {ModalView}
      </Modal>
    </Fragment>
  );
};
