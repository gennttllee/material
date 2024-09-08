import React, { useState } from 'react';
import { BsCheckLg } from 'react-icons/bs';
import { IoMdClose } from 'react-icons/io';
interface Prop {
  permission: string;
  allowed: boolean;
}
const Permissions = ({ permission, allowed }: Prop) => {
  const [isAllowed, setIsallowed] = useState(allowed);
  const CheckIcon = ({ cond }: { cond: boolean }) =>
    cond ? <BsCheckLg size={16} color="green" /> : <IoMdClose color="red" size={16} />;

  const toggleAllowed = () => setIsallowed((prev) => !prev);

  return (
    <tr className=" odd:bg-ashShade-0">
      <td className="py-3 px-4 w-fit">{permission}</td>
      <td className="" onClick={toggleAllowed}>
        <CheckIcon cond={isAllowed} />
      </td>
      <td className="text-center " onClick={toggleAllowed}>
        <CheckIcon cond={!isAllowed} />
      </td>
    </tr>
  );
};

export default Permissions;
