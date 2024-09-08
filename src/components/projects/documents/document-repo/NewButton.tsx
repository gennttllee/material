import React, { useRef, useState } from 'react';
import { TbFileUpload, TbFolderPlus } from 'react-icons/tb';
import Options from './Options';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import CreateNewFolderModal from './CreateNewFolderModal';
import UploadFileModal from './UploadFileModals';
import useFiles from './useFiles';

type Fn = () => void | Promise<void>;
interface Props {
  folderId?: string;
}

const NewButton = ({ folderId }: Props) => {
  const optionsRef = useRef(null);
  const [options, setOptions] = useState(false);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [uploadFileModal, setUploadFileModal] = useState(false);
  let { _getFiles,getFiles } = useFiles(true);
  useClickOutSideComponent(optionsRef, () => {
    setOptions(false);
  });

  return (
    <>
      {!!newFolderModal && (
        <CreateNewFolderModal parentFolder={folderId} toggler={() => setNewFolderModal(false)} />
      )}
      {uploadFileModal && (
        <UploadFileModal onUploadComplete={getFiles} toggler={() => setUploadFileModal(false)} />
      )}
      <div className="relative">
        <button
          onClick={() => setOptions(true)}
          className="rounded-md bg-bblue text-white px-6 py-2 font-medium">
          {'+  New'}
        </button>
        {options && (
          <span
            ref={optionsRef}
            className="absolute top-12 bg-white shadow-bnkle w-40 rounded-md right-10 z-20 p-2">
            <Options
              onClick={() => {
                setNewFolderModal(true);
              }}
              text="Create folder"
              iconleft={TbFolderPlus}
            />
            <div className="bg-ashShade-3 rounded-full h-[1px] w-full my-1" />
            <div className=" flex flex-col gap-1">
              <Options
                onClick={() => {
                  setUploadFileModal(true);
                }}
                text="Upload Folder"
                iconleft={TbFolderPlus}
              />
              <Options
                onClick={() => {
                  setUploadFileModal(true);
                }}
                text="Upload File"
                iconleft={TbFileUpload}
              />
            </div>
          </span>
        )}
      </div>
    </>
  );
};

export default NewButton;
