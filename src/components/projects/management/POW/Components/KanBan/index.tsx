import React, { useContext, useEffect, useState } from 'react';
import { ProjectTask, SubTask as SubTaskType, SubTaskStatus, SubTask } from '../../../types';
import { DragDropContext, DropResult } from 'react-beautiful-dnd';
import KanbanList from './KanbanList';
import useRole from '../../../../../../Hooks/useRole';
import { displayError } from 'Utils';
import { PMStoreContext } from '../../../Context';
import { canEditSubTask } from '../../helpers';
import useFetch from '../../../../../../Hooks/useFetch';
import { editSubTask } from '../../../../../../apis/tasks';
import { useParams } from 'react-router-dom';
import { horizontalScrollBar } from 'constants/globalStyles';
import { toast } from 'react-toastify';

const move = (
  source: SubTaskType[],
  destination: SubTaskType[],
  droppableSource: DropResult['source'],
  droppableDestination: DropResult['destination']
) => {
  const sourceClone = Array.from(source);
  const destClone = Array.from(destination);
  const [removed] = sourceClone.splice(droppableSource.index, 1);

  if (droppableDestination) destClone.splice(droppableDestination.index, 0, removed);

  const result: { [key: string]: any } = {};
  result[droppableSource.droppableId] = sourceClone;

  if (droppableDestination) result[droppableDestination.droppableId] = destClone;

  return result;
};

// a little function to help us with reordering the result
const reorder = (list: SubTaskType[], startIndex: number, endIndex: number) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex, 1);
  result.splice(endIndex, 0, removed);

  return result;
};

const KanbanView = () => {
  const { role } = useRole();
  const { powId } = useParams() as { powId: string };
  const { activeTask, setContext } = useContext(PMStoreContext);
  const [data, setData] = useState<{ [key: string]: SubTaskType[] }>({});
  const { load: statusLoad } = useFetch<{
    subTask: SubTask;
    task: ProjectTask;
  }>();

  useEffect(() => {
    if (activeTask)
      setData({
        [SubTaskStatus.awaitingApproval]: activeTask.subTasks.filter(
          (one) => one.status === SubTaskStatus.awaitingApproval
        ),
        [SubTaskStatus.notStarted]: activeTask.subTasks.filter(
          (one) => one.status === SubTaskStatus.notStarted
        ),
        [SubTaskStatus.completed]: activeTask.subTasks.filter(
          (one) => one.status === SubTaskStatus.completed
        ),
        [SubTaskStatus.ongoing]: activeTask.subTasks.filter(
          (one) => one.status === SubTaskStatus.ongoing
        ),
        [SubTaskStatus.verified]: activeTask.subTasks.filter(
          (one) => one.status === SubTaskStatus.verified
        )
      });
  }, [activeTask]);

  const columns = Object.values(SubTaskStatus);

  const onDragEnd = async (result: DropResult) => {
    const { source, draggableId, destination } = result;

    /**
     * 1. if no destination was specified or
     * the source is the same as the destination
     */
    if (!destination || source.droppableId === destination.droppableId) {
      return;
    }

    // Update item column IDs
    const itemId = draggableId;
    const item = activeTask?.subTasks.find((item) => item._id === itemId) as SubTaskType;

    /**
     * if an item can not be found or
     * the persmissions are conflicting with the action
     */
    if (
      !item ||
      !canEditSubTask({
        role,
        origin: item.status,
        dest: destination.droppableId as SubTaskStatus
      })
    ) {
      return displayError('Action not allowed');
    }

    const action = statusLoad(editSubTask(item._id, { status: destination.droppableId })).then(
      (res) => {
        const srcColumn = source.droppableId as SubTaskStatus;
        const dstColumn = destination.droppableId as SubTaskStatus;

        // Reorder items within the same column
        if (srcColumn === dstColumn) {
          const items = reorder(
            data[srcColumn],
            result.source.index,
            result.destination?.index || 0
          );

          setData((prev) => ({ ...prev, [srcColumn]: items }));
        } else {
          item.status = dstColumn;
          // Move items between columns
          setData((prev) => {
            const result = move(data[srcColumn], data[dstColumn], source, destination);

            return {
              ...prev,
              [srcColumn]: result[srcColumn],
              [dstColumn]: result[dstColumn]
            };
          });
        }

        setContext((prev) => {
          if (!prev.activeTask) return prev;

          const newSubtaks = prev.activeTask.subTasks.map((st) =>
            st._id === item._id ? res.data.subTask : st
          );

          const newTask = {
            ...prev.activeTask,
            subTasks: newSubtaks,
            status: res.data.task.status
          };

          return {
            ...prev,
            activeTask: newTask,
            tasks: {
              ...prev.tasks,
              [powId]: prev.tasks[powId].map((t) => (t._id === activeTask?._id ? newTask : t))
            }
          };
        });
      }
    );

    toast.promise(action, {
      pending: `updating... ${item.name}`,
      success: 'Uploaded Successfully',
      error: 'Update rejected'
    });
  };

  if (!data[SubTaskStatus.awaitingApproval]) return null;

  return (
    <div className="h-full w-full pb-3">
      <DragDropContext onDragEnd={onDragEnd}>
        <div
          className={
            'flex justify-between h-[98%] w-full !overflow-x-scroll pb-10' + horizontalScrollBar
          }>
          {React.Children.toArray(
            columns.map((status, index) => (
              <KanbanList type={status} {...{ index }} data={data[status]} />
            ))
          )}
        </div>
      </DragDropContext>
    </div>
  );
};

export default KanbanView;
