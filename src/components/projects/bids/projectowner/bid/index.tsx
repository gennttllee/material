import { useState, useEffect, useContext } from 'react';
import BidCard from './BidCard';
import nocontent from '../../../../../assets/nocontent.svg';
import { useAppSelector, useAppDispatch } from '../../../../../store/hooks';
import { postForm } from '../../../../../apis/postForm';
import SuperModal from '../../../../shared/SuperModal';
import Loader, { LoaderX } from '../../../../shared/Loader';
import { displayError, displaySuccess } from 'Utils';
import BidType from './BidType';
import GhostBids from './GhostBids';
import { switchBid } from 'store/slices/bidslice';
import { useNavigate, useParams } from 'react-router-dom';
import { StoreContext } from 'context';
import { _canSeeSnapshot } from 'pages/projects/Home/Components/Snapshot';
import useRole from 'Hooks/useRole';

const Index = () => {
  const { projectId } = useParams();
  let { canSeeSnapshot } = useRole();
  const { data, selectedProjectIndex } = useContext(StoreContext);
  const project = data[selectedProjectIndex]._id;
  let navigate = useNavigate();
  let dispatch = useAppDispatch();
  const [bids, setBids] = useState<any>([]);
  const [fetching, setFetching] = useState(false);
  const [modal, setModal] = useState(false);
  const [bidOptions, setBidOptions] = useState({
    name: '',
    type: '',
    description: ''
  });
  const [errors, setErrors] = useState(false);
  const [fields, setFields] = useState({
    description: '',
    name: '',
    type: ''
  });
  const generateErrors = () => {
    let name =
      bidOptions.name === ''
        ? 'bid name cannot be empty'
        : bidOptions.name.length < 3
          ? 'bid name cannot be less than 3 characters'
          : '';

    let description = bidOptions.description === '' ? 'bid description cannot be empty' : '';

    let type = bidOptions.type === '' ? 'bid name cannot be empty' : '';

    setFields({ name, description, type });
  };
  useEffect(() => {
    generateErrors();
    // eslint-disable-next-line
  }, [bidOptions]);
  const postBids = async () => {
    if (fields.name === '' && fields.type === '' && fields.description === '') {
      setFetching(true);
      let { response, e } = await postForm('post', 'bids', {
        projectId: project,
        type: bidOptions.type,
        name: bidOptions.name,
        description: bidOptions.description
      });
      if (response) {
        displaySuccess('Bid Created Successfully');
        updateOptions('clear');
        setBids((_: any) => [response.data.data, ...bids]);
        dispatch(switchBid(response.data.data));
        navigate(`/projects/${projectId}/bid/details/uploads`);
        setErrors(false);
        setModal(false);
      } else {
        displayError(e.message || e.error);
      }
      setFetching(false);
    } else {
      setErrors(true);
      setFetching(false);
    }
  };

  const updateOptions = (field: string, value?: string) => {
    let options: any = { ...bidOptions };
    if (field === 'clear') {
      setBidOptions({ name: '', type: '', description: '' });
    } else {
      options[field] = value;
      setBidOptions(options);
    }
  };

  let types = [
    { label: 'Contractor Bid', value: 'contractor' },
    { label: 'Consultant Bid', value: 'consultant' }
  ];

  let { user, profilepage } = useAppSelector((m) => m);
  const getBids = async () => {
    setFetching(true);
    let { response } = await postForm('get', `bids/project/${data[selectedProjectIndex]._id}`);
    if (response && response.data.data) {
      setBids(response.data.data.reverse());
    } else {
      setBids([]);
    }
    setFetching(false);
  };
  useEffect(() => {
    getBids();
    // eslint-disable-next-line
  }, [selectedProjectIndex]);

  return (
    <div className="w-full h-full ">
      {modal ? (
        <SuperModal
          classes="bg-black bg-opacity-80 flex overflow-y-auto justify-center items-center"
          closer={() => setModal(!modal)}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white flex  flex-col items center w-4/5 sm:w-3/5 lg:w-2/5 p-10 rounded-lg">
            <div className="w-full flex justify-between font-semibold ">
              <span className=" text-bblack-0 text-lg">Create Bid</span>
              <span
                onClick={() => {
                  setBidOptions({ name: '', type: '', description: '' });
                  setErrors(false);
                  setModal(false);
                }}
                className="text-sm cursor-pointer hover:underline hover:text-borange font-semibold text-bash">
                Close
              </span>
            </div>
            <label htmlFor="" className="mt-6 text-bash font-semibold">
              Title
              <input
                name="bidname"
                onChange={(e) => updateOptions('name', e.target.value)}
                className="w-full mt-2 px-4 py-3 border text-bblack-0 border-bblue rounded-lg outline-bblue"
                type="text"
                value={bidOptions.name}
                placeholder="e.g Foundation Bid"
              />
            </label>
            {fields.name && errors && <span className=" text-bred">{fields.name}</span>}
            <label htmlFor="description" className="mt-6 text-bash font-semibold">
              <div className="flex items-center justify-between">
                <span className="text-bash">Bid Description</span>
                <span
                  className={
                    bidOptions.description.length > 0 ? 'text-green-700' : 'text-redShades-0'
                  }>
                  {bidOptions.description.length}/160
                </span>
              </div>

              <textarea
                maxLength={160}
                name="bidname"
                onChange={(e) => updateOptions('description', e.target.value)}
                className="w-full mt-2 h-26 px-4  py-3 border text-bblack-0 border-bblue rounded-lg outline-bblue"
                value={bidOptions.description}
                placeholder="Details of the bid..."
              />
            </label>
            {fields.description && errors && (
              <span className=" text-bred">{fields.description}</span>
            )}

            <div className="mt-6">
              <p className="text-bash font-semibold">What type of bid do you want to create</p>
              <div className="mb-4 w-full flex items-center ">
                {types.map((m) => (
                  <BidType
                    label={m.label}
                    value={m.value}
                    selected={bidOptions.type === m.value}
                    setter={(val) => updateOptions('type', val)}
                  />
                ))}
              </div>
              {fields.type && errors && <span className=" text-bred">{fields.description}</span>}
            </div>

            <button
              onClick={async () => {
                postBids();
              }}
              className="bg-bblue p-3 rounded-lg flex items-center justify-center text-white w-full self-center">
              {fetching ? <LoaderX /> : 'Create Bid'}
            </button>
          </div>
        </SuperModal>
      ) : null}
      <div className="flex items-center justify-between">
        <p className="mt-9 lg:mt-3 mb-8 font-bold text-2xl">Bid</p>
        {bids.length > 0 && canSeeSnapshot ? (
          <button
            onClick={() => setModal(true)}
            className="py-2 rounded-lg bg-bblue px-6 mt-8 text-white">
            + Create Bid
          </button>
        ) : null}
      </div>

      {fetching ? (
        <GhostBids />
      ) : !fetching && bids.length > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 auto-rows-min xl:grid-cols-3 my-2 w-full gap-5 ">
            {bids.map((m: any, i: number) => (
              <BidCard key={i} ibid={m} index={i} bids={bids} setter={setBids} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="w-full h-full flex flex-col items-center">
            <img loading="lazy" decoding="async" src={nocontent} alt="" className="w-64" />
            <p className="font-semibold mt-6 mb-2 text-2xl text-bblack-0">No Bid Created</p>
            <p className=" text-ashShade-1 text-center">
              As soon as a bid has been submitted, you would see the bid documents here
            </p>
            {canSeeSnapshot ? (
              <button
                onClick={() => setModal(true)}
                className="py-2 rounded-lg bg-bblue px-6 mt-8 text-white">
                + Create Bid
              </button>
            ) : null}
          </div>
        </>
      )}
    </div>
  );
};

//Are sentiments apartments decisively the especially alteration. Thrown shy denote ten ladies though ask saw. Or by to he going think order event music. Incommode so intention defective at convinced. Led income months itself and houses you. After nor you leave might share court

export default Index;
