import React, { useState, useRef, useMemo, useEffect, useContext } from 'react';
import image from 'assets/docthumbnail.png';
import { AiOutlineFile } from 'react-icons/ai';
import { IoEllipsisVertical } from 'react-icons/io5';
import { TbFolder, TbUser } from 'react-icons/tb';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import Options from '../document-repo/Options';
import { cardOptions, generalCardOptions } from '../constants';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import ChangeFolderModal from '../document-repo/ChangeFolderModal';
import {
  deleteFile,
  editFile,
  getFileUrl,
  handleDownload,
  truncateText
} from 'components/shared/utils';
import { Doc, LatestDoc, NewDoc } from '../document-repo/SingleDocModal';
import { displayError, displaySuccess } from 'Utils';
import { addFolders, changeFieldValue, setFiles } from 'store/slices/folderSlice';
import { groupFiles } from '../document-repo';
import { Navigate, useNavigate } from 'react-router-dom';
import mime from 'mime';
import { postForm } from 'apis/postForm';
import { GetDownloadSignedUrls } from 'apis/AwsFiles';
import { FaFileAlt } from 'react-icons/fa';
import { cArrowShapes } from 'react-xarrows';
import { FileFolder } from '../types';
import AccessModal from '../document-repo/AccessModal';
import { UserRoles } from 'Hooks/useRole';
import { StoreContext } from 'context';

interface Prop {
  name: string;
  toggler?: any;
  changeFolderFn?: () => void;
  renameFileFn?: () => void;
  previewFn: () => void;
  idx?: number;
  doc: LatestDoc;
}

const checkIfisOnlyFile = (
  fileList: LatestDoc[],
  doc: LatestDoc,
  fileFolders: FileFolder[] = []
) => {
  let fileCount = 0;
  let files = fileList.map((m) => {
    if (m.folder === doc.folder || m.folderId === doc.folderId) fileCount++;
  });
  const hasFolders = fileFolders.find((m) => m?.parentFolder === doc.folderId);
  return fileCount < 2 && !hasFolders;
};

const DrawingCard = ({
  name,
  toggler,
  idx,
  changeFolderFn,
  renameFileFn,
  previewFn,
  doc
}: Prop) => {
  let [options, setOptions] = useState(false);
  let ref = React.useRef<HTMLDivElement>(null);
  let folder = useAppSelector((m) => m.folder);
  let  {activeProject} = useContext(StoreContext)
  const [loading, setLoading] = useState(false);
  const [changingAccess, setChangingAccess] = useState(false);
  const [element, setElement] = useState<React.ReactElement>();
  let dispatch = useAppDispatch();
  const [modal, setModal] = useState(false);
  const user = useAppSelector((m) => m.user);
  let navigate = useNavigate();
  let download = async () => {
    handleDownload(await getFileUrl(doc), doc.alias ?? '');
  };
  let deleteCurrentFile = async () => {
    let { response, e } = await deleteFile(doc._id ?? '');
    if (response) {
      let newFiles = folder.files.filter((m: LatestDoc) => m._id !== doc._id);
      let groups = groupFiles(newFiles);
      dispatch(
        changeFieldValue({
          files: newFiles,
          folder: groups
        })
      );
      displaySuccess('File deleted successfully');
    } else if (e) {
      displayError('Could not delete file');
    }
  };

  const handleAccess = () => {
    setChangingAccess(!changingAccess);
    setOptions(!options);
  };
  let rename = async () => {};
  let funcs = [
    () => previewFn(),
    () => {
      changeFolderFn && changeFolderFn();
    },
    handleAccess,
    async () => {
      await download();
    },
    () => {
      renameFileFn && renameFileFn();
    },
    async () => {
      await deleteCurrentFile();
    }
  ];
  const optionsRef = useRef<HTMLElement>(null);
  useClickOutSideComponent(ref, () => setOptions(false));
  useClickOutSideComponent(optionsRef, () => setOptions(false));
  const handlePicture = async () => {
    setLoading(true);
    let url = await GetDownloadSignedUrls(doc?.S3Key || '', doc.Bucket);
    let type = mime.getType(name)?.split('/')[0];

    if (type === 'image' && url)
      setElement(
        <img
          src={url.data.url}
          alt="doc"
          loading="lazy"
          decoding="async"
          className="w-full object-cover h-44 rounded-t-md "
        />
      );
    else if (type === 'video' && url)
      setElement(<video src={url.data.url} className="w-full object-cover h-44 rounded-t-md " />);
    else {
      setElement(
        <div className="w-full bg-gray-300  flex items-center justify-center h-44 rounded-t-md ">
          <FaFileAlt color="#437ADB" size={80} />
        </div>
      );
    }

    setLoading(false);
  };

  useEffect(() => {
    handlePicture();
  }, []);
  return (
    <>
      {changingAccess && (
        <AccessModal
          closer={() => {
            setChangingAccess(false);
          }}
          type="file"
          id={doc?._id}
        />
      )}
      <div
        ref={ref}
        onClick={() => {
          previewFn();
        }}
        className="w-full cursor-pointer relative rounded-md">
        {loading ? (
          <div className="w-full rounded-t-md h-44 bg-gray-300 animate-pulse_fast "></div>
        ) : (
          element
        )}
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="bg-white flex p-5 items-center justify-between rounded-b-md">
          <div className="w-full items-center flex ">
            <AiOutlineFile size={18} color="#C8CDD4" />
            <span className="ml-3 font-semibold">{truncateText(name, 15)}</span>
          </div>

          <span className="  flex items-center">
            <TbUser className="" />
            <span className=" text-xs">
              {Math.min(activeProject?.team.length || 1, doc?.access?.length || 1)}
            </span>
          </span>
        </div>
        {options && (
          <span
            ref={optionsRef}
            className="absolute z-20 bg-white shadow-bnkle rounded-md top-2 right-0">
            <CardOptions isOwner={doc.createdBy === user?._id} fns={funcs} />
          </span>
        )}
        <span
          onClick={(e) => {
            e.stopPropagation();
            setOptions(true);
          }}
          className="rounded-full absolute right-2 top-2 z-10 p-2 hover:cursor-pointer bg-ashShade-0 flex items-center justify-center">
          <IoEllipsisVertical color="#5E6777" />
        </span>
      </div>
    </>
  );
};

export default DrawingCard;
export type func = () => void;
interface OptionsProps {
  fns: func[];
  isOwner?: boolean;
}

const CardOptions = ({ fns, isOwner }: OptionsProps) => {
  let folder = useAppSelector((m) => m.folder);
  let user = useAppSelector((m) => m.user);

  const [moreOptions, setMoreOptions] = useState(false);
  const options = useMemo(() => {
    return {
      list: isOwner ? cardOptions : generalCardOptions,
      fns: isOwner ? fns : [fns[0], fns[3]]
    };
  }, [folder, isOwner]);

  return (
    <span onClick={(e) => e.stopPropagation()} className="relative">
      <span className="flex flex-col w-48 p-2 ">
        {options.list.map((m, i) => (
          <Options
            onClick={options.fns[i]}
            text={m.name}
            iconleft={m.icon}
            iconRight={m?.iconRight}
          />
        ))}
      </span>
      {moreOptions && (
        <span className="absolute p-2 top-10 -right-28 bg-white rounded-md shadow-bnkle w-48 max-h-48 overflow-y-auto ">
          <p className="p-2">Select folder</p>
          {Object.keys(folder.folder).map((m) => (
            <Options text={m} iconleft={TbFolder} onClick={() => {}} />
          ))}
        </span>
      )}
    </span>
  );
};

export { cardOptions, CardOptions };
