import { useEffect, useState } from 'react';
import { CgClose } from 'react-icons/cg';
import Loader, { LoaderX } from 'components/shared/Loader';
import { useAppSelector } from 'store/hooks';
import { postForm } from 'apis/postForm';
import DocViewer, { DocViewerRenderers } from '@cyntler/react-doc-viewer';
import SuperModal from 'components/shared/SuperModal';

interface DocModalType {
  closer: any;
  invite: any;
}
const DocModal = ({ closer, invite }: DocModalType) => {
  const bid = useAppSelector((m) => m.bid);
  const [config, setConfig] = useState<{ uri: any }[]>([]);
  const [fetching, setFetching] = useState(false);
  const [docs, setDocs] = useState<any[]>([]);
  const getDocs: () => any = () => {
    let { submittedBids } = bid;

    if (submittedBids) {
      for (let i = 0; i < submittedBids.length; i++) {
        if (submittedBids[i].bidder === invite.bidder) {
          return submittedBids[i];
        }
      }
    }
    return;
  };
  const fetchfiles = async () => {
    setFetching(true);
    let doc = getDocs().docs;

    let viewerConfig: { uri: any }[] = [];
    let some: any[] = [];

    for (let i = 0; i < doc.length; i++) {
      let { response, e } = await postForm('post', 'files/download', {
        Bucket: 'bnkle-professional-docs',
        S3Key: doc[i].key
      });
      if (response) {
        let res = await (await fetch(response.data.data.url)).blob();
        viewerConfig.push({
          uri: response.data.data.url
        });
        some.push({ blob: res, type: res.type });
      }
    }

    setConfig(viewerConfig);
    setDocs(some);
    setFetching(false);
  };

  useEffect(() => {
    fetchfiles();
  }, []);
  return (
    <SuperModal closer={closer}>
      <div className="  h-screen flex flex-col justify-center w-screen  p-5 lg:px-20 lg:pt-15 bg-ashShade-5 overflow-y-auto ">
        <div className="w-full realative flex justify-end">
          <span
            onClick={() => closer(false)}
            className=" top-10 mb-5 right-10  w-10 h-10 z-[1000] flex items-center justify-center bg-white rounded-full text-transparent">
            <CgClose color="#C8CDD4" size={20} />
          </span>
        </div>
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="w-full h-full relative  overflow-y-auto">
          {fetching ? (
            <div className="w-full h-full flex flex-col items-center justify-center ">
              <LoaderX color="blue" />
              <p className=" nt-2 text-2xl text-bblue">Loading..</p>
            </div>
          ) : (
            <DocViewer
              className="rounded-xl"
              documents={config}
              pluginRenderers={DocViewerRenderers}
            />
          )}
        </div>
      </div>
    </SuperModal>
  );
};
//
export default DocModal;
