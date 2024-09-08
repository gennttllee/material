import Button from 'components/shared/Button';
import InputField from 'components/shared/InputField';
import SelectField from 'components/shared/SelectField';
import SuperModal from 'components/shared/SuperModal';
import { StoreContext } from 'context';
import React, { useContext, useMemo, useRef } from 'react';
import { TbCheck, TbChevronDown, TbChevronRight, TbSearch } from 'react-icons/tb';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setModal } from 'store/slices/contractorProfileSlice';
import { GrFormClose } from 'react-icons/gr';
import { useClickOutSideComponent } from './OnScreen';
import { updateChatGroup } from 'store/slices/chatsSlice';
import { MESSAGING_REST } from 'apis/postForm';
import axios from 'axios';
import { cleanError, displayError, displaySuccess } from 'Utils';

interface AddToGroupModalProps {
  closer: () => void;
  value?: string;
}

type Selected = { id: string; name: string };

const AddToGroupModal = ({ closer, value }: AddToGroupModalProps) => {
  const [loading, setLoading] = React.useState(false);
  let chats = useAppSelector((m) => m.chats);
  let dispatch = useAppDispatch();
  let { selectedProject } = useContext(StoreContext);

  let team = useAppSelector((m) => m.team);

  let details = useMemo(() => {
    let user = team.data[chats.selection.id || ''];
    let group = chats.groups.groups[value || ''];
    return { user, group };
  }, []);

  const handleMemberUpdate = async () => {
    setLoading(true);
    let token = localStorage.getItem('token');
    let list = [{  userId: details.user._id }];
    try {
      let res = await axios({
        method: 'patch',
        url: MESSAGING_REST + '/group/add-members',
        data: {
          groupId: details.group._id,
          members: list
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(updateChatGroup(res.data.data));
      displaySuccess('Group member(s) added successfully');
      closer();
    } catch (error: any) {
      displayError(cleanError(error));
    }
    setLoading(false);
  };

  return (
    <SuperModal classes="  bg-black bg-opacity-30 " closer={closer}>
      <div className="w-full h-full flex flex-col items-center">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" w-4/5 lg:w-1/2 xl:w-1/3 bg-white p-6 rounded-md mt-32 max-w-[516px] h-auto ">
          <div className="w-full justify-between  flex items-center">
            <span className=" text-xl text-bblack-1 font-semibold">Add to Group</span>
            <span onClick={closer} className=" text-bash text-sm cursor-pointer">
              Close
            </span>
          </div>
          <p className="mt-6 text-bblack-0 text-center font-semibold ">
            {`You are about to add "${details.user?.name}" to the group “${details.group.name}”`}
          </p>

          <div className="w-full flex justify-center mt-8">
            <Button
              textStyle=" !text-bblack-1"
              className=" !border-ashShade-4"
              type="plain"
              onClick={closer}
              text="Cancel"
            />
            <Button
              className=" ml-2"
              type={value ? 'primary' : 'muted'}
              isLoading={loading}
              onClick={handleMemberUpdate}
              text="Confirm"
            />
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default AddToGroupModal;
