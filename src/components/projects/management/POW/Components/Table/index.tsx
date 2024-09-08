import React, { useContext, useMemo } from 'react';
import { ProjectTask, TaskStatus } from '../../../types';
import { PMStoreContext } from '../../../Context';
import { useParams } from 'react-router-dom';
import TableViewLayout from './Layouts/TableViewLayout';

function TableView(): JSX.Element {
  const { powId } = useParams() as { powId: string };
  const { tasks, taskStatusFilter } = useContext(PMStoreContext);

  const { draftTasks, otherTasks } = useMemo(() => {
    let data: ProjectTask[];
    /**
     * filter task depending on their status
     * ongoing, ... etc
     */
    if (taskStatusFilter) {
      data = [...tasks[powId]].filter((one) => one.status === taskStatusFilter);
    } else {
      data = [...tasks[powId]];
    }
    return {
      draftTasks: data.filter((task) => task.status === TaskStatus.draft),
      otherTasks: data.filter((task) => task.status !== TaskStatus.draft)
    };
  }, [tasks, taskStatusFilter, powId]);

  return (
    <div className="h-[80vh] overflow-scroll w-full max-w-md md:max-w-6xl lg:max-w-7xl xl:max-w-full">
      {draftTasks[0] ? <TableViewLayout data={draftTasks} label="Draft" /> : null}
      <TableViewLayout data={otherTasks} label="Task" />
      <div className="h-10" />
    </div>
  );
}

export default TableView;
