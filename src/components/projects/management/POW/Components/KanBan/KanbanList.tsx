import React, { memo, useMemo, useState } from 'react';
import { SubTask as SubTaskType, SubTaskStatus } from '../../../types';
import { Droppable } from 'react-beautiful-dnd';
import { flexer, hoverFade, horizontalScrollBar } from '../../../../../../constants/globalStyles';
import { TbPlus } from 'react-icons/tb';
import useRole from '../../../../../../Hooks/useRole';
import Modal from '../../../../../shared/Modal';
import SubTaskForm from '../subTaskForm';
import DraggableSubtaskCard from './DragableSubtaskCard';

const getListStyle = (isDraggingOver: boolean) => ({
  background: isDraggingOver ? 'whitesmoke' : 'white',
  width: '100%'
});

const KanbanList = ({
  type,
  data,
  index
}: {
  index: number;
  type: SubTaskStatus;
  data: SubTaskType[];
}) => {
  const [showModal, setModal] = useState(false);
  const { role } = useRole();

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const typeColor = useMemo(() => {
    switch (type) {
      case SubTaskStatus.awaitingApproval:
        return 'text-bash';
      case SubTaskStatus.ongoing:
        return 'text-borange';
      case SubTaskStatus.verified:
        return 'text-bblue';
      case SubTaskStatus.completed:
        return 'text-[#459A33]';
      case SubTaskStatus.notStarted:
        return 'text-bred';
    }
  }, [type]);

  const ModalView = showModal && (
    <div className="bg-white absolute cursor-auto  w-11/12 md:max-w-[500px] h-fit p-6 flex-col rounded-lg z-10">
      <SubTaskForm {...{ toggleModal }} />
    </div>
  );

  return (
    <>
      <Droppable droppableId={type}>
        {(provided, snapshot) => (
          <div
            key={type}
            ref={provided.innerRef}
            {...provided.droppableProps}
            style={getListStyle(snapshot.isDraggingOver)}
            className={`h-full overflow-hidden bg-white rounded-md py-4  ${
              !index ? null : 'ml-5'
            } !w-[300px] flex-none`}>
            <div className={flexer + 'px-4'}>
              <div className="flex items-center">
                <p className={typeColor + ' text-5xl transform -translate-y-1'}>&bull;</p>
                <p className="font-semibold text-xl capitalize ml-2">{type}</p>
              </div>
              <div
                onClick={toggleModal}
                title="Add Subtask"
                className={
                  hoverFade +
                  ` ${role !== 'contractor' && 'hidden'} ${
                    type !== SubTaskStatus.awaitingApproval && 'hidden'
                  } `
                }>
                <TbPlus className="text-borange" />
              </div>
            </div>

            <div
              className={'flex flex-col pl-4 pr-3  overflow-scroll h-[91%]' + horizontalScrollBar}>
              {React.Children.toArray(
                data.map((subTask, index) => <DraggableSubtaskCard {...{ subTask, index, role }} />)
              )}
            </div>
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <Modal
        visible={showModal}
        toggle={toggleModal}
        overlayClassName="opacity-50 backdrop-blur-0"
        className="backdrop-blur-0 drop-shadow-lg">
        {ModalView}
      </Modal>
    </>
  );
};

export default memo(KanbanList);
