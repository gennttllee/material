import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { ListProps } from './ChatGroups';
import SimpleImage from './SimpleImage';
import { LoaderX } from 'components/shared/Loader';
import moment from 'moment';
import { centered } from 'constants/globalStyles';
import { StoreContext } from 'context';
import { truncateText } from 'components/shared/utils';
import { MESSAGING_REST } from 'apis/postForm';
import axios from 'axios';
import { updateChatGroup } from 'store/slices/chatsSlice';
import { cleanError, displayError, displaySuccess } from 'Utils';
import { setChatModal } from 'store/slices/chatModalSlice';
import { useClickOutSideComponent } from './OnScreen';

function GroupMemberList({ closer }: { closer: () => void }) {
  let chat = useAppSelector((m) => m.chats);
  let members = useMemo(() => {
    let group = chat.groups['groups'][chat.selection.id || ''];
    return group.members.map((m) => ({ userId: m.userId, role: m.role }));
  }, [chat.groups]);
  let dispatch = useAppDispatch();

  let ref = useRef<any>();

  useClickOutSideComponent(ref, closer);

  const removeMember = (member: { userId: string; role: string }) => async () => {
    let token = localStorage.getItem('token');
    let _member = { userId: member.userId };
    try {
      let res = await axios({
        method: 'patch',
        url: MESSAGING_REST + '/group/remove-members',
        data: {
          groupId: chat.selection.id,
          members: [_member]
        },
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      dispatch(updateChatGroup(res.data.data));
      displaySuccess('Group member removed successfully');
    } catch (error: any) {
      displayError(cleanError(error));
    }
  };
  const addNewMember = () => {
    dispatch(setChatModal({ isOpen: true, modalName: 'addGroupMemebersModal' }));
  };
  return (
    <div
      ref={ref}
      className="bg-white absolute shadow-bnkle top-16 right-10 w-[350px] z-50 rounded-md p-4">
      <p className="pb-4 border-b border-b-ashShade-0 font-semibold text-sm">Group Members</p>
      <div className=" h-36 overflow-y-auto">
        {members.map((m) => (
          <Contact key={m.userId} id={m.userId} onClick={removeMember(m)} />
        ))}
      </div>
      <div
        onClick={addNewMember}
        className="w-full mt-2 cursor-pointer py-1.5 text-center  text-bblue font-semibold rounded-md border border-bblue">
        Add New Member
      </div>
    </div>
  );
}

interface ContactProps {
  id: string;
  onClick: () => Promise<void>;
}

export const Contact = ({ id, onClick }: ContactProps) => {
  let [image, setImage] = useState('');

  let { selectedProjectIndex, selectedData } = useContext(StoreContext);
  const [initials, setInitials] = useState('');
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState('');
  let chat = useAppSelector((m) => m.chats);
  let user = useAppSelector((m) => m.user);
  let team = useAppSelector((m) => m.team);
  const [deleting, setDeleting] = useState(false);

  const getUserDetails = async () => {
    setLoading(true);
    let details = team.data[id];
    setImage(details?.logo || '');
    setNames(details?.name || '');
    setInitials(details?.initials || '');
    setLoading(false);
  };
  useEffect(() => {
    getUserDetails();
  }, [chat]);

  const handleClick = async () => {
    setDeleting(true);
    await onClick();
    setDeleting(false);
  };

  return (
    <div
      className={` hover:bg-lightblue rounded-md p-2 cursor-pointer w-full flex justify-between items-center text-black  ${
        !(image || names || initials) ? '' : ''
      } `}>
      {image ? (
        <SimpleImage
          className={
            'w-6 h-6 object-cover shadow-inner rounded-full overflow-hidden border border-ashShade-0 '
          }
          url={image}
        />
      ) : (
        <div
          className={
            ' w-6 h-6 text-white bg-redShade-1 rounded-full flex items-center justify-center border-2 border-bash '
          }>
          {loading ? <LoaderX /> : <p className=" text-sm">{initials}</p>}
        </div>
      )}
      <div className="flex-1 ml-2 flex justify-between items-center ">
        <span className=" text-sm font-semibold">{truncateText(names, 25)}</span>
        {deleting ? (
          <LoaderX color="blue" />
        ) : (
          <span onClick={handleClick} className="hover:text-bred text-sm text-bash">
            Remove
          </span>
        )}
      </div>
    </div>
  );
};

export default GroupMemberList;
