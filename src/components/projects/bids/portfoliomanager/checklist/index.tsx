import { useState, useRef, useEffect } from 'react';
import { postForm } from '../../../../../apis/postForm';
import { Checklist } from './types';
import Loader from '../../../../shared/Loader';
import ListCategory from './ListCategory';
import { FaPlus } from 'react-icons/fa';
import { AiOutlineClose } from 'react-icons/ai';
import { displayError, displaySuccess } from 'Utils';
import None from 'components/shared/none';
import SuperModal from 'components/shared/SuperModal';
import CheckListModal from './CheckListModal';

interface Prop {
  project: string;
  bidId?: string;
  loading?: boolean;
}

const Index = ({ project, bidId, loading }: Prop) => {
  const [fetching, setFetching] = useState(true);
  const [modal, setModal] = useState(false);
  const inputRef = useRef<any>();
  const [creating, setCreating] = useState(false);
  const [checklists, setChecklists] = useState<Checklist[]>([]);
  const [filteredChecklist, setFilteredChecklist] = useState<Checklist[]>([]);

  useEffect(() => {
    setFilteredChecklist((prev) => checklists.filter((m) => m.bidId === bidId));
  }, [bidId]);

  const createChecklists = async (name: string) => {
    setCreating(true);
    let { response, e } = await postForm('post', 'checklists/add', {
      type: 'bids',
      projectId: project,
      title: name,
      bidId: bidId
    });
    if (response) {
      displaySuccess('Checklist created');

      setFilteredChecklist((prevState) => [...prevState, response.data.data]);
      setModal(false);
    } else {
      displayError("couldn't create checklist");
    }

    setCreating(false);
  };

  const getChecklists = async () => {
    setFetching(true);
    let { response, e } = await postForm('get', `checklists/project/${project}`, {});

    if (response) {
      setChecklists((prev) => response.data.data);
      setFilteredChecklist((prev) =>
        response.data.data.filter((m: Checklist) => m.bidId === bidId)
      );
    } else {
      displayError(
        e.status === 404 ? 'No checklists found for this project. Please create one' : e.message
      );
    }
    setFetching(false);
  };

  useEffect(() => {
    getChecklists();
  }, []);

  return (
    <div
      className={`flex flex-wrap  flex-col lg:flex-row   ${
        !fetching ? 'justify-between' : 'justify-center '
      }`}
    >
      <span
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="  top-1/2 lg:top-1/3 right-10 text-white font-semibold cursor-pointer shadow-gray-700 rounded-lg "
      >
        {modal ? (
          <CheckListModal closer={setModal} fetching={creating} creatorFn={createChecklists} />
        ) : null}
      </span>

      {fetching ? (
        <div className="w-full flex justify-center items-center flex-1 p-20 bg-ashShade-3">
          <Loader color="blue" />
        </div>
      ) : filteredChecklist.length > 0 ? (
        filteredChecklist.map((m, i, arr) => (
          <ListCategory
            key={i}
            index={i}
            setter={setFilteredChecklist}
            list={arr}
            checklist={m}
            refresh={getChecklists}
          />
        ))
      ) : (
        <None
          title="No Checklist Item Created"
          subtitle="No document checklist items havebeen created yet"
          buttonLabel="+ Create Item"
          onClick={() => setModal(true)}
        />
      )}
    </div>
  );
};

export default Index;
