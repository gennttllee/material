import { TbPlus, TbMinus } from 'react-icons/tb';

interface Props {
  setActivity: React.Dispatch<React.SetStateAction<'Disburse' | 'Return'>>;
  setShowModal: React.Dispatch<React.SetStateAction<boolean>>;
}

const ActivitySelector = ({ setActivity, setShowModal }: Props) => {
  return (
    <div className="absolute top-11 right-0 flex flex-col gap-2 w-32 rounded-md bg-white border border-pbg">
      <button
        className="flex gap-2 items-center text-redShades-2 p-2 hover:bg-redShades-1 text-sm"
        onClick={() => {
          setActivity('Disburse');
          setShowModal(true);
        }}>
        <TbMinus />
        <span>Disburse</span>
      </button>
      <button
        className="flex gap-2 items-center text-bgreen-0 p-2 hover:bg-bgreen-1 text-sm"
        onClick={() => {
          setActivity('Return');
          setShowModal(true);
        }}>
        <TbPlus />
        <span>Return</span>
      </button>
    </div>
  );
};
export default ActivitySelector;
