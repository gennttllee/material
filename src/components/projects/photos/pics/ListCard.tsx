import React from 'react';
import { AiOutlineFile } from 'react-icons/ai';
import { setFiles, changeFieldValue } from 'store/slices/folderSlice';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { getMyFileIndex } from './DrawingCard';
import { Doc } from '../../documents/drawings/DocModal';

interface Prop {
  item: Doc;
}
const ListCard = ({ item }: Prop) => {
  let dispatch = useAppDispatch();
  let { files } = useAppSelector((m) => m.folder);
  return (
    <div
      onClick={() => {
        dispatch(
          changeFieldValue({
            previewing: getMyFileIndex(files, item),
            modal: true
          })
        );
      }}
      className="w-full"
    >
      <div className="w-full flex hover:cursor-pointer items-center justify-between  py-4 ">
        <div className="bg-white flex items-center rounded-b-md">
          <AiOutlineFile size={18} color="#C8CDD4" />
          <span className="ml-3 font-semibold hover:text-bblue hover:underline text-bash">
            {item.alias}
          </span>
        </div>

        <span className="text-bash"></span>
      </div>
      <hr />
    </div>
  );
};

export default ListCard;
