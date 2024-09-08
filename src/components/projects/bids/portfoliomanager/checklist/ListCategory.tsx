import { useState, useRef, useEffect } from 'react';
import { postForm } from '../../../../../apis/postForm';
import { Checklist } from './types';
import Loader from '../../../../../components/shared/Loader';
import { displayError, displaySuccess } from 'Utils';
import { BiRefresh } from 'react-icons/bi';
import { MdClose } from 'react-icons/md';
import ListItem from './ListItem';
import { TbListCheck } from 'react-icons/tb';

interface Prop {
  checklist: Checklist;
  refresh: () => void;
  setter: any;
  index: number;
  list: Checklist[];
}

const ListCategory = ({ checklist, refresh, index, setter, list }: Prop) => {
  const [myChecklist, setMyChecklist] = useState<Checklist>(checklist);
  const [modal, setModal] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  let inputRef = useRef<any>();
  const removeChecklist = async () => {
    setFetching(true);
    let { response, e } = await postForm('delete', `checklists/${checklist._id}`);
    if (response) {
      let all = list.slice();
      all.splice(index, 1);
      setter(all);
      displaySuccess('Checklist removed successfully');
    } else {
      displayError(e.message);
    }

    setFetching(false);
  };
  const getChecklists = async () => {
    setFetching(true);
    let { response, e } = await postForm('get', `checklists/${checklist._id}`, {});
    setFetching(false);
  };
  useEffect(() => {
    getChecklists();
  }, []);

  const addItem = async () => {
    setFetching(true);
    let { response, e } = await postForm('patch', `checklists/${checklist._id}/add-item`, {
      name: inputRef.current.value,
      status: false
    });

    if (response) {
      displaySuccess('Item added Successfully');
      let checklist = { ...myChecklist };
      checklist.items = response.data.data[0].items;
      setMyChecklist(checklist);
    } else if (e) {
      displayError('Could not add checklist item');
    }
    setModal(false);
    setFetching(false);
  };

  return (
    <>
      {modal ? (
        <div className="absolute w-screen h-screen pt-20 bg-black bg-opacity-90 top-0 z-40 left-0 flex items-start justify-center">
          <div className=" w-11/12 sm:w-4/5 lg:w-2/5 max-w-[500px] bg-white rounded-lg p-6">
            <div className="flex mb-7 justify-between items-center">
              <span className=" text-bblack-0 font-Medium">Add Checklist item </span>
              <span
                onClick={() => {
                  setModal(false);
                }}
                className=" text-sm text-bash font-Medium cursor-pointer hover:underline ">
                Close
              </span>
            </div>
            <p className="text-bash font-Medium text-sm mb-2">Title</p>
            <input
              ref={inputRef}
              className="py-2 w-full placeholder-ashShade-4 font-Medium  px-4 mb-6 border border-bash rounded-lg"
              placeholder="e.g Architectural Drawing"
              type="text"
            />
            <button
              onClick={() => {
                addItem();
              }}
              className="w-full flex rounded-lg py-2 text-white bg-bblue justify-center text-center cursor-pointer">
              {fetching ? <Loader /> : <span>Add item</span>}
            </button>
          </div>
        </div>
      ) : null}
      <div
        onMouseOver={() => setShowDelete(true)}
        onMouseLeave={() => setShowDelete(false)}
        className="w-full lg:w-[49%] relative">
        <div className=" mb-2  rounded-lg p-6 bg-white">
          <span
            onClick={() => removeChecklist()}
            className="p-3 absolute -top-2 -right-2 hover:bg-red-200 rounded-full">
            {!fetching ? (
              <MdClose color={showDelete ? 'grey' : ''} className="hover:text-white" />
            ) : (
              <Loader />
            )}
          </span>

          <div className="flex  mb-6 justify-between items-center">
            <span className=" font-semibold">{checklist.title}</span>
            <span
              onClick={() => {
                setModal(true);
              }}
              className=" text-bblue cursor-pointer font-Medium hover:underline ">
              + Add new item to checklist
            </span>
          </div>
          {myChecklist.items.length > 0 ? (
            myChecklist.items.map((m, i, arr) => (
              <ListItem
                label={m.name}
                setter={setMyChecklist}
                index={i}
                state={arr}
                value={m.status}
                checklist={myChecklist}
                refresh={refresh}
              />
            ))
          ) : (
            <div className="w-full flex items-center justify-center p-3">
              <div className="flex flex-col items-center">
                <TbListCheck size={32} color="#9099A8" />
                <span className="text-bash">No items created yet</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ListCategory;
