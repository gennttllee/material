import { useState, useEffect } from 'react';
import { displayError, displayInfo, displaySuccess } from 'Utils';
import { postForm } from '../../../../../apis/postForm';
import ContractorCard from './ContractorCard';
import Loader, { LoaderX } from '../../../../shared/Loader';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { clearContractors } from '../../../../../store/slices/contractorSlice';
import { toggle } from '../../../../../store/slices/profileSlice';
import { convertToProper } from '../../../../shared/utils';
import NewContractorCard from './NewContractorCard';
import { refreshBid } from 'store/slices/bidslice';
import { useNavigate, useLocation } from 'react-router-dom';

const Index = () => {
  let { pathname } = useLocation();
  let navigate = useNavigate();
  let dispatch = useAppDispatch();
  let profile = useAppSelector((m) => m.profilepage);
  const [allcontractors, setAllcontractors] = useState([]);
  const [fetching, setFetching] = useState(true);
  const { contractor: selectedContractors, bid } = useAppSelector((s) => s);
  const [focused, setFocused] = useState(false);
  const [filtered, setFiltered] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const filter = () => {
    let results = allcontractors.filter((m: any) =>
      (m.name && m.name.toLowerCase().includes(search.toLowerCase())) ||
      m.email.toLowerCase().includes(search.toLowerCase())
        ? true
        : false
    );
    setFiltered((prev) => results);
  };
  useEffect(() => {
    filter();
    // eslint-disable-next-line
  }, [search]);

  const call = async () => {
    setFetching(true);
    let { e, response } = await postForm('get', `professionals/${bid?.type}/filter/all`, {}, 'iam');
    if (response) {
      setAllcontractors(response.data.data);
      setFiltered(response.data.data);
    } else {
      displayError(e);
    }
    setFetching(false);
  };
  useEffect(() => {
    call();
    // eslint-disable-next-line
  }, []);
  const handleFocus = () => {
    call();
    setFocused(true);
  };
  const handleBlur = () => {
    setTimeout(() => {
      setFocused(false);
    }, 220);
  };
  const sendInvite = async (contractorId: string) => {
    let { response, e } = await postForm('patch', `bids/${bid._id}/invites`, {
      bidder: contractorId
    });

    return { response, e };
  };

  const sendAllInvites = async () => {
    setSubmitting(true);
    let allPromises = [];
    if (selectedContractors.length > 0) {
      for (let i = 0; i < selectedContractors.length; i++) {
        allPromises.push(sendInvite(selectedContractors[i]._id));
      }
    } else {
      displayInfo('No new contractor has been added');
    }
    if (allPromises.length > 0) {
      let result = await Promise.allSettled(allPromises);
      let count = 0,
        error = 0;
      for (let i = 0; i < result.length; i++) {
        if (result[i]) {
          count++;
        } else {
          error++;
        }
      }

      displaySuccess(
        `${count} Contractor invites sent successfully ${
          error > 0 ? `but Could not send ${error} contractor invites` : ''
        }`
      );
      dispatch(clearContractors());
      await dispatch(refreshBid(bid._id));
      let path = pathname.split('/');
      path.pop();
      if (bid?.schedule?.start) {
        navigate(path.join('/') + '/process/ongoing');
      } else {
        navigate(path.join('/') + '/process');
      }
    }
    setSubmitting(false);
  };
  return (
    <div>
      <div className="p-6 bg-white rounded-lg lg:w-1/2 w-full">
        <p className="mb-4">Invite {convertToProper(bid?.type)}</p>
        <div className="flex justify-between w-full border border-bash px-2 py-4 rounded-lg">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onFocus={handleFocus}
            onBlur={handleBlur}
            className="focus:outline-none text-bash border-0"
            placeholder={`${convertToProper(bid.type)} name`}
            type="text"
          />
          <span
            onClick={() => {
              dispatch(toggle());
            }}
            className="hover:underline cursor-pointer "
          >
            Browse profiles
          </span>
        </div>
        <div className="w-full my-6 overflow-y-auto max-h-[332px]">
          {focused ? (
            <>
              {fetching ? (
                <div className="flex rounded-lg py-10  bg-ashShade-2 bg-opacity-25 items-center justify-center w-full">
                  <LoaderX color="blue" />
                </div>
              ) : filtered.length > 0 ? (
                <div className="">
                  <div className="max-h-[50%] overflow-y-auto">
                    {filtered.map((m: any) => (
                      <ContractorCard self={m} islist />
                    ))}
                  </div>
                </div>
              ) : (
                <p className="text-center text-sm">No profile matches your search input</p>
              )}
            </>
          ) : (
            <>
              {selectedContractors.map((m: any) => (
                <ContractorCard self={m} />
              ))}
            </>
          )}
        </div>
        {!focused && (
          <>
            {selectedContractors.length > 0 ? (
              <button
                onClick={() => {
                  sendAllInvites();
                }}
                className="w-full p-4 rounded-lg mb-4 text-white bg-bblue"
              >
                {submitting ? (
                  <div className="w-full flex justify-center items-center">
                    <LoaderX />
                  </div>
                ) : (
                  'Submit'
                )}
              </button>
            ) : (
              <p className="text-center w-full text-sm">
                No {convertToProper(bid?.type)} Selected Yet
              </p>
            )}
          </>
        )}
        <hr className="bg-bash mt-4" />
        {bid?.invites?.length > 0 ? (
          <div className="mt-4 bg-white rounded-lg w-full">
            <p>Added {convertToProper(bid.type) + '(s)'}</p>
            {bid.invites.map((m: any) => (
              <NewContractorCard self={m} />
            ))}
          </div>
        ) : null}
      </div>
    </div>
  );
};

export default Index;
