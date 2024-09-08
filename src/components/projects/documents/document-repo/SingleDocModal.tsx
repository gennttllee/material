import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import Loader, { LoaderX } from 'components/shared/Loader';
import { useAppSelector } from 'store/hooks';
import { postForm } from 'apis/postForm';
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer';
import SuperModal from 'components/shared/SuperModal';
import { Access, FileFolder } from '../types';
import { UnionType } from 'typescript';
interface DocModalType {
  closer: any;
  doc: Doc;
}

export type Doc = {
  Bucket: string;
  ContentType: string;
  S3Key: string;
  alias: string;
  folder: string | FileFolder;
  project: string;
  timestamp: string;
  __v?: number;
  _id?: string;
  folderId?: string;
  access?: Access[];
  createdBy?: string;
};

export type NewDoc = {
  Bucket: string;
  ContentType: string;
  S3Key: string;
  alias: string;
  folder: FileFolder;
  folderId: string;
  project: string;
  timestamp: string;
  __v?: number;
  _id?: string;
  access?: Access[];
  createdBy?: string;
};

export type LatestDoc = Doc | NewDoc;

const SingleDocModal = ({ closer, doc }: DocModalType) => {
  const folders = useAppSelector((m) => m.folder);
  const [config, setConfig] = useState<IDocument[]>([]);
  const [fetching, setFetching] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);

  const fetchfiles = async () => {
    setFetching(true);
    let viewerConfig: IDocument[] = [];
    let some: any[] = [];
    let { response, e } = await postForm('post', 'files/download', {
      Bucket: doc.Bucket,
      S3Key: doc.S3Key
    });
    if (response) {
      let res = await (await fetch(response.data.data.url)).blob();
      viewerConfig.push({
        uri: response.data.data.url,
        fileType: doc.ContentType,
        fileName: doc?.alias
      });
    }
    setConfig(viewerConfig);
    setFetching(false);
  };

  useEffect(() => {
    fetchfiles();
  }, []);
  return (
    <SuperModal closer={closer}>
      <div
        // onClick={() => closer()}
        className=" fixed top-0 left-0 z-50 h-screen flex flex-col justify-center w-screen  p-5 lg:px-20 lg:pt-15 bg-black bg-opacity-90 overflow-y-auto ">
        <div className="w-full  flex justify-end ">
          <span
            onClick={() => closer(false)}
            className="  mb-5   w-10 h-10  flex items-center justify-center bg-white rounded-full text-transparent">
            <CgClose color="#C8CDD4" size={20} />
          </span>
        </div>
        <div
          onClick={(e) => e.stopPropagation()}
          className="w-full h-full relative  overflow-y-auto">
          {fetching ? (
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <LoaderX color="blue" />
              <p className=" nt-2 text-2xl text-bblue">Loading..</p>
            </div>
          ) : (
            <DocViewer
              className=""
              documents={config}
              pluginRenderers={DocViewerRenderers}
              initialActiveDocument={config[0]}
            />
          )}
        </div>
      </div>
    </SuperModal>
  );
};

export default SingleDocModal;
