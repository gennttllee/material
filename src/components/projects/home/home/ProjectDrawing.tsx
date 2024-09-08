import { useEffect, useState, useRef } from 'react';
import docs from '../../../assets/docs.svg';
import { postForm } from '../../../../apis/postForm';
import axios from 'axios';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import Loader, { LoaderX } from '../../../shared/Loader';
import { MdCheckCircle } from 'react-icons/md';
import { BsFileEarmarkText } from 'react-icons/bs';
import { useAppSelector } from 'store/hooks';
import mime from 'mime';
import useRole, { UserRoles } from '../../../../Hooks/useRole';
import { hoverFade } from 'constants/globalStyles';

interface Prop {
  label: string;
  project: string;
  reload: () => void;
  data?: any;
}

const buttonOwners: UserRoles[] = [UserRoles.PortfolioManager, UserRoles.ProjectOwner];

const ProjectDrawing = ({ label, project, reload, data }: Prop) => {
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const user = useAppSelector((m) => m.user);
  const { isProfessional } = useRole();
  let fileRef = useRef<any>();
  //bnkle-project-docs
  const upload = async (file: any) => {
    if (file[0].type !== 'application/pdf') {
      displayWarning('you can only submit pdf files as project documents');
      return;
    }
    setUploading(true);
    let { response, e } = await postForm('post', 'files/upload', {
      Bucket: 'bnkle-professional-docs',
      ContentType: file[0].type,
      Extension: mime.getExtension(file[0].type) || ''
    });
    if (response) {
      setProgress(20);
      try {
        let form = new FormData();
        form.append(file[0].name, file[0]);
        //response?.data?.data?.url
        await axios({
          method: 'put',
          url: response?.data?.data?.url,
          data: file[0],
          headers: { 'Content-Type': file[0].type }
        });
        setProgress(60);

        try {
          await postForm('post', 'files/add', {
            Bucket: 'bnkle-professional-docs',
            ContentType: file[0].type,
            S3Key: response?.data?.data?.key,
            project: project,
            alias: label,
            folder: 'drawings'
          });
          setProgress(100);
          displaySuccess('Upload Successful');
          reload();
        } catch (_error) {
          console.error({ _error });
        }
      } catch (error) {
        displayError('Upload Unsuccessful');
      }
    }
    setUploading(false);
  };

  const handleClick = async () => {
    if (data) {
      setUploading(true);
      let { response } = await postForm('post', 'files/download', {
        Bucket: 'bnkle-professional-docs',
        S3Key: data?.S3Key
      });
      if (response) {
        window.open(response.data.data.url, '_newtab');
      }
      setUploading(false);
    }
  };

  return (
    <div className="flex-col w-full rounded-md bg-ashShade-0 flex my-2 sm:mx-2 p-4">
      <div className="w-full  flex justify-between items-center ">
        <div className="flex items-center">
          {data ? (
            <MdCheckCircle color={'green'} size={32} />
          ) : (
            <span className="px-3 py-4 border-2 rounded-md border-ashShade-2">
              <BsFileEarmarkText className="text-bash text-lg" />
            </span>
          )}
          <div className="flex flex-col ml-2">
            <button
              onClick={handleClick}
              className={`text-sm sm:text-lg font-Medium
                ${data ? 'hover:underline text-bblue' : ''} ${hoverFade}`}>
              {label}
            </button>
            <div className="flex items-center text-bash">
            </div>
          </div>
        </div>
        {!isProfessional && (
          <span
            className={`relative px-2 py-1 ${uploading ? '' : 'border'} ${
              data === undefined
                ? 'border-bblue text-bblue'
                : ' border-red-600 hover:text-white  text-red-600 hover:bg-red-600'
            } rounded-md text-sm `}>
            {user.role && buttonOwners.includes(user.role) && (
              <button
                disabled={uploading ? true : false}
                onClick={async () => {
                  if (!data) {
                    fileRef.current.click();
                  } else {
                    {
                      setUploading(true);
                      let { response } = await postForm('delete', `files/delete/${data._id}`);

                      setUploading(false);
                      if (response) {
                        displaySuccess('Document has been deleted Successfully');
                        reload();
                      } else {
                        displayError('Document could not be deleted');
                      }
                    }
                  }
                }}
                className=" z-10 text-xs">
                {uploading ? <LoaderX /> : data === undefined ? 'Upload' : 'Delete'}
              </button>
            )}
            <input
              ref={fileRef}
              type={'file'}
              accept=".pdf,.PDF"
              className="hidden"
              onClick={(e) => {}}
              onChange={(e) => {
                upload(e.target.files);
                // setFile(()=>e.target.files);
              }}
            />
          </span>
        )}
      </div>
      {uploading && (
        <div className="rounded-full mt-2 w-full h-1 bg-ashShade-3">
          <div
            style={{ width: `${progress}%` }}
            className={` block h-full bg-bblue rounded-full`}></div>
        </div>
      )}
    </div>
  );
};

export default ProjectDrawing;
