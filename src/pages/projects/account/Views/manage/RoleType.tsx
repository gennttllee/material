import { FaRegEdit } from 'react-icons/fa';
import { useState } from 'react';

interface Prop {
  title: string;
  isCustom?: boolean;
}
const RoleType = ({ title, isCustom }: Prop) => {
  const [hover, setHover] = useState(false);
  return (
    <div
      onMouseOver={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="hover:bg-lightblue hover:cursor-pointer  p-2 hover:text-bblue rounded-md w-full my-0.5 flex items-center justify-between"
    >
      {title}
      {isCustom && <FaRegEdit size={16} color={hover ? '#437ADB' : '#C8CDD4'} />}
    </div>
  );
};

export default RoleType;
