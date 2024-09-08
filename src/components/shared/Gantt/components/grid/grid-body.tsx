import React, { ReactChild } from 'react';
import { Task } from '../../types/public-types';
import { addToDate } from '../../helpers/date-helper';
import styles from './grid.module.css';
import { CustomTask } from 'components/projects/management/POW/Components/GanttChartView';

export type GridBodyProps = {
  tasks: CustomTask[];
  dates: Date[];
  svgWidth: number;
  rowHeight: number;
  columnWidth: number;
  todayColor: string;
  rtl: boolean;
};
export const GridBody: React.FC<GridBodyProps> = ({
  tasks,
  dates,
  rowHeight,
  svgWidth,
  columnWidth,
  todayColor,
  rtl
}) => {
  let y = 0;

  const gridRows: ReactChild[] = [];
  const rowLines: ReactChild[] = [
    <line key="RowLineFirst" x="0" y1={0} x2={svgWidth} y2={0} className={styles.gridRowLine} />
  ];

  const instanceOfNow = new Date();

  // Get the total hours in a day
  const totalHoursInDay = 24;

  // Calculate the percentage of the remaining hours
  const currentHrsPerc = instanceOfNow.getHours() / totalHoursInDay;
  for (const task of tasks) {
    gridRows.push(
      <rect
        key={'Row' + task.id}
        x="0"
        y={y}
        width={svgWidth}
        height={rowHeight}
        className={styles.gridRow}
      />
    );
    rowLines.push(
      <line
        key={'RowLine' + task.id}
        x="0"
        y1={y + rowHeight}
        x2={svgWidth}
        y2={y + rowHeight}
        className={styles.gridRowLine}
      />
    );
    /**
     * adds each subtask's height
     * to the hight of the height of
     * the today column highlighter
     */
    y += !task.hideChildren ? rowHeight : rowHeight * ((task.subTask?.length || 1) + 1);
  }

  const now = new Date();
  let tickX = 0;
  const ticks: ReactChild[] = [];
  let today: ReactChild = <rect />;
  for (let i = 0; i < dates.length; i++) {
    const date = dates[i];
    ticks.push(
      <line
        key={date.getTime()}
        x1={tickX}
        y1={0}
        x2={tickX}
        y2={'100%'}
        className={styles.gridTick}
      />
    );
    if (
      (i + 1 !== dates.length &&
        date.getTime() < now.getTime() &&
        dates[i + 1].getTime() >= now.getTime()) ||
      // if current date is last
      (i !== 0 &&
        i + 1 === dates.length &&
        date.getTime() < now.getTime() &&
        addToDate(date, date.getTime() - dates[i - 1].getTime(), 'millisecond').getTime() >=
          now.getTime())
    ) {
      today = (
        <rect
          x={tickX + columnWidth * 0.5} // place at the center of the day
          y={0}
          width={5} // 5% of the total  width
          height={'100%'} // height={y}
          fill={todayColor}
        />
      );
    }
    // rtl for today
    if (
      rtl &&
      i + 1 !== dates.length &&
      date.getTime() >= now.getTime() &&
      dates[i + 1].getTime() < now.getTime()
    ) {
      today = (
        <rect
          x={tickX + columnWidth * 0.5} // place at the center of the day
          y={0}
          width={5} // 5% of the total  width
          height={'100%'} // height={y}
          xlinkTitle="Today"
          fill={todayColor}
        />
      );
    }
    tickX += columnWidth;
  }
  return (
    <g className="gridBody h-full">
      {/* <g className="rows">{gridRows}</g> */}
      {/* <g className="rowLines">{rowLines}</g> */}
      <g className="ticks h-full">{ticks}</g>
      {/* <g className="today">
        <rect
          x={tickX + columnWidth * 0.5} // place at the center of the day
          y={0}
          width={columnWidth * 0.05} // 5% of the total  width
          // height={"100%"} // height={y}
          // fill={"red"}
        />
      </g> */}
      <g>{today}</g>
    </g>
  );
};
