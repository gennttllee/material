import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import Loader, { LoaderX } from 'components/shared/Loader';
import { useAppSelector } from 'store/hooks';
import { postForm } from 'apis/postForm';
import DocViewer, { DocViewerRenderers, IDocument } from '@cyntler/react-doc-viewer';
import SuperModal from 'components/shared/SuperModal';
import { useLocation } from 'react-router-dom';
import { LatestDoc } from '../document-repo/SingleDocModal';
interface DocModalType {
  closer: any;
  invite?: any;
  active?: number;
}

export type Doc = {
  Bucket: string;
  ContentType: string;
  S3Key: string;
  alias: string;
  folder: string;
  project: string;
  timestamp: string;
  __v?: number;
  _id?: string;
};
const DocModal = ({ closer, invite, active }: DocModalType) => {
  const folders = useAppSelector((m) => m.folder);
  const [config, setConfig] = useState<IDocument[]>([]);
  const [fetching, setFetching] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);
  let { pathname } = useLocation();

  const fetchfiles = async () => {
    setFetching(true);
    let path = pathname.split('/');
    let current = path[path.length - 1];
    let doc: LatestDoc[] = folders.files.filter((m) => m?.folderId === current);
    let viewerConfig: IDocument[] = [];
    let some: any[] = [];
    let newDoc = await Promise.all(
      doc.map((m) =>
        postForm('post', 'files/download', {
          Bucket: m.Bucket,
          S3Key: m.S3Key
        })
      )
    );

    newDoc.map((m, i) => {
      if (m.response) {
        viewerConfig.push({
          uri: m.response.data.data.url,
          fileType: doc[i].ContentType,
          fileName: doc[i]?.alias
        });
      }
    });

    setConfig(viewerConfig);
    setFetching(false);
  };

  useEffect(() => {
    fetchfiles();
  }, []);
  return (
    <SuperModal closer={closer}>
      <div
        onClick={() => closer()}
        className="  h-screen flex flex-col justify-center w-screen  p-5 lg:px-20 lg:pt-15 bg-black bg-opacity-90 overflow-y-auto ">
        <div className="w-full realative flex justify-end">
          <span
            onClick={() => closer(false)}
            className=" top-10 mb-5 right-10  w-10 h-10 z-[1000] flex items-center justify-center bg-white rounded-full text-transparent">
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
              initialActiveDocument={config[active || 0]}
            />
          )}
        </div>
      </div>
    </SuperModal>
  );
};

export default DocModal;
