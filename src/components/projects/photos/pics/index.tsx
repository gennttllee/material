import React, { useState, useContext, useRef, useEffect } from 'react';
import { format, timeframe } from '../constants';
import AppsIcon from 'assets/appsicon.svg';
import filterby from 'assets/filterby.svg';
import piclist from 'assets/piclist.svg';
import Collection from './Collection';
import BulletList from './BulletList';
import { FaPlus } from 'react-icons/fa';
import NoContent from '../NoContent';
import mime from 'mime';
import axios from 'axios';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import { StoreContext } from 'context';
import { groupFiles } from 'components/projects/documents/document-repo';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { addFolders, setFiles, changeFieldValue, addFiles } from 'store/slices/folderSlice';
import GhostBids from 'components/projects/bids/projectowner/bid/GhostBids';
import { Doc } from 'components/projects/documents/drawings/DocModal';
import Preview from './Preview';
import differenceInDays from 'date-fns/differenceInDays';
import { differenceInMonths, differenceInYears } from 'date-fns';
import { IoEllipsisVertical } from 'react-icons/io5';
import { isWeek, islastMonth } from 'components/shared/utils';
import { TbSortDescending } from 'react-icons/tb';
import { BsCheck2Square } from 'react-icons/bs';
import SuperModal from 'components/shared/SuperModal';
import { LatestDoc } from 'components/projects/documents/document-repo/SingleDocModal';
import useFiles from 'components/projects/documents/document-repo/useFiles';
import { FileFolder } from 'components/projects/documents/types';
import { uploadAllWithOptions } from 'Hooks/useProjectImages';
import { LoaderX } from 'components/shared/Loader';
const filterForMedia = (folder: LatestDoc[]) => {
  let acc = folder.filter((m) => {
    let filetype = m.ContentType.split('/')[0];
    if (['image', 'video'].includes(filetype)) {
      let name = typeof m.folder === 'string' ? m.folder : m.folder._id;
      return m;
    }
  });
  return acc;
};

const filterWithOptions = (folder: LatestDoc[], time = 'All time', type = 'Photo & Video') => {
  let acc = folder.filter((m) => {
    let filetype = m.ContentType.split('/')[0];
    let typeOptions = ['image', 'video'];
    if (type === format[0]) {
      if (typeOptions.includes(filetype)) return m;
    } else if (type === format[1]) {
      if (filetype === typeOptions[1]) {
        return m;
      }
    } else if (type === format[2]) {
      if (filetype === typeOptions[0]) {
        return m;
      }
    }
  });
  let final = acc.filter((m) => {
    if (timeframe[0] === time) {
      return m;
    } else if (timeframe[1] === time) {
      if (isWeek(new Date(m.timestamp))) {
        return m;
      }
    } else if (timeframe[2] === time) {
      if (isWeek(new Date(m.timestamp), 'lastweek')) {
        return m;
      }
    } else if (timeframe[3] === time) {
      if (islastMonth(new Date(m.timestamp))) {
        return m;
      }
    }
  });

  return final;
};

const groupbyDate = (arr: any[]) => {
  let acc: any = {};
  for (let i = 0; i < arr.length; i++) {
    let date = new Date(arr[i].timestamp).toDateString();
    if (acc[date]) {
      acc[date].push(arr[i]);
    } else {
      acc[date] = [arr[i]];
    }
  }
  return acc;
};

