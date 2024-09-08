import React from 'react';
import { centered } from '../../../../../constants/globalStyles';
import styles from './task-list-header.module.css';

export const TaskListHeaderDefault: React.FC<{
  headerHeight: number;
  rowWidth: string;
  fontFamily: string;
  fontSize: string;
}> = ({ headerHeight }) => {
  return (
    <div className="w-full flex items-end justify-end" style={{ height: headerHeight - 2 }}>
      <p className="ml-11 font-Medium text-sm pb-1 w-full">
        <span>SN</span>
        <span className="ml-2">Title</span>
      </p>
    </div>
  );
};
