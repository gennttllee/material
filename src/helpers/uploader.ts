import { toast } from 'react-toastify';
import { GetUploadSignedUrls } from 'apis/AwsFiles';
import { displayError, displaySuccess } from 'Utils';

export const uploadToAws = async ({
  value,
  setUploading,
  handleProgress,
  bucketName
}: {
  value: any;
  setUploading?: (val: boolean) => void;
  handleProgress?: (val: number | string) => void;
  bucketName?: string;
}): Promise<string | null> => {
  const keys: any = await GetUploadSignedUrls(value.type, bucketName).catch((er) =>
    displayError(er.message)
  );

  if (!keys?.data?.url) return null;

  const localUrl = URL.createObjectURL(value);

  const blob = await fetch(localUrl).then((res) => res.blob());

  const xhr = new XMLHttpRequest();

  const uploader = new Promise((resolve, reject) => {
    //
    xhr.onload = () => {
      resolve(keys.key);
    };
    //
    xhr.onerror = () => {
      displayError('Signature Upload Failed,try again later');
      if (setUploading) setUploading(false);
      reject();
    };
    //
    xhr.onabort = () => {
      displayError('Signture Upload Aborted');
      if (setUploading) setUploading(false);
      reject();
    };
    //
    xhr.upload.onprogress = (e) => {
      /**
       * return the progress of an image
       * * Tracking the progress
       */
      if (handleProgress && e.lengthComputable)
        handleProgress(Number((e.loaded / e.total) * 100).toFixed(0));
    };
    //
    xhr.open('PUT', keys.data.url);
    xhr.send(blob);
  });

  await toast.promise(uploader, {
    pending: `Uploading... ${value.name}`,
    success: 'Uploaded Successfully',
    error: 'Error: upload rejected'
  });

  return keys.data.key;
};
