import React, { useState, useEffect, useLayoutEffect, useContext, useMemo } from 'react';
import { repo, drawings } from '../constants';
import DrawingCard from './DrawingCard';
import ListCard from './ListCard';
import AppsIcon from 'assets/appsicon.svg';
import { StoreContext } from 'context';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import {
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useParams,
  useRoutes
} from 'react-router-dom';
import DocModal from './DocModal';
import { resetFolders } from 'store/slices/folderSlice';
import ChangeFolderModal from '../document-repo/ChangeFolderModal';
import { Doc } from '../document-repo/SingleDocModal';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { convertToProper } from 'components/shared/utils';
import NoContent from 'components/projects/photos/NoContent';
import NewButton from '../document-repo/NewButton';
import FolderCard from '../document-repo/FolderCard';
import { split } from 'lodash';
import useFiles from '../document-repo/useFiles';
import { TbChevronRight } from 'react-icons/tb';
const Drawings = () => {
  let navigate = useNavigate();
  let dispatch = useAppDispatch();
  let folders = useAppSelector((m) => m.folder);
  const { data, selectedProject, selectedProjectIndex } = useContext(StoreContext);

  let { getFiles } = useFiles(true);
  const [islist, setIslist] = useState(true);
  const [modal, setModal] = useState(false);
  // const [files, setFiles] = useState();
  const [active, setActive] = useState(0);
  const [changeFolderModal, setChangeFolderModal] = useState(false);
  const [renaming, setRenaming] = useState<boolean>(false);
  const [viewing, setViewing] = useState<Doc>();
  let { pathname } = useLocation();

  let { id } = useParams();
  const files = useMemo(() => {
    return folders.files.filter((m) => m.folderId === id);
  }, [data, folders, folders.files]);
  useEffect(() => {
    if (!data || !folders) {
      navigate('/projects');
    }
    // if (!folders.current) {
    // }
  }, []);

  let modifyFile = (file: Doc, renaming: boolean = false) => {
    setChangeFolderModal(true);
    setViewing(file);
    setRenaming((_) => renaming);
  };

  useEffect(() => {
    if (folders.files.length === 0) {
      getFiles();
    }
  }, []);


  const currentFolders = useMemo(() => {
    return folders.fileFolders.filter((m) => m?.parentFolder === id);
  }, [folders]);

  const isLastLevel = useMemo(() => {
    let splittedUrl = pathname.split('/');
    let indexOfIdLocation = splittedUrl.indexOf(id || '');
    return indexOfIdLocation === splittedUrl.length - 1;
  }, [pathname]);

  return (
    <div className="w-full">
      {isLastLevel && (
        <>
          {modal ? (
            <DocModal
              closer={() => {
                setModal(false);
              }}
              active={active}
            />
          ) : null}
          {changeFolderModal && viewing && (
            <ChangeFolderModal
              doc={viewing}
              renaming={renaming}
              toggler={() => {
                setChangeFolderModal(false);
              }}
            />
          )}
          <div
            onClick={() => {
              // navigate(-1);
            }}
            className=" cursor-pointer py-2 flex items-center ">
            {/* <FaArrowLeftLong className="mr-2" /> Back */}
            <BreadCram />
          </div>
          <div className="w-full flex items-center justify-between mt-2">
            <p className=" text-2xl font-semibold mb-5">
              {folders.fileFolders.find((m) => m._id === id)?.name}
            </p>
            <div className=" flex items-center gap-x-2 ">
              <img onClick={() => setIslist(!islist)} src={AppsIcon} alt="" className="w-4 h-4" />
              <NewButton folderId={id} />
            </div>
          </div>
          {islist ? (
            <div className="grid w-full grid-cols-1  sm:grid-cols-2 gap-5 lg:grid-cols-3 xl:grid-cols-4 ">
              {files &&
                files.map((m: any, i: number) => (
                  <DrawingCard
                    idx={i}
                    key={m._id}
                    doc={m}
                    previewFn={() => {
                      setActive(i);
                      setModal(true);
                    }}
                    renameFileFn={() => {
                      modifyFile(m, true);
                    }}
                    changeFolderFn={() => {
                      modifyFile(m);
                    }}
                    name={m?.alias}
                  />
                ))}
              {currentFolders.map((m) => (
                <FolderCard key={m._id} {...m} />
              ))}
            </div>
          ) : (
            <div className="w-full bg-white rounded-md px-6 pt-6 pb-16">
              <div className="flex items-center font-semibold mb-4 justify-between">
                <span>Name</span>
                <span>File</span>
              </div>
              <hr />
              <div>
                {files &&
                  files.map((m: any, i: number) => (
                    <ListCard
                      key={m.key}
                      name={m?.alias}
                      toggler={() => {
                        setActive(i);
                        setModal(true);
                      }}
                    />
                  ))}
              </div>
            </div>
          )}

          {(!files || files?.length === 0) && currentFolders.length === 0 && (
            <NoContent title="Folder is Empty" subtitle=" " />
          )}
        </>
      )}
      <Routes>
        <Route path={`:id/*`} element={<Drawings />}></Route>
      </Routes>
    </div>
  );
};

const BreadCram = () => {
  let { pathname } = useLocation();
  let { fileFolders } = useAppSelector((m) => m.folder);
  let navigate = useNavigate();
  let links = useMemo(() => {
    let subLinks = pathname.split('documents/')[1];
    let _links = pathname.split('/');
    let paths = subLinks.split('/');
    let _paths = paths.map((m, i) => ({
      id: m,
      name: fileFolders.find((k) => k._id === m)?.name,
      path: _links.slice(0, _links.length - paths.length - 1 - i).join('/')
    }));
    return {
      paths: _paths,
      _links
    };
  }, [pathname, fileFolders]);

  const navTo = (id: string = '') => {
    let i = links._links.indexOf(id);
    navigate(links._links.slice(0, i + 1).join('/'));
  };

  let style = {
    size: 16,
    className: ' mx-2 '
  };

  return (
    <div className=" flex items-center font-semibold">
      <span
        onClick={() => {
          navTo('documents');
        }}
        className=" flex text-borange  items-center ">
        Documents <TbChevronRight {...style} />
      </span>
      {links.paths.map((m, i) => (
        <span
          onClick={() => {
            navTo(m.id);
          }}
          className=" flex items-center">
          {m.name}
          {i !== links.paths.length - 1 && (
            <>
              <TbChevronRight {...style} />
            </>
          )}
        </span>
      ))}
    </div>
  );
};

export default Drawings;
