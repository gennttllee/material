import { UserRoles } from 'Hooks/useRole';
import React, { FC, useMemo } from 'react';
import { SubTask as SubTaskType, SubTaskStatus } from '../../../types';
import { Draggable } from 'react-beautiful-dnd';
import SubTaskCard from '../SubTaskCard';

interface DraggableSubtaskCardProps {
  role: UserRoles;
  subTask: SubTaskType;
  index: number;
}

const getItemStyle = (isDragging: boolean, draggableStyle: any) => ({
  // some basic styles to make the items look a bit nicer
  userSelect: 'none',

  // change background colour if dragging
  //   background: isDragging ? "lightgreen" : "grey",

  // styles we need to apply on draggables
  ...draggableStyle
});

const DraggableSubtaskCard: FC<DraggableSubtaskCardProps> = ({ role, subTask, index }) => {
  const isDragDisabled = useMemo(() => {
    let status = false;
    switch (role) {
      case UserRoles.Consultant && UserRoles.Contractor:
        return (
          subTask.status === SubTaskStatus.awaitingApproval ||
          subTask.status === SubTaskStatus.verified
        );
      case UserRoles.ProjectOwner:
        return (
          subTask.status === SubTaskStatus.awaitingApproval ||
          subTask.status === SubTaskStatus.notStarted ||
          subTask.status === SubTaskStatus.ongoing
        );
      case UserRoles.ProjectManager:
        return subTask.status === SubTaskStatus.ongoing;
      case UserRoles.PortfolioManager:
        return subTask.status === SubTaskStatus.ongoing;
      case UserRoles.Developer:
        return subTask.status === SubTaskStatus.ongoing;
      default:
        return status;
    }
  }, [role, subTask]);

  return (
    <Draggable
      isDragDisabled={isDragDisabled}
      draggableId={subTask._id}
      key={subTask._id}
      index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(snapshot.isDragging, provided.draggableProps.style)}>
          <SubTaskCard
            className={index ? 'mt-5 !mb-0' : '!mb-0'}
            {...{ subTask }}
            canCheck={false}
            hasMenu
          />
        </div>
      )}
    </Draggable>
  );
};

export default DraggableSubtaskCard;
