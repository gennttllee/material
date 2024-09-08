import React, { useState, useEffect, useCallback, useMemo, useContext } from 'react';
import { centered } from 'constants/globalStyles';
import { LoaderX } from 'components/shared/Loader';
import { useAppSelector } from 'store/hooks';
import { UserRoles } from 'Hooks/useRole';
import SimpleImage from './SimpleImage';
import { StoreContext } from 'context';
import UsePending from './UsePending';
import moment from 'moment';
import { ListProps } from './ChatGroups';

export type Team = {
  id: string;
  role: string;
  _id?: string;
  name?: string;
};

interface ChatsViewProps {
  team: string[];
  selected?: number;
  setter: any;
}

const ChatsView = ({ team, setter, selected }: ChatsViewProps) => {
  const { selectedProjectIndex, data } = useContext(StoreContext);

  return (
    <div className="w-full h-full bg-white rounded-md  overflow-hidden">
      {[...team].map((m, i) => (
        <Contact
          key={m}
          id={m}
          isGeneral={m === data[selectedProjectIndex]._id}
          isFirst={false}
          isLast={i === team.length - 1}
          Onclick={() => setter((_: number) => i)}
          selected={selected === i}
        />
      ))}
    </div>
  );
};

interface ContactProps {
  name?: string;
  id: string;
  _id?: string;
  isFirst: boolean;
  isLast: boolean;
  unread?: number;
  Onclick?: any;
  selected?: boolean;
  isGeneral: boolean;
}
const Contact = ({ id, Onclick, selected, isGeneral }: ContactProps) => {
  let [image, setImage] = useState('');
  const [initials, setInitials] = useState('');
  const [loading, setLoading] = useState(false);
  const [names, setNames] = useState('');
  let chat = useAppSelector((m) => m.chats);
  let user = useAppSelector((m) => m.user);
  let team = useAppSelector((m) => m.team);

  const lastMessage = useMemo(() => {
    let listGroup = chat[chat.selection.type as ListProps['type']]?.groups[id];
    if (Array.isArray(listGroup)) {
      let mychats = listGroup;
      let lastChat = mychats[mychats.length - 1];
      return lastChat;
    }
    return null;
  }, [chat]);

  const countPending = 0;

  const getUserDetails = async () => {
    setLoading(true);
    if (isGeneral) {
      setNames('General');
      setInitials('All');
    } else {
      let details = team.data[id];
      setImage(details?.logo || '');
      setNames(details?.name || '');
      setInitials(details?.initials || '');
    }
    setLoading(false);
  };
  useEffect(() => {
    getUserDetails();
  }, []);

  return (
    <div
      onClick={() => Onclick()}
      className={` p-4 gap-x-4 cursor-pointer w-full flex items-center text-black ${
        selected ? ' bg-lightblue' : 'bg-white '
      }`}>
      {image ? (
        <SimpleImage
          className="w-14 h-14 object-cover shadow-inner rounded-full overflow-hidden border-2"
          url={image}
        />
      ) : (
        <div className=" w-14 h-14 text-white bg-redShade-1 rounded-full flex items-center justify-center border-2 border-bash ">
          {loading ? <LoaderX /> : <p className=" text-2xl">{initials}</p>}
        </div>
      )}
      <div className="flex-1">
        <div className={`w-full flex flex-col gap-y-1 justify-between`}>
          <div className=" w-full flex items-center justify-between ">
            <p className="font-semibold text-base">{names}</p>
            <p className="text-xs text-bblack-1">
              {lastMessage?.message?.createdAt
                ? moment(new Date(lastMessage?.message.createdAt)).fromNow()
                : ''}
            </p>
          </div>
          <div className=" w-full flex items-center justify-between h-full">
            <p className="font-Medium text-sm truncate w-full">
              {lastMessage ? lastMessage?.message.body.slice(0, 30) + '...' : ''}
            </p>

            {countPending > 0 && (
              <strong
                className={'text-white text-sm bg-orange-500 rounded-full w-5 h-5 mt-2' + centered}>
                {countPending}
              </strong>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatsView;
