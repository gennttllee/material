import { useRef, useState, useEffect } from 'react';
import { MdOutlineFileUpload } from 'react-icons/md';
import { postForm } from '../../../../../apis/postForm';
import axios from 'axios';
import { useAppSelector, useAppDispatch } from '../../../../../store/hooks';
import { updateField } from '.././../../../../store/slices/bidslice';
import { displayError, displaySuccess, displayWarning } from 'Utils';
import { bytesToSize } from 'components/shared/utils';
import { RiDeleteBin5Line } from 'react-icons/ri';
import { refreshBid } from 'store/slices/bidslice';
import mime from 'mime';
import filedownload from 'js-file-download';

interface Props {
  index: number;
  doc: any;
  name: string;
  requiresResponse: boolean;
}

const Document = ({ doc, name }: Props) => {
  const dispatch = useAppDispatch();
  let bids: any = useAppSelector((m: any) => m.bid);
  const [fetching, setFetching] = useState(false);
  const [progress, setProgress] = useState(0);
  const [files, setFiles] = useState<any>();
  const fileRef = useRef<any>();
  const [url, setUrl] = useState('');

  const update = (index: number, config: any, docs: any) => {
    let newDocs = [...docs];
    newDocs[index] = { ...newDocs[index], ...config };
    let change: any[] = [];
    newDocs.map((m) => {
      let x: any = { ...m };
      delete x._id;
      change.push(x);
    });
    return change;
  };

  const findIndex = () => {
    for (let i = 0; i < bids.bidDocuments.length; i++) {
      if (bids.bidDocuments[i]._id === doc._id && bids.bidDocuments[i].name === doc.name) {
        return i;
      }
    }
    return -1;
  };

  const geturl = async () => {
    let { response, e } = await postForm('post', 'files/download', {
      S3Key: doc.key,
      Bucket: 'bnkle-professional-docs'
    });
    if (response) {
      setUrl(response.data.data.url);
    }
  };
  useEffect(() => {
    if (doc?.key) {
      geturl();
    }
  }, []);

  const deleteIndex = (xy: number, x: any[]) => {
    let left = x.slice(0, xy);
    let right = x.slice(xy + 1);
    return [...left, ...right];
  };

  const upload = async (file: any) => {
    try {
      setFetching(true);

      let { e, response } = await postForm('post', 'files/upload', {
        Bucket: 'bnkle-professional-docs',
        ContentType: file.type,
        Extension: mime.getExtension(file.type)
      });

      if (response) {
        setProgress(20);

        let res = await axios({
          method: 'put',
          url: response?.data?.data?.url,
          data: file,
          headers: { 'Content-Type': file.type }
        });
        if (res) {
          setProgress(50);
        }
        let bidDocs = bids.bidDocuments;
        let config = {
          key: response?.data?.data?.key,
          isAvailable: true,
          meta: {
            ...doc?.meta,
            size: file.size,
            type: file.type,
            name: file.name
          }
        };

        let newBidDocs = update(findIndex(), config, bids.bidDocuments);
        let addedFile = await postForm('patch', `bids/${bids._id}`, {
          bidDocuments: newBidDocs
        });

        if (addedFile.response) {
          dispatch(updateField({ bidDocuments: newBidDocs }));
          setProgress((d) => 100);
          setProgress((d) => 0);
          displaySuccess('File upload successful');
          dispatch(refreshBid(bids._id));
        } else {
          displayWarning('could not update bid, please try again');
        }
      }
    } catch (e) {
      displayError("couldn't upload file");
    }
    setFetching(false);
  };

  const deleteFile = async () => {
    setFetching(true);
    setProgress(10);
    let { response, e } = await postForm('patch', `bids/${bids._id}/bid-document/${doc?._id}`);

    if (response) {
      setProgress(80);
      let newDocs = deleteIndex(findIndex(), bids.bidDocuments);
      dispatch(updateField({ bidDocuments: newDocs }));
      displaySuccess('File Deleted Successfully');
    } else {
      displayError('Could not delete file');
    }
    setFetching(false);
    setProgress(0);
  };

  return (
    <div className="mb-4 bg-ashShade-0 p-4 flex flex-col  rounded-lg">
      <div className="flex items-center justify-between">
        <div className="flex  flex-col">
          <input
            type="file"
            className="hidden"
            ref={fileRef}
            name="document"
            id=""
            onChange={(e: any) => {
              if (e.target.files[0]) {
                upload(e.target.files[0]);
              }
            }}
          />
          <span className="font-semibold text-bblack-0">{name}</span>
          {doc.isAvailable ? (
            <div className="flex items-center">
              <span className="text-sm text-bash">{bytesToSize(doc?.meta?.size)}</span>
              <span className="py-1 px-2 ml-3 text-sm rounded-full bg-[#FFF3EB] text-borange">
                {mime.getExtension(doc?.meta?.type)?.toUpperCase()}
              </span>
            </div>
          ) : null}
        </div>
        <div className="flex ">
          {doc.isAvailable && url !== '' && (
            <span
              onClick={() => {
                if (url) {
                  let handleDownload = () => {
                    axios
                      .get(url, {
                        responseType: 'blob'
                      })
                      .then((res) => {
                        filedownload(res.data, doc.name + '_' + bids?.name);
                      });
                  };
                  handleDownload();
                }
              }}
              className="p-2 rotate-180 cursor-pointer rounded-full bg-ashShade-3"
            >
              <MdOutlineFileUpload size={16} color="#5E6777" />
            </span>
          )}
          <span
            onClick={() => fileRef.current.click()}
            className="p-2 cursor-pointer rounded-full bg-ashShade-3"
          >
            <MdOutlineFileUpload size={16} color="#5E6777" />
          </span>
          {name !== 'Unpriced Bill of Quantities' &&
          name.toLowerCase() !== 'Bill of quantities'.toLowerCase() ? (
            <span
              onClick={() => deleteFile()}
              className="p-2 rounded-full cursor-pointer ml-2 bg-ashShade-3"
            >
              <RiDeleteBin5Line size={16} color="#5E6777" />
            </span>
          ) : null}
        </div>
      </div>
      {fetching ? (
        <div className="w-full mt-4 h-2 bg-ashShade-3 rounded-lg">
          <div style={{ width: `${progress}%` }} className="rounded-lg z-10 bg-bblue h-full "></div>
        </div>
      ) : null}
    </div>
  );
};

export default Document;
