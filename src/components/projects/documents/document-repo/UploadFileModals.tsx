import React, { useMemo, useRef, useState, useContext, useEffect } from 'react';
import SuperModal from 'components/shared/SuperModal';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { changeFieldValue } from 'store/slices/folderSlice';
import { LoaderX } from 'components/shared/Loader';
import axios from 'axios';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import { StoreContext } from 'context';
import mime from 'mime';
import { groupFiles } from '.';
import SelectBox, { DocSelectBox } from 'components/shared/SelectBox';
import { uploadAll, uploadAllWithOptions } from 'Hooks/useProjectImages';
import SelectField from 'components/shared/SelectField';
import { RiAttachment2 } from 'react-icons/ri';
import { truncateText } from 'components/shared/utils';
import { IoCloseOutline } from 'react-icons/io5';
import { toggle } from 'store/slices/profileSlice';
import { useParams } from 'react-router-dom';

interface CreateNewFolderModalProps {
  toggler: () => void;
  onUploadComplete: () => Promise<void>;
}

function UploadFileModal({ toggler, onUploadComplete }: CreateNewFolderModalProps) {
  let [file, setFile] = useState<File[]>([]);
  let [folder, setFolder] = useState('files');
  let [loading, setLoading] = useState(false);
  let fileRef = useRef<HTMLInputElement>(null);
  let dispatch = useAppDispatch();
  let folders = useAppSelector((m) => m.folder);
  const [selected, setSelected] = useState('');
  const [buttonClicked, setButtonClicked] = useState(false);
  const { data, selectedProjectIndex } = useContext(StoreContext);
  const { id } = useParams();
  let _folders = React.useMemo(() => {
    return folders.fileFolders
      .filter((m) => m.name !== 'media')
      .map((m) => {
        return { label: m.name, value: m._id };
      });
  }, [folders.files]);

  useEffect(() => {
    if (selected !== 'other_+=') setFolder(selected);
  }, [selected]);

  let errors = useMemo(() => {
    let _error = {
      file: '',
      folder: ''
    };
    if (file.length === 0) _error.file = 'Please pick a file you want to upload';

    if (!folder && selected === 'other_+=') _error.folder = 'Please enter a folder';

    return _error;
  }, [file, folder]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let _file: File[] = [];
    let file = e.target.files;
    for (let i in file) {
      if (!['length', 'item'].includes(i)) {
        _file.push(file[i as any]);
      }
    }
    setFile(_file);
  };

  const handleSubmit = async () => {
    setButtonClicked(true);
    setLoading(true);
    if (!errors.file && !errors.folder) {
      let options: Record<string, any> = {};

      if (id) {
        options['folderId'] = id;
      } else {
        if (selected === 'other_+=') {
          options['folder'] = folder;
        } else {
          options['folderId'] = folder;
        }
      }


      let x = await uploadAllWithOptions(file, data[selectedProjectIndex]._id, options);
      let count = 0;
      for (let i = 0; i < x.length; i++) {
        if (!x[i].e) {
          count++;
        }
      }
      if (count === file.length) {
        toggler();
        onUploadComplete();
      }
    }
    setLoading(false);
  };

  const handleRemoval = (idx: number) => () => {
    setFile((_) => _.filter((m, i) => i != idx));
  };

  const buttonText = useMemo(() => {
    let upload = 'Upload';
    let isNewFolder = _folders.filter((m) => folder && m.value === folder).length === 0;
    return isNewFolder && folder ? 'Create and ' + upload : upload;
  }, [folder, file, _folders]);

  return (
    <SuperModal classes=" bg-opacity-50 bg-black flex justify-center" closer={() => toggler()}>
      <div
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="bg-white rounded-md m-auto p-6 text-bash lg:w-[435px] font-medium">
        <div className="flex items-center justify-between">
          <span className="text-2xl text-black font-semibold">Upload File</span>
          <span onClick={() => toggler()} className="text-sm hover:cursor-pointer hover:underline ">
            Close
          </span>
        </div>
        <div className="mt-4">
          <span>Upload File</span>
          <div
            onClick={() => {
              fileRef.current?.click();
            }}
            className="w-full flex justify-between items-center  border-ashShade-2 border px-4 min-h-[40px] mt-2 rounded-md ">
            {file.length === 0 && <span className="text-bash">Select a file</span>}
            <div className="flex flex-wrap gap-2 py-1">
              {file.map((m, i) => (
                <BFile key={m.name} file={m} onRemove={handleRemoval(i)} />
              ))}
            </div>

            <RiAttachment2 size={16} />
          </div>
          {errors.file && !!buttonClicked && <p className="text-red-400 text-xs">{errors.file}</p>}
        </div>
        <input
          type="file"
          onChange={handleChange}
          multiple
          ref={fileRef}
          className="w-full hidden rounded-md mt-2 outline-bblue border border-ashShade-0 px-4 py-2"
        />
        {!id && (
          <div className="mt-4">
            <p className="text-sm mt-4 ">Select folder (Optional)</p>
            <div className="mt-1.5">
              <DocSelectBox
                onSelectNew={() => {
                  setSelected('other_+=');
                  setFolder('');
                }}
                placeholder="Select folder"
                options={[..._folders, { label: 'New Folder', value: 'other_+=' }]}
                state={folder}
                setter={(v: string) => setFolder(v)}
              />
            </div>
          </div>
        )}

        {selected === 'other_+=' && (
          <div className="mt-4">
            <span className="text-sm  ">Folder Name</span>
            <input
              type="text"
              value={folder}
              onChange={(e) => setFolder(e.target.value)}
              placeholder="Type folder name"
              className="w-full rounded-md mt-1.5 outline-bblue border-ashShade-2 border px-4 py-2"
            />
          </div>
        )}

        {errors.folder && !!buttonClicked && (
          <p className="text-red-400 text-xs mt-1">{errors.folder}</p>
        )}

        <div className="flex items-center justify-end gap-x-4 mt-7">
          <button
            onClick={() => toggler()}
            className="rounded-md border border-ashShade-1 py-2 px-8 flex-1 ">
            Cancel
          </button>

          <button
            disabled={loading}
            onClick={handleSubmit}
            className={`rounded-md border flex-1  ${
              errors.file || errors.folder
                ? 'bg-ashShade-4 border-ashShade-1'
                : ' bg-bblue text-white border-bblue'
            }  py-2 px-8 flex items-center justify-center whitespace-nowrap`}>
            {loading ? <LoaderX /> : buttonText}
          </button>
        </div>
      </div>
    </SuperModal>
  );
}
interface BFileProps {
  file: File;
  onRemove: () => void;
}
const BFile = ({ file, onRemove }: BFileProps) => {
  return (
    <span
      className="flex items-center justify-between p-1 px-2 bg-ashShade-0 rounded"
      onClick={(e) => {
        e.stopPropagation();
      }}>
      <span>{truncateText(file.name, 10)}</span>
      <span onClick={onRemove}>
        <IoCloseOutline size={16} />
      </span>
    </span>
  );
};

export default UploadFileModal;
