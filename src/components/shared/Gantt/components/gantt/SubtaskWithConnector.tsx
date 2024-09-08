import React, { useMemo } from 'react';
import Xarrow from 'react-xarrows';
import { BarTask } from '../../types/bar-task';
import SubtaskGanttItem, { SubtaskGanttItemProps } from './SubtaskGanttItem';

export interface SubtaskWithConnectorProps extends SubtaskGanttItemProps {
  allTasks: BarTask[];
}

const SubtaskWithConnector = ({ subtaskData, allTasks, ...props }: SubtaskWithConnectorProps) => {
  const arrows = useMemo(() => {
    /**
     * this task in all task
     * and creates a relation map
     * of subtask dependencies
     */
    const data: {
      isParent: boolean;
      id: string;
      relation: 'parent' | 'child';
    }[] = [];
    // 1. find subtasks that this subtask depends on
    for (const depId of subtaskData.dependencies) {
      // 1.1 find parent task
      const parent = allTasks.find((one) => one.subTask?.find((one) => one._id === depId));

      // 1.. determine if the task is expanded or not
      if (parent)
        data.push({
          relation: 'parent',
          isParent: parent && !parent.hideChildren,
          id: parent && !parent.hideChildren ? parent.id : depId
        });
    }
    // 2. find subtask that depend on this subtask
    for (const task of allTasks) {
      if (task.subTask)
        for (const subtask of task.subTask) {
          const findMatch = subtask.dependencies && subtask.dependencies.includes(subtaskData._id);
          if (findMatch) {
            // check if the relation is not already (caught &) stored
            const exists = data.find(
              (one) => one.id === (!task.hideChildren ? task.id : subtask._id)
            );
            // if not recorded (record it) else skip it & one of them is closed
            if (!exists && !task.hideChildren)
              data.push({
                relation: 'child',
                isParent: !task.hideChildren,
                id: !task.hideChildren ? task.id : subtask._id
              });
          }
        }
    }

    return data;
  }, [subtaskData, allTasks]);

  return (
    <>
      {arrows[0]
        ? React.Children.toArray(
            arrows.map(({ isParent, id, relation }) => (
              <Xarrow
                color="#000"
                strokeWidth={1.5}
                dashness={
                  isParent
                    ? {
                        strokeLen: 3,
                        nonStrokeLen: 3,
                        animation: false
                      }
                    : undefined
                }
                // headShape={(<TbSquareRotatedFilled />) as any}
                showTail
                tailSize={3}
                headSize={3}
                tailShape="circle"
                start={`GanttTask${relation === 'parent' ? id : subtaskData._id}`} //can be react ref
                end={`GanttTask${relation === 'child' ? id : subtaskData._id}`} //or an id
              />
            ))
          )
        : null}
      <SubtaskGanttItem
        {...{
          ...props,
          subtaskData
        }}
      />
    </>
  );
};

export default SubtaskWithConnector;
