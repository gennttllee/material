import { BucketNames } from '../constants';
import { Fetcher } from '../helpers/fetcher';

let Base_URL = process.env.REACT_APP_API_PROJECTS;
Base_URL = Base_URL?.slice(0, Base_URL.length - 1);
export const GetUploadSignedUrls = (contentType: string, bucketName?: string) => {
  const payload = {
    Extension: contentType.split('/')[1],
    Bucket: bucketName || BucketNames[1],
    ContentType: contentType
  };
  return Fetcher(`${Base_URL}/files/upload`, 'POST', payload);
};

export const GetDownloadSignedUrls = (key: string, bucketName?: string) => {
  const payload = {
    Bucket: bucketName || BucketNames[1],
    S3Key: key
  };
  return Fetcher<{ url: string; key: string }>(`${Base_URL}/files/download`, 'POST', payload);
};
