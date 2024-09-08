import React from 'react';
import style from './bar.module.css';

type BarDisplayProps = {
  x: number;
  y: number;
  width: number;
  height: number;
  isSelected: boolean;
  /* progress start point */
  progressX: number;
  progressWidth: number;
  barCornerRadius: number;
  styles: {
    backgroundColor: string;
    backgroundSelectedColor: string;
    progressColor: string;
    progressSelectedColor: string;
  };
  onMouseDown: (event: React.MouseEvent<SVGPolygonElement, MouseEvent>) => void;
};
export const BarDisplay: React.FC<BarDisplayProps> = ({
  x,
  y,
  width,
  height,
  isSelected,
  progressX,
  progressWidth,
  barCornerRadius,
  styles,
  onMouseDown
}) => {
  const getProcessColor = () => {
    return isSelected ? styles.progressSelectedColor : styles.progressColor;
  };

  const getBarColor = () => {
    return styles.backgroundColor;
  };

  return (
    <g onMouseDown={onMouseDown}>
      <rect
        x={y}
        width={width}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        // fill={getBarColor()}
        className={style.barBackground + ' fill-red-500 rounded-full '}
      />
      <rect
        x={progressX}
        width={progressWidth}
        y={y}
        height={height}
        ry={barCornerRadius}
        rx={barCornerRadius}
        fill={getProcessColor()}
      />
    </g>
  );
};
