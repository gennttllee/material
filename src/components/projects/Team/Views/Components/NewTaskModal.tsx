import NewGroupModal from './NewGroupModal';

interface NewTaskModalProps {
  closer: () => void;
}

type Selected = { id: string; name: string };

const NewTaskModal = ({ closer }: NewTaskModalProps) => {
  return (
    <NewGroupModal title='Create task chat' closer={closer} isTaskChat />
  );
};

export default NewTaskModal;
