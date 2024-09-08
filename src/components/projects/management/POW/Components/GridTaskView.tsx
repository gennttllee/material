import React, { memo, useContext, useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { PMStoreContext } from '../../Context';
import TaskCard from './TaskCard';
import { ProjectTask, TaskStatus } from '../../types';

const GridTaskList = () => {
  const { tasks, taskStatusFilter, draftsToSubmit } = useContext(PMStoreContext);
  const { powId } = useParams() as { powId: string };

  const { filteredTasks, draftTasks } = useMemo(() => {
    let filteredTasks: ProjectTask[] = [],
      draftTasks: ProjectTask[] = [];
    if (!tasks[powId]) return { filteredTasks, draftTasks };

    if (taskStatusFilter) {
      filteredTasks = [...tasks[powId]].filter((one) => one.status === taskStatusFilter);
    } else {
      filteredTasks = [...tasks[powId]].filter((one) => one.status !== TaskStatus.draft);
      draftTasks = [...tasks[powId]].filter((one) => one.status === TaskStatus.draft);
    }

    return { filteredTasks, draftTasks };
  }, [tasks, powId, taskStatusFilter]);

  return (
    <div className="  overflow-scroll">
      <GridLayout label="Draft" items={draftTasks} />
      <GridLayout label="Task" items={filteredTasks} showNotFound />
      <div className={`w-full ${draftsToSubmit[0] ? 'h-16' : 'h-0'}`} />
    </div>
  );
};

const GridLayout = ({
  label,
  items,
  showNotFound
}: {
  label: string;
  items: ProjectTask[];
  showNotFound?: boolean;
}) => {
  const navigate = useNavigate();

  return items[0] ? (
    <>
      <p className={`font-Demibold my-6`}>
        {items.length} {label}
        {items.length > 1 ? 's' : ''}
      </p>
      <div className="overflow-x-scroll overflow-y-auto grid gap-3 md:gap-5 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 w-full pb-20">
        {React.Children.toArray(
          items.map((task) => (
            <TaskCard
              key={task._id}
              {...{ task }}
              onClick={() => {
                navigate(`task/${task._id}`);
              }}
            />
          ))
        )}
      </div>
    </>
  ) : showNotFound ? (
    <p>No task found</p>
  ) : (
    <></>
  );
};

export default memo(GridTaskList);
