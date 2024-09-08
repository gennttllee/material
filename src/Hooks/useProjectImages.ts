import React, { useContext, useEffect, useState } from 'react';
import { postForm } from 'apis/postForm';
import { StoreContext } from 'context';
import { filterForMedia } from 'components/projects/photos/pics';
import { GetDownloadSignedUrls } from 'apis/AwsFiles';
import mime from 'mime';
import axios from 'axios';
import { displayError, displaySuccess, displayWarning, displayInfo } from 'Utils';
import { useAppSelector } from 'store/hooks';
import useFiles from 'components/projects/documents/document-repo/useFiles';
import { NewDoc } from 'components/projects/documents/document-repo/SingleDocModal';

const useProjectImages = (folder?: string, deps: any[] = []) => {
  let { getFiles } = useFiles(true);
  const { data, selectedProjectIndex, activeProject } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [images, setImages] = useState<any[]>([]);
  const { files, fileFolders } = useAppSelector((m) => m.folder);

  useEffect(() => {
    if (fileFolders.length === 0) {
      getFiles();
    }
  }, []);

  const fetchImages = async () => {
    let { response, e } = await postForm(
      'get',
      `files/sort/project/${data[selectedProjectIndex]._id}`
    );

    if (!e) {
      const _files = filterForMedia(files).filter((m) => {
        let asFile = m as NewDoc;
        if (!folder) return true;
        if (folder) {
          if (folder) return asFile.folder?.name === folder;
        }
      });
      let urls = await Promise.all(_files.map((m) => GetDownloadSignedUrls(m.S3Key)));

      let ims = urls.map((m) => m.data.url);
      setImages(ims.reverse());
    }
    setLoading(false);
  };
  useEffect(() => {
    fetchImages();
  }, [fileFolders, files, activeProject, ...deps]);
  return { loading, images };
};

