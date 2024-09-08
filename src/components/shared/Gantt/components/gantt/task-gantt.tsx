import React, { useRef, useEffect, useState, useMemo } from 'react';
import { GridProps, Grid } from '../grid/grid';
import { CalendarProps, Calendar } from '../calendar/calendar';
import { TaskGanttContentProps } from './task-gantt-content';
import styles from './gantt.module.css';
import OneTask from './one-task';

export type TaskGanttProps = {
  gridProps: GridProps;
  calendarProps: CalendarProps;
  barProps: TaskGanttContentProps;
  ganttHeight: number;
  scrollY: number;
  scrollX: number;
};
const taskItemTopMargin = 20;

export const TaskGantt: React.FC<TaskGanttProps> = ({
  gridProps,
  calendarProps,
  barProps,
  ganttHeight,
  scrollY,
  scrollX
}) => {
  const ganttSVGRef = useRef<SVGSVGElement>(null);
  const horizontalContainerRef = useRef<HTMLDivElement>(null);
  const verticalGanttContainerRef = useRef<HTMLDivElement>(null);
  const [showModal, setModal] = useState<{ status: boolean; index?: number }>({
    status: false
  });
  const { onExpanderClick } = barProps;

  useEffect(() => {
    if (horizontalContainerRef.current) {
      horizontalContainerRef.current.scrollTop = scrollY;
    }
  }, [scrollY]);

  useEffect(() => {
    if (verticalGanttContainerRef.current) {
      verticalGanttContainerRef.current.scrollLeft = scrollX;
    }
  }, [scrollX]);

  const toggleModal = (index?: number) => {
    setModal((prev) => ({
      status: index !== undefined ? !prev.status : false,
      index
    }));
  };

  const ganttTaskHeight = useMemo(() => {
    let baseHeight = barProps.rowHeight * barProps.tasks.length;

    for (const task of barProps.tasks) {
      if (task.hideChildren) {
        // 1. margins
        const firstStTopMargin = task.subTask && task.subTask[0] ? 8 : 0;
        const otherSTsTopMargin = task.subTask ? 12 * (task.subTask.length - 1) : 0;
        const addBtnTopMargin = 12;
        // 2.
        if (task.subTask) {
          const allRowsHeight = (task.subTask.length + 1) * 30;
          const allMargins = firstStTopMargin + otherSTsTopMargin + addBtnTopMargin;
          // 3.
          baseHeight += allRowsHeight + allMargins;
        }
      }
    }

    return baseHeight;
  }, [barProps.tasks, barProps.rowHeight]);

  const verticalLinesSvg = (
    <svg
      height={ganttTaskHeight}
      width={gridProps.svgWidth}
      style={{
        minHeight: ganttTaskHeight < 400 ? '70vh' : ganttTaskHeight
      }}
      fontFamily={barProps.fontFamily}
      xmlns="http://www.w3.org/2000/svg"
      ref={ganttSVGRef}>
      <Grid {...gridProps} />
    </svg>
  );

  const Child = () => {
    let topOffSets: { [key: number]: number } = {};
    return (
      <>
        {React.Children.toArray(
          barProps.tasks.map((task) => {
            /**
             * mock subtask spaces as
             * actual task spaces
             */
            let subTasksHeight = 0;
            // calculate subtasks height ~ in addiction
            if (task.hideChildren) {
              // 1. margins
              const firstStTopMargin = task.subTask && task.subTask[0] ? 8 : 0;
              const otherSTsTopMargin = task.subTask ? 12 * (task.subTask.length - 1) : 0;
              const addBtnTopMargin = 12;
              // 2.
              if (task.subTask) {
                const allRowsHeight = (task.subTask.length + 1) * 30;
                const allMargins = firstStTopMargin + otherSTsTopMargin + addBtnTopMargin;
                // 3.
                subTasksHeight = allRowsHeight + allMargins;
              }
            }
            // set next element's offset
            if (barProps.tasks[task.index + 1]) {
              const SubTaskSpaceFactor = task.hideChildren ? subTasksHeight : taskItemTopMargin;

              topOffSets = {
                ...topOffSets,
                [task.index + 1]:
                  (topOffSets[task.index] || task.y) + // use bigger offset if any
                  task.height +
                  SubTaskSpaceFactor
              };
            }

            const topOffSet = topOffSets[task.index] || task.y;

            return (
              <OneTask
                {...{
                  task,
                  showModal,
                  topOffSet,
                  toggleModal,
                  onExpanderClick
                }}
                allTasks={barProps.tasks}
              />
            );
          })
        )}
      </>
    );
  };

  return (
    <div
      style={{
        width: gridProps.svgWidth,
        minHeight: ganttTaskHeight < 400 ? '70vh' : ganttTaskHeight
      }}
      className={styles.ganttVerticalContainer + ' overflow-scroll'}
      ref={verticalGanttContainerRef}
      dir="ltr">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width={gridProps.svgWidth}
        height={calendarProps.headerHeight}
        fontFamily={barProps.fontFamily}>
        <Calendar {...calendarProps} />
      </svg>
      <div
        ref={horizontalContainerRef}
        className={styles.horizontalContainer + ' gant-chart overflow-scroll'}
        style={{ minHeight: ganttTaskHeight, width: gridProps.svgWidth }}>
        <div
          style={{
            width: gridProps.svgWidth,
            minHeight: ganttTaskHeight < 400 ? '70vh' : ganttTaskHeight
          }}
          className="relative h-full overflow-scroll">
          {verticalLinesSvg}
          <Child />
        </div>
      </div>
    </div>
  );
};
