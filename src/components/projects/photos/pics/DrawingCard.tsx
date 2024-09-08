import React, { useEffect, useState, useRef, useCallback } from 'react';
import { IoImageOutline } from 'react-icons/io5';
import { FiFilm, FiDownload } from 'react-icons/fi';
import { HiEllipsisVertical } from 'react-icons/hi2';
import { AiOutlineEye } from 'react-icons/ai';
import { FaRegEdit } from 'react-icons/fa';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Doc } from '../../documents/drawings/DocModal';
import { postForm } from 'apis/postForm';
import { isTemplateSpan } from 'typescript';
import construction from 'assets/construction.svg';
import { handleDownload, truncateText } from 'components/shared/utils';
import { useAppSelector, useAppDispatch } from 'store/hooks';
import { displayError, displayInfo, displaySuccess, displayWarning } from 'Utils';
import { setFiles, changeFieldValue } from 'store/slices/folderSlice';
import { upload } from '@testing-library/user-event/dist/upload';
import Loader, { LoaderX } from 'components/shared/Loader';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import ChangeFolderModal from 'components/projects/documents/document-repo/ChangeFolderModal';
import { LatestDoc } from 'components/projects/documents/document-repo/SingleDocModal';
import { file, folder } from 'jszip';
interface Prop {
  item: LatestDoc;
}

export const getMyFileIndex = (files: LatestDoc[], item: LatestDoc) => {
  for (let i = 0; i < files.length; i++) {
    if (files[i]._id === item._id) {
      return i;
    }
  }
  return 0;
};
const DrawingCard = ({ item }: Prop) => {
  const [ellipsis, setEllipsis] = useState(false);
  const [type, setType] = useState<string>(item.ContentType.split('/')[0]);
  const [blob, setBlob] = useState<any>();
  const { files, all } = useAppSelector((m) => m.folder);
  const dispatch = useAppDispatch();
  const [url, setUrl] = useState<string>('');
  const [deleting, setDeleting] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [serverRenaming, setServerRenaming] = useState(false);
  const inputRef = useRef<any>();
  const optionRef = useRef<any>();

  useClickOutSideComponent(optionRef, () => {
    setEllipsis(false);
  });

  const getImage = async () => {
    let { response, e } = await postForm('post', 'files/download', {
      Bucket: item.Bucket,
      S3Key: item.S3Key
    });
    if (response) {
      setUrl(response.data.data.url);
    }
  };
  useEffect(() => {
    getImage();
    setType(item.ContentType.split('/')[0]);
  }, [item]);
  useEffect(() => {
    getImage();
  }, []);

  const deleteFile = async () => {
    setDeleting(true);
    let { response, e } = await postForm('delete', `files/delete/${item._id}`);
    if (!e && response) {
      displaySuccess('File delete successfully');
      let newFiles = files.filter((m) => m.S3Key !== item.S3Key);
      dispatch(changeFieldValue({ files: newFiles }));
    } else {
      displayWarning("Couldn't delete File " + e.message);
    }
    setDeleting(false);
  };


  const renameFile = async (alias: string) => {
    setServerRenaming(true);

    let { response, e } = await postForm('patch', `files/update/${item._id}`, {
      alias: alias + '.' + item.alias.split('.')[1]
    });
    if (response) {
      for (let i = 0; i < files.length; i++) {
        if (files[i]._id === item._id) {
          let newFiles = [...files] as LatestDoc[];
          newFiles[i] = {
            ...item,
            alias: alias + '.' + item.alias.split('.')[1]
          } as LatestDoc;
          dispatch(changeFieldValue({ all: newFiles }));
          displaySuccess('item renamed successfully');
          setRenaming(false);
          break;
        }
      }
    }
    setServerRenaming(false);
  };
  return (
    <>
      {renaming && (
        <ChangeFolderModal
          toggler={() => {
            setRenaming(!renaming);
          }}
          renaming
          doc={item}
        />
      )}
      <div
        onClick={() => {
          setEllipsis(false);
          setRenaming(false);
        }}
        className="w-full rounded-md">
        <div
          onClick={() => {
            dispatch(
              changeFieldValue({
                previewing: getMyFileIndex(files, item),
                modal: true
              })
            );
          }}
          className="w-full">
          {type === 'image' || url === '' ? (
            <>
              {!url ? (
                <div className="w-full h-44 bg-gray-300 animate-pulse_fast "></div>
              ) : (
                <img
                  src={url}
                  alt="doc"
                  loading="lazy"
                  decoding="async"
                  className="w-full object-cover h-44 rounded-t-md "
                />
              )}
            </>
          ) : (
            <video controls className="w-full object-cover h-44 rounded-t-md ">
              <source src={url}></source>
            </video>
          )}
        </div>

        <div
          onClick={() => setRenaming(false)}
          className="bg-white relative flex p-5 items-center justify-between rounded-b-md">
          {
            <div className="w-full  flex p-2 ">
              <div className="flex w-full items-center ">
                {type === 'image' ? (
                  <IoImageOutline size={18} color="#437ADB" />
                ) : (
                  <FiFilm size={18} color="#437ADB" />
                )}
                <span className="ml-3 font-semibold truncate">{item.alias}</span>
              </div>
              <span
                className=" p-1 rounded-full  hover:bg-ashShade-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setEllipsis(!ellipsis);
                }}>
                <HiEllipsisVertical className="" size={16} color="#5E6777" />
              </span>
            </div>
          }

          {ellipsis ? (
            <div
              ref={optionRef}
              onClick={(e) => e.stopPropagation()}
              className="absolute cursor-pointer right-3 top-10 z-50 bg-white w-36  grid py-2 px-3 grid-cols-1 gap-2 shadow-lg rounded-md ">
              <span
                onClick={() => {
                  dispatch(
                    changeFieldValue({
                      previewing: getMyFileIndex(files, item),
                      modal: true
                    })
                  );
                }}
                className="w-full flex items-center text-bash hover:underline">
                <AiOutlineEye size={16} color="#C8CDD4" className="mr-2" />
                Preview
              </span>
              <span
                onClick={async () => {
                  if (url) {
                    let { response, e } = await postForm('post', 'files/download', {
                      Bucket: item.Bucket,
                      S3Key: item.S3Key
                    });
                    handleDownload(response.data.data.url, item.alias);
                  }
                }}
                className="w-full flex items-center text-bash hover:underline">
                <FiDownload size={16} color="#C8CDD4" className="mr-2" />
                Download
              </span>
              <span
                onClick={() => {
                  setRenaming(true);
                  setEllipsis(false);
                }}
                className="w-full flex items-center text-bash hover:underline">
                <FaRegEdit size={16} color="#C8CDD4" className="mr-2" />
                Rename
              </span>
              <span
                onClick={() => deleteFile()}
                className="w-full cursor-pointer flex items-center text-bash hover:underline">
                <RiDeleteBinLine size={16} color="#C8CDD4" className="mr-2" />
                {deleting ? 'Deleting...' : 'Delete'}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default DrawingCard;
