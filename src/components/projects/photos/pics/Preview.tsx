import React, { useState, useEffect } from 'react';
import SuperModal from 'components/shared/SuperModal';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { changeFieldValue } from 'store/slices/folderSlice';
import { postForm } from 'apis/postForm';
import Loader from 'components/shared/Loader';
interface Modal {
  closer?: () => void;
}

const Preview = ({ closer }: Modal) => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(true);
  let { previewing, files, modal } = useAppSelector((m) => m.folder);
  const [type, setType] = useState<string>(files[previewing].ContentType.split('/')[0]);
  let dispatch = useAppDispatch();
  let close = () => dispatch(changeFieldValue({ modal: false }));
  const getImage = async () => {
    setLoading(true);
    let { response, e } = await postForm('post', 'files/download', {
      Bucket: files[previewing].Bucket,
      S3Key: files[previewing].S3Key
    });
    if (response) {
      setUrl(response.data.data.url);
    }
    setLoading(false);
  };

  useEffect(() => {
    getImage();
    setType(files[previewing].ContentType.split('/')[0]);
  }, []);
  useEffect(() => {
    getImage();
    setType(files[previewing].ContentType.split('/')[0]);
  }, [previewing]);

  return (
    <SuperModal
      closer={() => close()}
      classes="bg-black bg-opacity-90 overflow-x-auto  flex items-center justify-center"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full my-auto h-full px-2 lg:px-12 flex items-center "
      >
        <span
          onClick={() => {
            if (previewing > 0) {
              dispatch(changeFieldValue({ previewing: previewing - 1 }));
            }
          }}
          className="p-4 rounded-full bg-bblack-2 hover:bg-ashShade-1 mr-2 lg:mr-6"
        >
          <FaChevronLeft color="white" size={16} />
        </span>
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white flex-1 flex overflow-y-auto flex-col py-6 px-7  rounded-md"
        >
          <div className="flex items-center  justify-between mb-8">
            <p className="font-semibold text-xs lg:text-2xl ">{files[previewing].alias}</p>
            <span
              onClick={() => close()}
              className="text-bash cursor-pointer font-semibold text-sm hover:underline hover:text-borange"
            >
              Close
            </span>
          </div>
          <div className="px-20 items-center h-[90%]  rounded-md flex-1  justify-center flex mb-10">
            <span className="w-full justify-center   rounded-md">
              {loading || url === '' ? (
                <div className="rounded-md h-96 bg-ashShade-3  max-w-full w-full flex items-center justify-center">
                  <Loader />
                </div>
              ) : type === 'image' ? (
                <img
                  src={url}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  className="rounded-md w-full h-full lg:h-70%  lg:max-w-full lg:w-full  lg:max-h-[calc(0.7*100vh)]  object-contain"
                />
              ) : (
                <video
                  controls
                  autoPlay
                  className="rounded-md lg:h-70%  max-w-full w-full  object-contain "
                >
                  <source src={url}></source>
                </video>
              )}
            </span>
          </div>
        </div>
        <span className="p-4 rounded-full bg-bblack-2 hover:bg-ashShade-1 ml-2 lg:ml-6">
          <FaChevronRight
            onClick={() => {
              if (previewing < files.length - 1) {
                dispatch(changeFieldValue({ previewing: previewing + 1 }));
              }
            }}
            color="white"
            size={16}
          />
        </span>
      </div>
    </SuperModal>
  );
};

export default Preview;
