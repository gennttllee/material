import React, { useState } from 'react';
import { AiOutlineLoading } from 'react-icons/ai';
import { FiDownload } from 'react-icons/fi';
import { displayError, displaySuccess } from 'Utils';
import { GetDownloadSignedUrls } from '../../../../../apis/AwsFiles';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import { ProfessionalBid, SubmittedBid } from '../../../../../types';
import UploadIcon from '../../../../shared/UploadIcon';

interface Props {
  value: any;
  index: number;
  isUploading: boolean;
  one: ProfessionalBid['bidDocuments'][number];
  submittedBid?: SubmittedBid<string> | null;
  onChange: (key: string, val: any) => void;
  hideUploadBtn?: boolean;
  disabled?: boolean;
}

const DocumentCard = ({
  one,
  index,
  value,
  onChange,
  disabled = false,
  submittedBid,
  isUploading,
  hideUploadBtn = false
}: Props) => {
  const [isLoading, setLoader] = useState(false);
  const [isSubmitLoading, setSubmitLoader] = useState(false);

  const downloadFile = () => {
    setLoader(true);
    if (one.key)
      GetDownloadSignedUrls(one.key)
        .then((res) => {
          const { url } = res.data as any;
          /** initiate Download */
          fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
              //
              if (one.key) {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${one.name}.${one.key.split('.')[1]}`);

                // Append to html link element page
                document.body.appendChild(link);

                // Start download
                link.click();

                // Clean up and remove the link
                link.parentNode?.removeChild(link);
              }
            })
            .catch((er) => displayError('Access Denied'))
            .finally(() => setLoader(false));
        })
        .catch((er) => displayError('Error'))
        .finally(() => setLoader(false));
  };

  const downloadSubmitted = () => {
    const doc = submittedBid?.docs.find((el) => el.parentDoc === one._id);

    if (doc) {
      setSubmitLoader(true);
      GetDownloadSignedUrls(doc?.key)
        .then((res) => {
          const { url } = res.data as any;
          /** initiate Download */
          fetch(url)
            .then((res) => res.blob())
            .then((blob) => {
              const url = window.URL.createObjectURL(blob);
              const link = document.createElement('a');
              link.href = url;
              link.setAttribute('download', doc.meta.name || '');

              // Append to html link element page
              document.body.appendChild(link);

              // Start download
              link.click();

              // Clean up and remove the link
              link.parentNode?.removeChild(link);
            })
            .catch((er) => displayError('Access Denied'))
            .finally(() => setSubmitLoader(false));
        })
        .catch((er) => displayError('Error'))
        .finally(() => setSubmitLoader(false));
    }
  };

  const formatFileSize = (bytes: any, decimalPoint?: number) => {
    if (bytes === 0) return '0 Bytes';
    var k = 1000,
      dm = decimalPoint || 2,
      sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'],
      i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  return (
    <div className={flexer + `bg-pbg p-4 rounded-lg ${!index ? 'mt-9' : 'mt-4'}`}>
      <div>
        <strong className="text-md font-Medium">{one.name}</strong>
        {value ? (
          <div className="flex items-center">
            <label className="p-1 text-xs max truncate font-Medium max-w-150 md:max-w-200 text-ashShade-1">
              {value.name}
            </label>
            <label className="p-1 text-xs font-Medium bg-orange-200 text-borange rounded-sm trucnate">
              {formatFileSize(Number(value.size))}
            </label>
          </div>
        ) : (
          <div className="flex items-center">
            <label className="p-1 text-xs max truncate font-Medium max-w-150 md:max-w-200 text-ashShade-1">
              Download {one.name}
            </label>
            <label className="p-1 text-xs font-Medium bg-orange-200 text-borange rounded-sm trucnate">
              {formatFileSize(Number(one.meta?.size || 0))}
            </label>
          </div>
        )}
      </div>
      <div className="flex items-center">
        {one.requiresResponse && (
          <>
            {value ? (
              <div className={'bg-bgreen-0 px-2 py-1 rounded-full flex items-center mr-4'}>
                <p
                  onClick={downloadSubmitted}
                  className={'font-Medium text-xs text-white' + hoverFade}
                >
                  {isSubmitLoading ? 'Downloading...' : 'Submitted'}
                </p>
                {isSubmitLoading ? (
                  <AiOutlineLoading className="text-white animate-spin ml-2" />
                ) : (
                  <FiDownload className="text-white ml-2" />
                )}
              </div>
            ) : hideUploadBtn ? null : disabled ? null : (
              <UploadIcon
                {...{ isUploading }}
                accept=".pdf"
                handleChange={(val) => onChange(one.name, val)}
              />
            )}
          </>
        )}
        <button onClick={downloadFile} className={`rounded-full bg-ashShade-3 ${hoverFade} p-2`}>
          {isLoading ? (
            <AiOutlineLoading className="text-ashShade-1 animate-spin" />
          ) : (
            <FiDownload className="text-ashShade-1" />
          )}
        </button>
      </div>
    </div>
  );
};

export default DocumentCard;