const useUploader = (files: File[], deps: any[]) => {
  let [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const { data, selectedProjectIndex } = useContext(StoreContext);

  useEffect(() => {
    if (files.length > 0) {
      uploadAll();
    }
  }, [...deps]);

  const uploadAll = async () => {
    await Promise.all(files.map((m) => upload(m)));
  };

  const upload = async (file: any) => {
    setLoading(true);
    let { response, e } = await postForm('post', 'files/upload', {
      Bucket: 'bnkle-professional-docs',
      ContentType: file.type,
      Extension: mime.getExtension(file.type) || ''
    });
    if (response) {
      try {
        let form = new FormData();
        form.append(file.name, file);
        await axios({
          method: 'put',
          url: response?.data?.data?.url,
          data: file,
          headers: { 'Content-Type': file.type }
        });

        try {
          let res = await postForm('post', 'files/add', {
            Bucket: 'bnkle-professional-docs',
            ContentType: file.type,
            S3Key: response?.data?.data?.key,
            project: data[selectedProjectIndex]._id,
            alias: file.name,
            folder: 'media'
          });
          if (res.e) {
            displayError(`Upload for ${file.name} Unsuccessful`);
          } else {
            // setProgress(100);
            displaySuccess('Upload Successful');
            // dispatch(
            //   changeFieldValue({
            //     all: [res.response.data.data, ...folder.files],
            //   })
            // );
          }
        } catch (error) {
          Promise.reject(error);
        }
      } catch (error) {
        displayWarning(`Upload for ${file.name} Unsuccessful`);
      }
    }
    setLoading(false);
    return { response, e };
  };

  return { loading };
};

const uploadAll = async (files: File[], projectId: string, folder: string = 'media') => {
  return await Promise.all(files.map((m) => upload(m, projectId, folder)));
};

const upload = async (file: File, projectId: string, folder: string) => {
  let { response, e } = await postForm('post', 'files/upload', {
    Bucket: 'bnkle-professional-docs',
    ContentType: file.type,
    Extension: mime.getExtension(file.type) || ''
  });
  if (response) {
    try {
      let form = new FormData();
      form.append(file.name, file);
      await axios({
        method: 'put',
        url: response?.data?.data?.url,
        data: file,
        headers: { 'Content-Type': file.type }
      });

      try {
        let res = await postForm('post', 'files/add', {
          Bucket: 'bnkle-professional-docs',
          ContentType: file.type,
          S3Key: response?.data?.data?.key,
          project: projectId,
          alias: file.name,
          folder: folder
        });
        if (res.e) {
          e = res.e;
          displayError(`Upload for ${file.name} Unsuccessful`);
        } else {
          // setProgress(100);

          displaySuccess('Upload Successful');
          // dispatch(
          //   changeFieldValue({
          //     all: [res.response.data.data, ...folder.files],
          //   })
          // );
        }
      } catch (error) {
        Promise.reject(error);
      }
    } catch (error) {
      displayWarning(`Upload for ${file.name} Unsuccessful`);
    }
  }
  return { e, response };
};

const uploadWithOptions = async (file: File, projectId: string, options: Record<string, any>) => {
  let { response, e } = await postForm('post', 'files/upload', {
    Bucket: 'bnkle-professional-docs',
    ContentType: file.type,
    Extension: mime.getExtension(file.type) || ''
  });
  if (response) {
    try {
      let form = new FormData();
      form.append(file.name, file);
      await axios({
        method: 'put',
        url: response?.data?.data?.url,
        data: file,
        headers: { 'Content-Type': file.type }
      });

      try {
        let res = await postForm('post', 'files/add', {
          Bucket: 'bnkle-professional-docs',
          ContentType: file.type,
          S3Key: response?.data?.data?.key,
          project: projectId,
          alias: file.name,
          ...options
        });
        if (res.e) {
          e = res.e;
          displayError(`Upload for ${file.name} Unsuccessful`);
        } else {
          // setProgress(100);

          displaySuccess('Upload Successful');
          // dispatch(
          //   changeFieldValue({
          //     all: [res.response.data.data, ...folder.files],
          //   })
          // );
        }
      } catch (error) {
        Promise.reject(error);
      }
    } catch (error) {
      displayWarning(`Upload for ${file.name} Unsuccessful`);
    }
  }
  return { e, response };
};

const uploadAllWithOptions = async (
  files: File[],
  projectId: string,
  options: Record<string, any>
) => {
  return await Promise.all(files.map((m) => uploadWithOptions(m, projectId, options)));
};

const uploadFile = async (file: File, projectId: string, folder: string) => {
  let { response, e } = await postForm('post', 'files/upload', {
    Bucket: 'bnkle-professional-docs',
    ContentType: file.type,
    Extension: mime.getExtension(file.type) || ''
  });
  if (response) {
    try {
      let form = new FormData();
      form.append(file.name, file);
      await axios({
        method: 'put',
        url: response?.data?.data?.url,
        data: file,
        headers: { 'Content-Type': file.type }
      });

      try {
        let res = await postForm('post', 'files/add', {
          Bucket: 'bnkle-professional-docs',
          ContentType: file.type,
          S3Key: response?.data?.data?.key,
          project: projectId,
          alias: file.name,
          folder: folder
        });
        if (res.e) {
          e = res.e;
          displayError(`Upload for ${file.name} Unsuccessful`);
        } else {
          response = res.response;
          displaySuccess('Upload Successful');
        }
      } catch (error) {
        Promise.reject(error);
      }
    } catch (error) {
      displayWarning(`Upload for ${file.name} Unsuccessful`);
    }
  }
  return { e, response, file };
};

const uploadMultipleFiles = async (files: File[], projectId: string, folder = 'bids') => {
  let uploads = await Promise.all(files?.map((m) => uploadFile(m, projectId, folder)) || []);
  let docs = [];
  for (let upload of uploads) {
    let file = upload.file;
    docs.push({
      name: file.name,
      key: upload.response.data?.data?.S3Key,
      meta: {
        size: file.size,
        type: file.type,
        name: file.name
      }
    });
  }

  return docs;
};

export {
  useUploader,
  uploadAll,
  upload,
  uploadFile,
  uploadMultipleFiles,
  uploadAllWithOptions,
  uploadWithOptions
};

export default useProjectImages;
