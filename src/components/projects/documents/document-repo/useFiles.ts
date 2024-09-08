import React, { useCallback, useState } from 'react';
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
import { displayError, displaySuccess, displayWarning } from 'Utils';
import { FileFolder } from '../types';
import { ProjectBrief, removeemptyFields } from 'pages/projectform/utils';
import { Bid, Brief, ProfessionalBrief, ProjectID } from 'types';
import { NewProject } from 'store/slices/newprojectSlice';
import NewButton from './NewButton';
import zipjs from 'jszip';
import fileDownload from 'js-file-download';
import { convertDocToFile } from 'components/shared/utils';

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
    access: [...project.team.map((m) => ({ userId: m.id, role: m.role }))].filter((m) => m.userId)
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

export const moveFolders = async (fileId: string, folderId: string) => {
  let { response, e } = await postForm('patch', 'files/move', {
    folderId,
    fileId
  });

  if (response) {
    return response.data.data;
  }
};

export const moveFileToFolder = async (fileId: string = '', folderId: string = '') => {
  return await postForm('patch', 'files/move', {
    folderId,
    fileId
  });
};

const useFiles = (wait: boolean = false) => {
  let optionsRef = React.useRef<HTMLSpanElement>(null);
  const { data, selectedProjectIndex, activeProject } = useContext(StoreContext);
  useClickOutSideComponent(optionsRef, () => {
    setOptions(false);
  });
  const [fetching, setFetching] = useState(true);
  const [changeFolderModal, setChangeFolderModal] = useState(false);
  const [uploadFileModal, setUploadFileModal] = useState(false);
  const [previewModal, setPreviewModal] = useState(false);
  const [viewing, setViewing] = useState<Doc>();
  let dispatch = useAppDispatch();
  let folders = useAppSelector((m) => m.folder);
  const [options, setOptions] = useState<boolean>(false);
  const [renaming, setRenaming] = useState<boolean>(false);

  const downloadFolder = useCallback(
    async (id: string) => {
      let zip = new zipjs();
      try {
        let res = await constructZip(id, zip);
        if (res) {
          let folder = folders.fileFolders.find((m) => m._id === id);
          if (!folder) {
            displayError('Folder is Does not exist');
            return;
          }
          let zipfile = await res.generateAsync({ type: 'uint8array' });
          let blob = new Blob([zipfile], { type: 'application/zip' });
          fileDownload(blob, folder?.name || '', 'application/zip');
        }
      } catch (error) {
        console.log(error);
        displayError('Could not download Folder');
      }
    },
    [folders]
  );

  const constructZip = useCallback(
    async (id: string, zipInstance: zipjs, path = '') => {
      let folder = folders.fileFolders.find((m) => m._id === id) as FileFolder;
      if (!folder) {
        displayError('Folder does not exist');
        return zipInstance;
      }
      const folderFiles = folders.files.filter((m) => m.folderId === id);
      if (path === '' && folderFiles.length === 0) {
        displayError('Cannot download empty Folder');
        return;
      }
      let _adds = folderFiles.map(async (m) => {
        let blob = (await convertDocToFile(m)) as unknown as Blob;

        if (blob) {
          let buffer = await blob.arrayBuffer();
          zipInstance.file(`${path}${m.alias}`, new Uint8Array(buffer));
        }
      });
      await Promise.all(_adds);
      const subFolders = folders.fileFolders.filter((m) => m.parentFolder === folder._id);
      let _subs = subFolders.map(async (m) => {
        await constructZip(m._id, zipInstance, `${path}${m.name}/`);
      });

      await Promise.all(_subs);

      return zipInstance;
    },
    [folders]
  );

  const eligibleFolders = React.useMemo(() => {
    return folders.fileFolders.filter((m) => {
      return !['media', 'bids'].includes(m.name);
    });
  }, [folders]);

  const getFolders = useCallback(async () => {
    let { response, e } = await postForm(
      'get',
      `files/folder/list?project=${data[selectedProjectIndex]._id}`
    );

    if (response) {
      dispatch(addFileFolders([...response.data.data]));
    }
    return (response?.data?.data as FileFolder[]) || [];
  }, []);

  let getFiles = useCallback(async () => {
    setFetching(true);
    let currentFolders = await getFolders();
    let { response, e } = await postForm(
      'get',
      `files/sort/project/${data[selectedProjectIndex]._id}`
    );
    let res = response?.data?.data;

    if (res && res.length > 0) {
      let _res = res as Doc[] | NewDoc[];

      let files = await handleOldFiles(_res, currentFolders, activeProject as Brief);

      let _files: NewDoc[] = [...files];

      _res.forEach((m) => {
        if (typeof m.folder !== 'string') {
          _files.push(m as NewDoc);
        }
      });

      getFolders();
      dispatch(setFiles(_files));
      dispatch(
        addFolders({
          data: groupFiles(_files, true),
          projectId: data[selectedProjectIndex]._id
        })
      );
    } else if (res && res.length === 0) {
      dispatch(
        addFolders({
          data: groupFiles(response.data.data, true),
          projectId: data[selectedProjectIndex]._id
        })
      );
      displayError('No documents have been uploaded on this project');
    }
    if (e) {
      displayWarning(e?.message);
      dispatch(
        addFolders({
          data: groupFiles([], true),
          projectId: data[selectedProjectIndex]._id
        })
      );
    }

    setFetching(false);
  }, []);

  useEffect(() => {
    if (!wait) {
      if (data && selectedProjectIndex && data[selectedProjectIndex]?._id) {
        dispatch(resetFolders());
        getFiles();
      }
    }
  }, [selectedProjectIndex]);

  let preview = (file: Doc) => {
    setPreviewModal(true);
    setViewing(file);
  };

  let modifyFile = (file: Doc, renaming: boolean = false) => {
    setChangeFolderModal(true);
    setViewing(file);
    setRenaming(renaming);
  };

  const _getFiles = useCallback(async () => {
    if (data[selectedProjectIndex]?._id) {
      dispatch(resetFolders());
      await getFiles();
    }
  }, [data, selectedProjectIndex]);

  const createFolder = useCallback(async (folderName: string = '', alias = '') => {
    // setLoading(true);
    // let prole = activeProject?.team?.find((m) => m.id === user._id);

    let data: Record<string, any> = {
      name: folderName,
      project: activeProject?._id,
      alias: alias,
      access: activeProject.team.filter(m=>m.id).map((m) => ({ userId: m.id, role: m.role }))
    };

    let { response, e } = await postForm('post', `files/folder/create`, removeemptyFields(data));
    if (response?.data) {
      dispatch(addFileFolders([...folders.fileFolders, response.data.data]));
      displaySuccess('Folder Created Successfully');
      // toggler();
    }

    return { response, e };
  }, []);

  return { _getFiles, getFiles, getFolders, fetching, setFetching, createFolder, downloadFolder };
};

export default useFiles;