const Index = () => {
  const dispatch = useAppDispatch();
  let fileRef = useRef<any>();
  const [islist, setIslist] = useState(false);
  const [filter, setFilter] = useState(false);
  const [mediaFormat, setMediaFormat] = useState('Photo & Video');
  const [timeRange, setTimeRange] = useState('All time');
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const { data, selectedProjectIndex } = useContext(StoreContext);
  // const [fetching, setFetching] = useState(false);
  const [media, setMedia] = useState<any>({});
  const [mediaKeys, setMediaKeys] = useState<string[]>([]);
  const folder = useAppSelector((m) => m.folder);
  const [filteroptions, setFilteroptions] = useState({});
  const [filterModal, setFilterModal] = useState(false);
  const [options, setOptions] = useState(false);
  let { activeProject } = useContext(StoreContext);

  let { getFiles, fetching, createFolder } = useFiles(true);
  useEffect(() => {
    let mediaFiles = folder.files.filter((m) => {
      return typeof m.folder === 'string' ? m.folder === 'media' : m.folder?.name === 'media';
    });
    setMedia((_: any) => groupbyDate(mediaFiles));
    setMediaKeys(Object.keys(groupbyDate(mediaFiles)));
  }, [folder, folder.files]);
  useEffect(() => {
    dispatch(setFiles(filterWithOptions(folder.all, timeRange, mediaFormat)));
  }, [folder.all, timeRange, mediaFormat]);
  useEffect(() => {
    getFiles();
  }, [activeProject]);

  const upload = async (file: FileList) => {
    setUploading(true);

    let mediaFolder = folder.fileFolders.find((m) => m.name === 'media') as FileFolder;

    if (!mediaFolder) {
      let res = await createFolder('media', 'This contains Project videos and files');
      if (res.response) mediaFolder = res.response?.data?.data;
    }

    let files = await uploadAllWithOptions(Object.values(file), activeProject?._id, {
      access: activeProject?.team.filter((m) => m.id).map((m) => ({ userId: m.id, role: m.role })),
      folderId: mediaFolder?._id
    });

    let allresponses = files.filter((m) => m.response).map((m) => m.response.data.data);
    getFiles();
    setUploading(false);
  };

  useEffect(() => {
    let create = () => {};

    let timeOut = setTimeout(create, 1000);

    return () => {};
  }, [uploading]);

  return (
    <div
      onClick={() => {
        setFilter(false);
        setOptions(false);
      }}
      className="flex-1 justify-start flex flex-col min-w-[370px] overflow-x-auto ">
      <input
        ref={fileRef}
        multiple
        type={'file'}
        className="hidden"
        accept="video/*,image/jpg,image/jpeg,image/png,image/avif,image/gif,.mkv"
        onClick={(e) => {}}
        onChange={(e) => {
          if (e.target.files) {
            upload(e.target.files);
          }
        }}
      />
      {folder.modal && <Preview />}
      {filterModal && (
        <SuperModal
          classes="bg-black bg-opacity-80  flex items-center justify-center"
          closer={() => setFilterModal(false)}>
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className=" bg-white    h-auto shadow-lg  w-4/5 py-6 px-4 rounded-md">
            <p className="font-semibold text-lg mb-5">Filter by</p>
            <hr />
            <p className="font-semibold mb-5 mt-4">TimeFrame</p>
            <div className="flex flex-col">
              {timeframe.map((m) => (
                <BulletList label={m} setter={setTimeRange} state={timeRange} />
              ))}
            </div>
            <hr />
            <p className="font-semibold mt-4 mb-5">Format</p>
            <div className="flex flex-col">
              {format.map((m) => (
                <BulletList label={m} setter={setMediaFormat} state={mediaFormat} />
              ))}
            </div>
          </div>
        </SuperModal>
      )}
      <div className="w-full flex  flex-col pt-9 lg:pt-0 lg:flex-row sm:items-center justify-between mb-10">
        <p className=" text-2xl font-semibold  self-start  ">Photos</p>
        <div className="flex w-full  lg:w-auto items-center relative">
          {filter ? (
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className="absolute bg-white top-6 -left-[314px] z-50 h-auto shadow-lg hidden lg:block lg:w-[314px] py-6 px-4 rounded-md">
              <p className="font-semibold text-lg mb-5">Filter by</p>
              <hr />
              <p className="font-semibold mb-5 mt-4">TimeFrame</p>
              <div className="flex flex-col">
                {timeframe.map((m) => (
                  <BulletList label={m} setter={setTimeRange} state={timeRange} />
                ))}
              </div>
              <hr />
              <p className="font-semibold mt-4 mb-5">Format</p>
              <div className="flex flex-col">
                {format.map((m) => (
                  <BulletList label={m} setter={setMediaFormat} state={mediaFormat} />
                ))}
              </div>
            </div>
          ) : null}
          {mediaKeys.length > 0 || folder.all.length > 0 ? (
            <div className="flex w-full justify-between items-center mt-4 lg:mt-0 flex-row-reverse lg:flex-row ">
              <div className="flex items-center">
                <img
                  onClick={(e) => {
                    e.stopPropagation();
                    setFilter(!filter);
                  }}
                  src={filterby}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="w-4 hidden lg:block  h-4 placeholder: mr-7 hover:cursor-pointer"
                />
                <img
                  className="w-4 h-4 mr-6 hover:cursor-pointer"
                  loading="lazy"
                  decoding="async"
                  onClick={() => setIslist(!islist)}
                  src={islist ? AppsIcon : piclist}
                  alt=""
                />
                <span className="relative">
                  <IoEllipsisVertical
                    onClick={(e) => {
                      e.stopPropagation();
                      setOptions(!options);
                    }}
                    size={16}
                    className="w-4 h-4 mr-6 lg:hidden block hover:cursor-pointer"
                  />
                  {options && (
                    <span
                      onClick={(e) => e.stopPropagation()}
                      className="absolute top-0 rounded-lg text-bash -left-32 shadow-lg bg-white w-[137px] p-2 flex flex-col">
                      <span onClick={() => setFilterModal(true)} className="flex items-center">
                        <TbSortDescending size={16} className=" mr-3" />
                        Filter
                      </span>
                      <span className="flex items-center">
                        <BsCheck2Square size={16} className=" mr-3" />
                        Select
                      </span>
                    </span>
                  )}
                </span>
              </div>

              <button
                disabled={uploading}
                onClick={() => fileRef.current.click()}
                className="flex items-center bg-bblue rounded-md text-white px-3 py-2 gap-x-3">
                {uploading ? <LoaderX /> : <FaPlus size={16} color="white" className="" />} Add
                Photo/video
              </button>
            </div>
          ) : null}
        </div>
      </div>

      {!fetching && mediaKeys.length === 0 && folder.all.length < 1 ? (
        <NoContent showAddButton onclick={() => fileRef.current.click()} />
      ) : null}
      <div
        className={`${
          islist ? `bg-white rounded-md p-6 ` : `flex-1`
        } mx-auto w-full   overflow-y-auto no-scrollbar`}>
        {islist && (
          <div className="flex items-center font-semibold mb-8 justify-between">
            <span>Name</span>
            <span></span>File
          </div>
        )}
        {fetching ? (
          <GhostBids />
        ) : mediaKeys.length === 0 && folder.all.length > 0 ? (
          <div className="w-full flex items-center justify-center">
            <span className=" text-4xl">{'"No Matches"'}</span>
          </div>
        ) : (
          mediaKeys.map((m, i) => (
            <Collection key={m} islist={islist} label={m} picArr={media[m]} />
          ))
        )}
      </div>
      {uploading ? (
        <div className="w-1/4 right-10 bottom-10 absolute  z-50 flex items-center justify-center ">
          <div className=" bg-white items-center left-auto w-full flex flex-col   p-5 self-center rounded-md shadow-lg ">
            <div className="w-full  bg-ashShade-0 mb-2 rounded-lg">
              <div className=" bg-bgreen-0 rounded-lg h-3 " style={{ width: progress + '%' }}></div>
            </div>
            <span>Uploading...</span>
          </div>
        </div>
      ) : null}
    </div>
  );
};

export { filterForMedia };

export default Index;
