import { convertToProper } from 'components/shared/utils';
import React, { useState } from 'react';
import { IoEllipsisVertical } from 'react-icons/io5';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { FaRegEdit } from 'react-icons/fa';

interface Props {
  name: string;
  email: string;
  role: string;
  isLast?: boolean;
}
const TableRow = ({ name, email, role, isLast }: Props) => {
  let [modal, setModal] = useState(false);
  return (
    <tr onClick={() => setModal(false)} className={'border-bash  text-bash relative'}>
      <td className="py-4 ">
        {!isLast ? (
          <hr className="absolute bg-ashShade-3 h-[2px] w-[calc(100%-48px)] wc bottom-0 mx-6 " />
        ) : null}
        <span className="flex items-center ml-4 ">
          {/* <span className="mr-4 border border-bash rounded-sm h-6 w-6 "></span> */}
          <span className="ml-4">{name}</span>
        </span>
      </td>
      <td>{email}</td>
      <td>
        <span className="flex items-center justify-between mr-8">
          <span>{convertToProper(role)}</span>
          <span
            className="p-2 rounded-full hover:bg-ashShade-0"
            onClick={(e) => {
              e.stopPropagation();
              setModal(true);
            }}
          >
            <IoEllipsisVertical size={16} color="#C8CDD4" />
          </span>
        </span>
      </td>
      {modal && (
        <span className="w-28 z-10 hover:cursor-pointer shadow-lg rounded-md absolute right-0 top-4 bg-white p-2">
          <div className="w-full p-2 hover:bg-bbg rounded-lg flex items-center">
            <FaRegEdit size={12} color="#437ADB" />
            <span className=" text-sm ml-3 text-bblue">Edit</span>
          </div>

          <div className="w-full p-2 hover:bg-bbg rounded-lg flex items-center">
            <RiDeleteBin6Line size={12} color="#437ADB" />
            <span className=" text-sm ml-3 text-bblue">Delete</span>
          </div>
        </span>
      )}
    </tr>
  );
};

export default TableRow;
