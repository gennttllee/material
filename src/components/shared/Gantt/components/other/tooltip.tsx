import React, { useRef, useEffect, useState } from 'react';
import { Task } from '../../types/public-types';
import { BarTask } from '../../types/bar-task';
import styles from './tooltip.module.css';
import { flexer, hoverFade } from 'constants/globalStyles';
import StatusBanner from 'components/projects/bids/contractor/components/StatusBanner';

export type TooltipProps = {
  task: BarTask;
  arrowIndent: number;
  rtl: boolean;
  svgContainerHeight: number;
  svgContainerWidth: number;
  svgWidth: number;
  headerHeight: number;
  taskListWidth: number;
  scrollX: number;
  scrollY: number;
  rowHeight: number;
  fontSize: string;
  fontFamily: string;
  TooltipContent: React.FC<{
    task: Task;
    fontSize: string;
    fontFamily: string;
  }>;
};
export const Tooltip: React.FC<TooltipProps> = ({
  task,
  rowHeight,
  rtl,
  svgContainerHeight,
  svgContainerWidth,
  scrollX,
  scrollY,
  arrowIndent,
  fontSize,
  fontFamily,
  headerHeight,
  taskListWidth,
  TooltipContent
}) => {
  const tooltipRef = useRef<HTMLDivElement | null>(null);
  const [relatedY, setRelatedY] = useState(0);
  const [relatedX, setRelatedX] = useState(0);

  useEffect(() => {
    if (tooltipRef.current) {
      const tooltipHeight = tooltipRef.current.offsetHeight * 1.1;
      const tooltipWidth = tooltipRef.current.offsetWidth * 1.1;

      let newRelatedY = task.index * rowHeight - scrollY + headerHeight;
      let newRelatedX: number;
      if (rtl) {
        newRelatedX = task.x1 - arrowIndent * 1.5 - tooltipWidth - scrollX;
        if (newRelatedX < 0) {
          newRelatedX = task.x2 + arrowIndent * 1.5 - scrollX;
        }
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        if (tooltipLeftmostPoint > svgContainerWidth) {
          newRelatedX = svgContainerWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      } else {
        newRelatedX = task.x2 + arrowIndent * 1.5 + taskListWidth - scrollX;
        const tooltipLeftmostPoint = tooltipWidth + newRelatedX;
        const fullChartWidth = taskListWidth + svgContainerWidth;
        if (tooltipLeftmostPoint > fullChartWidth) {
          newRelatedX = task.x1 + taskListWidth - arrowIndent * 1.5 - scrollX - tooltipWidth;
        }
        if (newRelatedX < taskListWidth) {
          newRelatedX = svgContainerWidth + taskListWidth - tooltipWidth;
          newRelatedY += rowHeight;
        }
      }

      const tooltipLowerPoint = tooltipHeight + newRelatedY - scrollY;
      if (tooltipLowerPoint > svgContainerHeight - scrollY) {
        newRelatedY = svgContainerHeight - tooltipHeight;
      }
      setRelatedY(newRelatedY);
      setRelatedX(newRelatedX);
    }
  }, [
    tooltipRef,
    task,
    arrowIndent,
    scrollX,
    scrollY,
    headerHeight,
    taskListWidth,
    rowHeight,
    svgContainerHeight,
    svgContainerWidth,
    rtl
  ]);

  return (
    <div
      ref={tooltipRef}
      className={
        // relatedX
        //   ? styles.tooltipDetailsContainer
        //   : styles.tooltipDetailsContainerHidden
        'absolute left-0 top-100'
      }
      // style={{ left: relatedX, top: relatedY }}
    >
      <TooltipContent task={task} fontSize={fontSize} fontFamily={fontFamily} />
    </div>
  );
};

export const StandardTooltipContent: React.FC<{
  task: Task;
  fontSize: string;
  fontFamily: string;
}> = ({ task, fontSize, fontFamily }) => {
  // const style = {
  //   fontSize,
  //   fontFamily,
  // };
  return (
    <div className={`${styles.tooltipDefaultContainer} bg-white rounded-md p-6 h-fit w-fit`}>
      <strong className="font-semibold text-xl truncate">{task.name}</strong>
      <div className={flexer}>
        <p className="text-bash text-base w-1/5">Status</p>
        <div className="flex-1 flex items-center">
          <span className="text-borange text-4xl">&bull;</span>
          <span className="text-base text-black">Inprogress</span>
        </div>
      </div>
      <div className={flexer}>
        <p className="text-bash text-base w-1/5 mb-2">Duration</p>
        <p className="text-base text-black flex-1 truncate">5 Days left</p>
      </div>
      <div className={flexer}>
        <p className="text-bash text-base w-1/5">Timeline</p>
        <p className="text-base text-black flex-1 truncate">July 12, 2022 - July 17,2022</p>
      </div>
      <div className="flex mt-2">
        <p className="text-bash text-base w-1/5">Predecessors</p>
        <div className="grid grid-cols-2 gap-2 flex-1">
          <StatusBanner label="Cast ground floor columns" type="done" />
          <StatusBanner label="Provide water & water storage" type="dormant" />
          <StatusBanner label="Install of ground floor columns reinforcement" type="pending" />
        </div>
      </div>
    </div>
  );
};
