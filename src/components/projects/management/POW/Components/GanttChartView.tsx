import { Gantt, Task, ViewMode } from '../../../../shared/Gantt';
import React, { useContext, useEffect, useState, useLayoutEffect } from 'react';
import { SubTask, SubTaskStatus, TaskStatus } from '../../types';
import Button from '../../../../shared/Button';
import { centered, flexer, hoverFade } from '../../../../../constants/globalStyles';
import { TbChevronDown, TbChevronLeft, TbChevronRight, TbSortDescending } from 'react-icons/tb';
import { PMStoreContext } from '../../Context';
import { useParams } from 'react-router-dom';
import { TaskStatusColor } from '../helpers';

export interface CustomTask extends Task {
  subTask?: SubTask[];
  status?: TaskStatus | SubTaskStatus;
}

const progressCalc = (status: TaskStatus) => {
  switch (status) {
    case TaskStatus.awaitingApproval:
      return 0;
    case TaskStatus.ongoing:
      return 1;
    case TaskStatus.completed:
      return 2;
    case TaskStatus.verified:
      return 3;
    default:
      return 0;
  }
};

const GanttChartView = () => {
  const { powId } = useParams() as { powId: string };
  const [ganttTasks, setGanttTask] = useState<CustomTask[]>([]);
  const { tasks, taskStatusFilter } = useContext(PMStoreContext);
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);
  const [parentScroll, setParentScroll] = useState<{ x: number; y: number }>();

  const focusOnToday = () => {
    const targetElement = document.querySelector('.today');
    if (targetElement) {
      for (const el of [targetElement]) {
        // @ts-ignore
        for (const [key, value] of Object.entries(el))
          if (key.includes('reactProps')) {
            setParentScroll({
              // @ts-ignore
              x: value.x < 400 ? 0 : value.x - 400,
              // @ts-ignore
              y: value.y
            });
          }
      }
    }
  };

  useEffect(() => {
    setGanttTask(
      (() => {
        /**
         * filter task depending on their status
         * ongoing, ... etc
         */
        if (taskStatusFilter) {
          return [...tasks[powId]].filter((one) => one.status === taskStatusFilter);
        } else {
          return [...tasks[powId]];
        }
      })()
        // only keep tasks with start & end Dates
        .filter((one) => one.startDate && one.endDate)
        // filter out draft tasks
        .filter((one) => one.status !== TaskStatus.draft)
        .map((one) => ({
          id: one._id,
          type: 'task',
          name: one.name,
          isDisabled: true,
          hideChildren: false,
          status: one.status,
          subTask: one.subTasks,
          progress: progressCalc(one.status),
          styles: { backgroundColor: TaskStatusColor(one.status) },
          start: new Date(one.startDate),
          end: new Date(one.endDate)
        }))
    );
  }, [tasks, taskStatusFilter]);

  const taskExpander = (t: CustomTask) => {
    setGanttTask((prev) =>
      prev.map((one) => (t.id !== one.id ? one : { ...one, hideChildren: !one.hideChildren }))
    );
  };

  if (!ganttTasks[0]) return null;

  const filters = [ViewMode.Month, ViewMode.Week, ViewMode.Day];

  return (
    <div className="h-[80vh] w-full max-w-md mt-5 md:max-w-7xl 3xl:max-w-10xl rounded-lg pb-3">
      <div className="flex  bg-white">
        <div className="min-w-[284px] ml-1 p-6 h-full">
          <p className="font-semibold text-xl">Task</p>
        </div>
        <div className={flexer + 'p-6 border-l w-full'}>
          <div className={flexer}>
            <Button text="Today" type="secondary" onClick={focusOnToday} />
            <div className={flexer + 'ml-5 text-bash'}>
              <TbChevronLeft />
              <TbChevronRight />
            </div>
          </div>
          <div className={flexer}>
            <div className="group relative">
              <Button
                text={viewMode}
                type="transparent"
                className="border-0 !px-4"
                textStyle="capitalize text-bash"
                RightIcon={<TbChevronDown className="mx-2 text-bash" />}
                LeftIcon={<TbSortDescending className="mx-2 text-bash" />}
              />
              <div className="hidden group-hover:grid bg-white absolute z-20 top-full w-32 right-0 p-2 rounded-md shadow-md">
                {React.Children.toArray(
                  filters.map((one) => (
                    <p
                      onClick={() => setViewMode(one)}
                      className={
                        `
                          p-2 capitalize font-Medium rounded-md
                          ${viewMode === one ? 'bg-blue-100 text-blue-600' : 'text-bash'}
                      ` + hoverFade
                      }>
                      {one}
                    </p>
                  ))
                )}
              </div>
            </div>
            <div className="group relative ml-5">
              <Button
                text={viewMode}
                type="transparent"
                className="border-0 !px-4"
                textStyle="capitalize text-bash"
                RightIcon={<TbChevronDown className="mx-2 text-bash" />}
              />
              <div className="hidden group-hover:grid bg-white absolute z-20 top-full w-32 right-0 p-2 rounded-md shadow-md">
                {React.Children.toArray(
                  filters.map((one) => (
                    <p
                      onClick={() => setViewMode(one)}
                      className={
                        `
                          p-2 capitalize font-Medium rounded-md
                          ${viewMode === one ? 'bg-blue-100 text-blue-600' : 'text-bash'} 
                      ` + hoverFade
                      }>
                      {one}
                    </p>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      {ganttTasks[0] ? (
        <Gantt tasks={ganttTasks} onExpanderClick={taskExpander} {...{ viewMode, parentScroll }} />
      ) : (
        <div className={centered + 'h-full'}>
          <h1 className="text-bash opacity-60 font-Medium text-2xl">No subtasks yet</h1>
        </div>
      )}
    </div>
  );
};

export default GanttChartView;
