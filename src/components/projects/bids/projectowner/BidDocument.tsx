import { useState, useMemo } from 'react';
import { BsPatchCheckFill } from 'react-icons/bs';
import { useAppSelector, useAppDispatch } from '../../../../store/hooks';
import useContractorDetails from '../../../../Hooks/useContractorDetails';
import { postForm } from '../../../../apis/postForm';
import DocModal from './DocModal';
import winningBadge from 'assets/winningbadge.svg';
import { TbBuildingSkyscraper } from 'react-icons/tb';
import { displayError, displayInfo, displaySuccess } from 'Utils';
import { display } from 'store/slices/contractorProfileSlice';
import { IoDocumentAttachOutline } from 'react-icons/io5';
import { truncateText } from 'components/shared/utils';

interface Prop {
  invite: any;
  setter?: any;
  selected?: any;
  isModal?: boolean;
}

const BidDocument = ({ invite, selected, setter, isModal }: Prop) => {
  let dispatch = useAppDispatch();
  const bid = useAppSelector((m) => m.bid);
  const [showModal, setShowModal] = useState(false);
  const [pages, setPages] = useState(0);
  const [loaderror, setLoaderror] = useState(false);

  let x = Math.random();
  let { details, image, loading } = useContractorDetails(invite.bidder, bid.type);
  const getDocs: () => any = () => {
    let { submittedBids } = bid;

    if (submittedBids) {
      for (let i = 0; i < submittedBids.length; i++) {
        if (submittedBids[i].bidder === invite.bidder) {
          return submittedBids[i];
        }
      }
    }
    return {};
  };
  const subbid = useMemo(() => getDocs(), []);
  const fetchfile = async () => {
    let { response, e } = await postForm(
      'post',
      'professionals/generate-signed-url/download',
      {
        key: getDocs().docs[0].key
      },
      'iam'
    );
    if (response) {
      return response.data.data.url;
    } else return '';
  };

  const hasDeclined = () => {
    let wins = bid?.winningBid;
    if (wins.length < 1) {
      return false;
    }
    for (let i = 0; i < wins.length; i++) {
      if (subbid._id === wins[i].id && wins[i].status === 'declined') {
        return true;
      }
    }
    return false;
  };
  const didIWin = () => {
    if (!hasDeclined()) {
      if (bid?.winningBid[bid?.winningBid?.length - 1]?.id === subbid._id && subbid?._id) {
        return true;
      } else {
        return false;
      }
    } else {
      return false;
    }
  };
  return (
    <>
      {showModal ? <DocModal closer={setShowModal} invite={invite} /> : null}
      <div
        onClick={() => {
          if (isModal) {
            setter(subbid);
          }
        }}
        className={`w-full ${isModal && (!subbid?._id || hasDeclined()) ? 'hidden' : ''} ${
          isModal ? ' z-50' : ''
        } relative mb-2  p-4 rounded-lg bg-white ${
          selected?._id && selected._id === subbid._id && isModal ? 'border-2 border-bblue' : ''
        } `}
      >
        <div
          onClick={async () => {
            if (!isModal) {
              if (new Date().getTime() < new Date(bid?.schedule?.end).getTime()) {
                displayInfo('You cannot view bid until bid is over');
                return;
              }
              if (subbid?._id) {
                setShowModal(!showModal);
              } else {
                displayInfo('This contractor has not submitted a bid');
              }
            }
          }}
          className="flex-1 flex  mb-10 "
        >
          <IoDocumentAttachOutline size={48} color={subbid?._id ? '#5E6777' : '#D3D3D3'} />
          <div className="ml-4 flex-1 ">
            <div>
              <p className="font-semibold">Bill of Quantities</p>
              {subbid?._id ? (
                <div className="flex text-xs items-center ">
                  <span></span>
                  <span className="ml-3 mt-2 cursor-pointer py-1 hover:underline px-2 text-[#FF8A34]  bg-[#FFF3EB] rounded-full">
                    {'Documents Available'}
                  </span>
                </div>
              ) : null}
            </div>
          </div>
          {selected?._id && selected?._id === subbid._id && isModal ? (
            <BsPatchCheckFill className=" ml-2 mt-1" color={'blue'} size={14} />
          ) : null}
        </div>
        {didIWin() ? (
          <img
            loading="lazy"
            decoding="async"
            src={winningBadge}
            className="absolute z-20 right-6 top-0"
          />
        ) : null}

        <div
          onClick={() => {
            if (!isModal) {
              dispatch(display({ type: bid.type, profId: invite.bidder }));
            } else {
              setter(subbid);
            }
          }}
          className="mb-2 flex justify-between items-center hover:cursor-pointer hover:bg-[whitesmoke] rounded-lg hover:shadow-sm px-2"
        >
          <div className="flex  ">
            <div className=" flex items-center">
              <div className=" mr-4 bg-ashShade-0 rounded-full">
                {image === '' || loaderror ? (
                  <TbBuildingSkyscraper size={32} className="m-2" />
                ) : (
                  <img
                    loading="lazy"
                    decoding="async"
                    className="w-10 h-10  rounded-full object-cover "
                    src={image}
                    onError={() => setLoaderror(true)}
                    alt="img"
                  />
                )}
              </div>
              <span className="text-sm mr-2 text-[#222B34] truncate">
                {details?.name || details?.firstName || ''}
              </span>
              {details?.isVerified?.account && <BsPatchCheckFill color={'green'} size={14} />}
            </div>
          </div>
          <span
            className={` ${
              !subbid._id
                ? ' bg-submission-0 text-yellow-500'
                : hasDeclined()
                  ? 'font-semibold bg-red-500 text-white'
                  : 'bg-submission-1 text-green-500 font-semibold'
            }  py-1 px-2 rounded-full text-xs`}
          >
            {!subbid._id ? 'Awaiting submission' : hasDeclined() ? 'Declined' : 'Submitted'}
          </span>
        </div>
      </div>
    </>
  );
};

export default BidDocument;
