import { useState } from 'react';
import { BsCheck2 } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import { RiDeleteBinLine } from 'react-icons/ri';
import { Checklist } from './types';
import { displayError, displaySuccess } from 'Utils';
import { postForm } from '../../../../../apis/postForm';
import Loader from '../../../../shared/Loader';
interface Prop {
  label: string;
  value?: boolean;
  setter?: any;
  index: number;
  state: any[];
  checklist: Checklist;
  refresh: () => void;
}
const ListItem = ({ label, value, checklist, refresh, setter, index, state }: Prop) => {
  const [fetching, setFetching] = useState(false);

  const removeItem = async () => {
    setFetching(true);
    let items = state.slice();
    items.splice(index, 1);
    let newChecklist = { ...checklist };
    newChecklist.items = items;
    let { response, e } = await postForm(
      'patch',
      `checklists/${checklist._id}/remove-item/${state[index]._id}`,
      {}
    );
    if (response) {
      displaySuccess('Item removed Successfully');
      setFetching(false);
      setter(newChecklist);
    } else if (e) {
      displayError('Could not remove checklist item');
      setFetching(false);
    }
  };

  const toggle = async () => {
    let lists = checklist.items.slice();
    let currentItem = lists[index];
    currentItem = { ...currentItem, status: !currentItem.status };
    lists[index] = currentItem;
    let newChecklist = { ...checklist };
    newChecklist.items = lists;
    setFetching(true);
    let { response, e } = await postForm('patch', `checklists/${checklist._id}`, { items: lists });
    if (response) {
      displaySuccess('Checklist updated Successfully');
      setFetching(false);
      setter(newChecklist);
    } else if (e) {
      displayError('Could not update checklist ');
      setFetching(false);
    }
  };
  return (
    <div className="flex w-full cursor-pointer mb-6 items-center justify-between">
      <div
        onClick={(e) => {
          toggle();
        }}
        className="flex items-center"
      >
        <span
          className={`mr-3 flex justify-center items-center border w-4 h-4 ${
            value ? 'bg-bblue border-bblue' : ''
          } border-bash`}
        >
          {value && <BsCheck2 color={'white'} size={20} />}
        </span>
        <span className={`${value ? ' line-through' : ''}  text-bash`}>{label}</span>
      </div>

      {fetching ? (
        <Loader color="blue" />
      ) : (
        <RiDeleteBinLine
          size={16}
          color={'red'}
          onClick={async () => {
            await removeItem();
          }}
        />
      )}
    </div>
  );
};

export default ListItem;
