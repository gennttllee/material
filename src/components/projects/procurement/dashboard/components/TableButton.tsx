import { FC } from 'react';

interface Props {
  icon?: string;
  onPress: () => void;
}

export const TableButton: FC<Props> = ({ onPress, icon }) => {
  return (
    <button
      className="border-ashShade-1 border-solid border py-2 px-4 rounded-md hover:bg-lightblue hover:border-bblue"
      onClick={onPress}>
      <img src={icon} alt="" className='w-full' />
    </button>
  );
};
