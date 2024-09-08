import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaFolder } from 'react-icons/fa';
import { convertToProper } from 'components/shared/utils';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { removeFolder, setCurrentFolder } from 'store/slices/folderSlice';
import { FaEllipsisVertical } from 'react-icons/fa6';
import {
  TbChevronRight,
  TbDownload,
  TbEdit,
  TbEye,
  TbFolderSymlink,
  TbTrash,
  TbUser
} from 'react-icons/tb';
import { CardOptions } from '../drawings/DrawingCard';
import Options from './Options';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { TheOption } from 'pages/projects/Home/Components/ProjectCard';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import AccessModal from './AccessModal';
import { setModal } from 'store/slices/contractorProfileSlice';
import { FileFolder } from '../types';
import { Doc, LatestDoc, NewDoc } from './SingleDocModal';
import { StoreContext } from 'context';
import { postForm } from 'apis/postForm';
import { displaySuccess } from 'Utils';
import { setLoading } from 'store/slices/teamSlice';
import CreateNewFolderModal from './CreateNewFolderModal';
import { UserRoles } from 'Hooks/useRole';
import ConfirmationModal from './ConfirmationModal';
import SuperModal from 'components/shared/SuperModal';
import useFiles from './useFiles';

interface Prop extends FileFolder {}

const FolderCard = ({ name, _id, access, alias, createdBy }: Prop) => {
  let navigate = useNavigate();
  let dispatch = useAppDispatch();
  let { activeProject } = useContext(StoreContext);
  const [options, setOptions] = useState(false);
  const [manage, setManage] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [downloading, setDownloading] = useState(false);
  let folders = useAppSelector((m) => m.folder);
  let user = useAppSelector((m) => m.user);
  let { downloadFolder } = useFiles(true);
  useEffect(() => {}, []);

  const optionsRef = useRef<any>();
  useClickOutSideComponent(optionsRef, () => {
    setOptions(false);
  });

  let isNew = useMemo(() => {
    return !folders.files.find((m: LatestDoc) => m?.folderId === _id);
  }, []);

  const handleDelete = async () => {
    setDeleting(true);
    let { response, e } = await postForm('delete', `files/folder/delete?folderId=${_id}`);

    if (response) {
      dispatch(removeFolder(_id));
      displaySuccess('Folder removed successfully');
    }
    setDeleting(false);
  };

  const canManangeFolder = useMemo(() => {
    return createdBy && user._id === createdBy;
  }, [user, _id]);

  const shouldShow = useMemo(() => {
    let haveAccess = access.find((m) => m.userId === user._id);
    return haveAccess || canManangeFolder;
  }, [access, canManangeFolder]);

  const handleFolderDownload = async () => {
    setDownloading(true);
    await downloadFolder(_id);
    setDownloading(false);
  };

  return (
    <>
      {manage && (
        <AccessModal
          id={_id}
          type="folder"
          closer={() => {
            setManage(false);
          }}
        />
      )}

      {editing && (
        <CreateNewFolderModal
          _id={_id}
          _value={{ name, alias }}
          isEditing={editing}
          toggler={() => setEditing(!editing)}
        />
      )}

      {deleting && (
        <SuperModal
          closer={() => {
            setDeleting(false);
          }}>
          <div className="bg-black w-full h-full bg-opacity-30 flex flex-col justify-center items-center">
            <ConfirmationModal
              className=" bg-white p-4 rounded-md flex flex-col items-center "
              onCancel={() => {
                setDeleting(false);
              }}
              buttonText="Delete"
              onProceed={handleDelete}
              text={'Are you Sure?\nDoing this will delete all files and folders in this Folder'}
            />
          </div>
        </SuperModal>
      )}

      <div
        onClick={() => {
          if (!options) {
            dispatch(setCurrentFolder(_id));
            navigate(`${_id}`);
          }
        }}
        className={`w-full ${
          name === 'media' ? 'hidden' : ''
        } cursor-pointer flex flex-col items-center bg-white p-4  relative rounded-lg  ${
          shouldShow ? '' : 'hidden'
        } `}>
        <div className="flex justify-end items-center w-full">
          {isNew && (
            <span className=" rounded-3xl bg-bgreen-1 text-xs  text-bgreen-0 py-1 px-3 ">
              New File
            </span>
          )}
          <span
            onClick={(e) => {
              e.stopPropagation();
              setOptions(true);
            }}
            className=" p-2  hover:bg-ashShade-0 rounded-full">
            <FaEllipsisVertical color="#9099A8" size={16} />
          </span>
        </div>

        <FaFolder size={105} color="#437ADB" className=" mt-4" />
        <div className=" flex mt-14 items-center w-full justify-between">
          <span className=" font-semibold truncate">
            {/* {name.length > 1 ? convertToProper(name) : name.toUpperCase()} */}
            {name}
          </span>

          <span className="  flex items-center">
            <TbUser className="" />
            <span className=" text-xs">
              {Math.min(activeProject?.team.length || 1, access.length)}
            </span>
          </span>
        </div>
        {options && (
          <span
            ref={optionsRef}
            className=" shadow-bnkle gap-y-2 bg-white absolute right-0 top-7 p-2">
            {canManangeFolder && (
              <>
                <Options
                  onClick={() => {
                    setManage(true);
                    setOptions(false);
                  }}
                  iconleft={TbFolderSymlink}
                  iconRight={TbChevronRight}
                  text="Manage folder"
                />
                <Options
                  onClick={() => {
                    setEditing(true);
                  }}
                  iconleft={TbEdit}
                  text="Rename"
                />
              </>
            )}

            <TheOption
              onClick={handleFolderDownload}
              loaderColor="blue"
              loading={downloading}
              icon={TbDownload}
              text="Download"
            />
            {canManangeFolder && (
              <TheOption
                // loading={deleting}
                loaderColor="red"
                className=" hover:bg-redShades-1  text-redShades-2 hover:text-redShades-2 "
                iconColor="#B63434"
                iconHoveredColor="#B63434"
                onClick={() => setDeleting(true)}
                icon={TbTrash}
                text="Delete"
              />
            )}
          </span>
        )}
      </div>
    </>
  );
};

export default FolderCard;
