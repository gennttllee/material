import React, { useEffect, useMemo, useRef, useState, useCallback, useContext } from 'react';
import ImageGallery, { ReactImageGalleryItem } from 'react-image-gallery';
import useProjectImages, {
  useUploader,
  uploadAll,
  uploadAllWithOptions
} from 'Hooks/useProjectImages';
import { BiChevronLeft, BiChevronRight } from 'react-icons/bi';
import { FaPlus } from 'react-icons/fa';
import { StoreContext } from 'context';
import { object } from 'yup';
import { LoaderX } from 'components/shared/Loader';
import NoContent from 'components/projects/photos/NoContent';
import { useComponentDimensions } from 'components/projects/Team/Views/Components/OnScreen';
import ImageSlider from './ImageSlider';
import { NoContentDashBoard } from '.';
import useFiles from 'components/projects/documents/document-repo/useFiles';
import { useAppSelector } from 'store/hooks';
import { FileFolder } from 'components/projects/documents/types';
import { displayError } from 'Utils';
import { removeemptyFields } from 'pages/projectform/utils';
function Gallery() {
  const { data, selectedProjectIndex, activeProject } = useContext(StoreContext);
  let { fetching, createFolder, getFiles } = useFiles(true);
  const [files, setFiles] = useState<any>([]);
  const [uploads, setUploads] = useState(0);

  const [showAddButton, setShowAddButton] = useState(false);
  const [load, setLoad] = useState(false);
  let { fileFolders } = useAppSelector((m) => m.folder);
  const inputRef = useRef<HTMLInputElement>(null);
  let { images, loading } = useProjectImages('presentation', [uploads]);

  const galleryRef = useRef<HTMLDivElement>(null);
  const [uploading, setUploading] = useState(false);
  let { height, width } = useComponentDimensions(galleryRef);
  useEffect(() => {
    if (files.length > 0) {
      upload();
    }
  }, [files]);

  useEffect(() => {
    if (fileFolders.length === 0 || files.length === 0) {
      getFiles();
    }
  }, [activeProject]);

  const upload = async () => {
    setUploading(true);
    let foldername = 'presentation';

    let presentationFolder = fileFolders.find((m) => m.name === foldername);
    if (!presentationFolder) {
      let { response, e } = await createFolder(foldername, 'gallery pics');
      if (response) {
        presentationFolder = response.data.data as FileFolder;
      } else {
        displayError('Could not create Presentation Folder');
      }
    }
    if (presentationFolder) {
      await uploadAllWithOptions(
        files,
        data[selectedProjectIndex]._id,
        removeemptyFields({
          folderId: presentationFolder?._id,
          access: activeProject?.team
            .map((m) => ({ userId: m.id, role: m.role }))
            .filter((m) => m.userId && m.role)
        })
      );
      getFiles();
      setUploads((_) => _ + 1);
      setFiles([]);
    }

    setUploading(false);
  };

  let ims = useMemo(() => {
    return images.map((m, i) => {
      return {
        url: m,
        alt: `image${i}`,
        original: m,
        thumbnail: '',
        bulletClass: ' h-2 w-2 bg-white',
        originalHeight: height,
        originalWidth: width
      };
    });
  }, [images, height, width]);

  return (
    <div
      onMouseOver={() => {
        setShowAddButton(true);
      }}
      onMouseLeave={() => {
        setShowAddButton(false);
      }}
      className="flex-1 h-80  overflow-hidden   rounded-md bg-white relative">
      {' '}
      <input
        onChange={(e) => {
          let list = e.target.files;
          let files: File[] = Object.values(list ?? {});
          setFiles(files);
        }}
        accept=".jpg,.jpeg,.png,.avif"
        ref={inputRef}
        multiple
        className=" hidden absolute "
        type="file"
      />
      {showAddButton && (
        <div className="w-full flex items-center justify-end absolute z-50 bg-gradient-to-b px-4 pt-4 pb-8 from-bblack-0 to-transparent ">
          {uploading ? (
            <LoaderX />
          ) : (
            <button
              onClick={() => {
                inputRef.current?.click();
              }}
              className=" bg-white border border-bash   p-2 rounded-full">
              <FaPlus size={16} className="text-bg-bblue" />
            </button>
          )}
        </div>
      )}
      <div ref={galleryRef} className="w-full h-full overflow-hidden flex rounded-md no-scrollbar">
        <div style={{ height, width }}>
          {loading ? (
            <div className="h-full w-full flex items-center justify-center">
              <div className=" border-4 h-10 w-10 border-t-transparent rounded-full border-x-bblue border-b-bblue animate-spin"></div>
            </div>
          ) : images.length > 0 ? (
            <ImageSlider items={ims} />
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center">
              <NoContentDashBoard
                imageClass="w-1/3"
                titleClass="font-semibold"
                containerClass=" flex flex-col items-center "
                title="No presentation images uploaded yet"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Gallery;
