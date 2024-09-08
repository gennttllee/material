import React, { useState } from 'react';
import { repo } from '../constants';
import FolderCard from './FolderCard';
import { postForm } from 'apis/postForm';
import { useEffect, useContext } from 'react';
import { StoreContext } from 'context';
import GhostBids from 'components/projects/bids/projectowner/bid/GhostBids';
import NoContent from 'components/projects/photos/NoContent';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { addFileFolders, addFolders, resetFolders, setFiles } from 'store/slices/folderSlice';
import { ToastContainer } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import DocModal from '../drawings/DocModal';
import Options from './Options';
import { TbFolderPlus, TbFileUpload } from 'react-icons/tb';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import DrawingCard from '../drawings/DrawingCard';
import CreateNewFolderModal from './CreateNewFolderModal';
import ChangeFolderModal from './ChangeFolderModal';
import SingleDocModal, { Doc, LatestDoc, NewDoc } from './SingleDocModal';
import UploadFileModal from './UploadFileModals';
import { displayError, displayWarning } from 'Utils';
import { FileFolder } from '../types';
import { ProjectBrief } from 'pages/projectform/utils';
import { Bid, Brief, ProfessionalBrief, ProjectID } from 'types';
import { NewProject } from 'store/slices/newprojectSlice';
import NewButton from './NewButton';
import useFiles from './useFiles';

export const groupFiles = (docArr: LatestDoc[], addPresentation: boolean = false) => {
  let acc: any = {};
  for (let i = 0; i < docArr.length; i++) {
    let folder = (
      typeof docArr[i].folder === 'string' ? docArr[i].folder : docArr[i].folderId
    ) as string;
    if (acc[folder]) {
      acc[folder].push(docArr[i]);
    } else {
      acc[folder] = [docArr[i]];
    }
  }

  if (!acc['presentation'] && addPresentation) acc['presentation'] = [];

  return acc;
};

const createFolderWithAllAccess = async (name: string, project: Brief) => {
  let data = {
    name,
    // "parentFolder": "6695317eae7f9973e6386267", //optional: to be used for nexted folders
    project: project?._id,
    alias: 'Quick Folder',
    access: [...project.team.map((m) => ({ userId: m.id, role: m.role }))]
  };

  let { e, response } = await postForm('post', 'files/folder/create', data);

  if (response) {
    return response?.data?.data;
  }
  return;
};

const handleOldFiles = async (
  res: (NewDoc | Doc)[],
  currentFolders: FileFolder[] = [],
  project: Brief
) => {
  let _res = [...res];
  let acc: Record<string, any[]> = {};

  _res.forEach((m) => {
    if (typeof m.folder === 'string') {
      acc[m.folder] = acc[m.folder] ? [...acc[m.folder], m] : [m];
    }
  });

  let folders = Object.keys(acc);
  let files: NewDoc[] = [];
  for (let i = 0; i < folders.length; i++) {
    let folder = currentFolders.find((m) => m.name === folders[i]);
    if (!folder) {
      //create the folder
      folder = await createFolderWithAllAccess(folders[i], project);
    }

    if (folder) {
      //move files to the folder
      acc[folders[i]].forEach(async (m) => {
        let newFile = await moveFolders(m._id, folder?._id || '');

        if (newFile) {
          files = [...files, newFile];
        }
      });
    }
  }

  return files;
};

const moveFolders = async (fileId: string, folderId: string) => {
  let { response, e } = await postForm('patch', 'files/move', {
    folderId,
    fileId
  });

  if (response) {
    return response.data.data;
  }
};

const Index = () => {
  let optionsRef = React.useRef<HTMLSpanElement>(null);
  const { data, selectedProjectIndex, activeProject } = useContext(StoreContext);
  useClickOutSideComponent(optionsRef, () => {
    setOptions(false);
  });
  // const [fetching, setFetching] = useState(true);
  const [newFolderModal, setNewFolderModal] = useState(false);
  const [changeFolderModal, setChangeFolderModal] = useState(false);
  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [viewing, setViewing] = useState<Doc>();
  let dispatch = useAppDispatch();
  let folders = useAppSelector((m) => m.folder);
  let navigate = useNavigate();
  const [options, setOptions] = useState<boolean>(false);
  const [renaming, setRenaming] = useState<boolean>(false);
  const funcs = [
    () => {},
    () => {
      setChangeFolderModal(true);
    },
    () => {},
    () => {},
    () => {}
  ];
  let { getFiles, _getFiles, getFolders, fetching, setFetching } = useFiles();

  const eligibleFolders = React.useMemo(() => {
    return folders.fileFolders.filter((m) => {
      return !['media', 'bids'].includes(m.name) && !m.parentFolder;
    });
  }, [folders]);

  useEffect(() => {
    if (!data[selectedProjectIndex]) {
      navigate('/projects');
    }
  }, []);

  // useEffect(() => {
  //   if (data && selectedProjectIndex && data[selectedProjectIndex]?._id) {
  //     dispatch(resetFolders());
  //     getFiles();
  //   }
  // }, [selectedProjectIndex]);

  let preview = (file: Doc) => {
    setPreviewModal(true);
    setViewing(file);
  };

  let modifyFile = (file: Doc, renaming: boolean = false) => {
    setChangeFolderModal(true);
    setViewing(file);
    setRenaming(renaming);
  };

  // useEffect(() => {
  //   if (folders.fileFolders.length === 0) {
  //     _getFiles();
  //   }
  // }, []);

  return (
    <div className="w-full h-full flex-col flex ">
      {/* {!!newFolderModal && <CreateNewFolderModal toggler={() => setNewFolderModal(false)} />}
      {uploadFileModal && (
        <UploadFileModal onUploadComplete={_getFiles} toggler={() => setUploadFileModal(false)} />
      )} */}
      {changeFolderModal && viewing && (
        <ChangeFolderModal
          doc={viewing}
          renaming={renaming}
          toggler={() => {
            setChangeFolderModal(false);
          }}
        />
      )}
      {previewModal && viewing && (
        <SingleDocModal doc={viewing} closer={() => setPreviewModal(false)} />
      )}
      <div className="flex items-center justify-between  w-full">
        <p className=" text-2xl font-semibold mb-5">Document Repo</p>

        <NewButton
        // onClickCreateFolder={() => {
        //   setNewFolderModal(true);
        //   setOptions(false);
        // }}
        // onClickUploadFile={() => setUploadFileModal(true)}
        // onClickUploadFolder={() => setUploadFileModal(true)}
        />
      </div>
      <div className="w-full overflow-y-scroll flex-1 pb-10">
        {fetching ? (
          <GhostBids />
        ) : eligibleFolders.length > 0 ? (
          <>
            {folders.fileFolders.length > 0 && (
              <>
                <p className="text-2xl mt-8 mb-4 font-semibold">Folders</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {eligibleFolders.map((m) => (
                    <FolderCard key={m._id} {...m} />
                  ))}
                </div>
              </>
            )}
            {/* 
            {_folders.files.length > 0 && (
              <>
                <p className="text-2xl mt-10 mb-4 font-medium">Files</p>
                <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4">
                  {_folders.files.map((m) => (
                    <DrawingCard
                      doc={m}
                      previewFn={() => preview(m)}
                      renameFileFn={() => modifyFile(m, true)}
                      changeFolderFn={() => modifyFile(m)}
                      name={m.alias}
                    />
                  ))}
                </div>
              </>
            )} */}
          </>
        ) : (
          <NoContent
            showAddButton={false}
            title="No folders to display"
            subtitle="Folders are shown when documents have been uploaded "
          />
        )}
      </div>
    </div>
  );
};

export default Index;
