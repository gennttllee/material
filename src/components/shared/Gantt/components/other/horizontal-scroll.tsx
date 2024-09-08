import styles from './horizontal-scroll.module.css';
import React, { SyntheticEvent, useRef, useEffect } from 'react';
import { horizontalScrollBar } from '../../../../../constants/globalStyles';

export const HorizontalScroll: React.FC<{
  scroll: number;
  svgWidth: number;
  taskListWidth: number;
  rtl: boolean;
  onScroll: (event: SyntheticEvent<HTMLDivElement>) => void;
}> = ({ scroll, svgWidth, taskListWidth, rtl, onScroll }) => {
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollLeft = scroll;
    }
  }, [scroll]);

  return (
    <div
      dir="ltr"
      style={{
        margin: rtl ? `0px ${taskListWidth}px 0px 0px` : `0px 0px 0px ${taskListWidth}px`
      }}
      className={styles.scrollWrapper + horizontalScrollBar + '!bg-pbg'}
      onScroll={onScroll}
      ref={scrollRef}>
      <div style={{ width: svgWidth }} className={styles.scroll} />
    </div>
  );
};
