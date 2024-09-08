import React, { useState, useEffect, useContext } from 'react';
import { Image } from 'components/shared/Image';
import { GrFormClose } from 'react-icons/gr';
import { FaChevronDown, FaChevronUp } from 'react-icons/fa';
import { StoreContext } from 'context';
import useContractorDetails from 'Hooks/useContractorDetails';
import { postForm } from 'apis/postForm';
import { convertToProper } from 'components/shared/utils';
import SimpleImage from './SimpleImage';
import { LoaderX } from 'components/shared/Loader';
import { useAppSelector } from 'store/hooks';
import { Guest } from './ScheduleView';

export type List = {
  role: string;
  name?: string;
  id?: string;
  _id: string;
  userId?: string;
};
export const isProfessional = (role: string) => ['contractor', 'consultant'].includes(role);
interface Props {
  list: ({ role: string; _id: string; id: string; name?: string } | { [key: string]: any })[];
  setValue: any;
  initialValue?: List[];
}

const MemberList = ({ list, setValue, initialValue }: Props) => {
  const { data, selectedProjectIndex } = useContext(StoreContext);
  const [memberlist, setMemberList] = useState<List[]>([]);
  const [selected, setSelected] = useState<List[]>([]);
  const [selecting, setSelecting] = useState(false);
  let team = useAppSelector((m) => m.team);

  const init = async () => {
    let newList: any[] = [];
    let ids: string[] = [];
    let fastList: any[] = [...list];

    if (initialValue) {
      let list: Guest[] = [];
      for (let m of initialValue) {
        let id: string = m?.userId || 'x';
        if (team.data[id]) {
          list.push(team.data[id] as Guest);
        }
      }
      fastList = [...list, ...fastList];
    }

    for (let i = 0; i < fastList.length; i++) {
      if (ids.includes(fastList[i]._id)) {
        continue;
      }
      if (fastList[i].name) {
        ids.push(fastList[i]._id as string);
        newList.push({
          ...fastList[i],
          userId: fastList[i]._id,
          id: fastList[i]._id
        });
        // continue;
      }
    }

    if (initialValue) {
      let mList = [...newList];
      setSelected((_) => mList.slice(0, initialValue.length));
      setMemberList((_) => mList.slice(initialValue.length));
    } else {
      setMemberList((_) => newList);
    }
  };
  useEffect(() => {
    init();
  }, [team]);

  const handleRemoval = (idx: number) => {
    let item: List = [...selected][idx];
    let newArray = [...memberlist];
    newArray.push(item);
    setSelected((_) => [...selected].filter((m) => m._id !== item._id));
    setMemberList((_) => newArray);
  };

  const handleAdd = (idx: number) => {
    let item = [...memberlist][idx];
    let newArray = [...selected];
    newArray.push(item);
    setSelected((_) => newArray);
    setMemberList((_) => memberlist.filter((m) => m._id !== item._id));
  };
  useEffect(() => {
    if (selected.length > 0) {
      setValue('guests', selected);
    }
  }, [selected]);
  return (
    <div
      onClick={() => setSelecting(false)}
      onBlur={() => setSelecting(false)}
      className="w-full rounded-md "
    >
      <label className="font-Medium text-bash text-sm" htmlFor="list">
        Add Guests
      </label>
      <div className="relative  rounded-md">
        <div
          onClick={(e) => {
            e.stopPropagation();
            setSelecting(!selecting);
          }}
          className="flex p-4 border border-bash mb-4 mt-2 rounded-md w-full items-center justify-between"
        >
          Select guest{' '}
          {selecting ? (
            <FaChevronUp className=" text-ashShade-4" />
          ) : (
            <FaChevronDown className=" text-ashShade-4" />
          )}{' '}
        </div>
        {selecting && (
          <div className="absolute w-full max-h-52 overflow-y-auto scrollbar shadow-lg rounded-md top-4 z-20 bg-white left-0">
            {memberlist.map((m, i) => (
              <div
                key={m.id}
                onClick={(e) => {
                  e.stopPropagation();
                  handleAdd(i);
                  setSelecting(false);
                }}
                className="hover:cursor-pointer hover:bg-projectBg p-4"
              >
                {m?.name}
              </div>
            ))}
          </div>
        )}
      </div>

      {
        <div className="flex items-center overflow-x-scroll w-full mt-1">
          {selected.map((m, i) => (
            <UserCard {...m} details={m} key={m.id} handleRemove={handleRemoval} idx={i} />
          ))}
        </div>
      }
    </div>
  );
};

const UserCard = ({
  userId,
  role,
  name,
  id,
  details,
  handleRemove,
  idx
}: List & {
  handleRemove: any;
  idx: number;
  details: {
    [key: string]: any;
  };
}) => {
  //let { image, details } = useContractorDetails(id || userId || "", role);
  const [initials, setInitials] = useState('');
  const getUserDetails = async () => {
    if (!['contractor', 'consultant'].includes(role)) {
      let nameSplit = name?.split(' ') || '';
      setInitials(details.initials);
    }
  };
  useEffect(() => {
    getUserDetails();
  }, []);
  return (
    <div className="relative mr-4">
      {details.logo ? (
        <div className="w-14 h-14 overflow-hidden">
          <SimpleImage
            className="w-14 h-14 object-cover shadow-inner bg-white rounded-full overflow-hidden border-2"
            url={details?.logo}
          />
        </div>
      ) : (
        <div className=" w-14 h-14 bg-bblue flex justify-center items-center text-white rounded-full">
          <span className=" text-3xl">{details?.initials}</span>
        </div>
      )}
      <div
        onClick={() => handleRemove(idx)}
        className="absolute top-0 right-0  bg-ashShade-3 hover:bg-ashShade-4 border-2 border-white rounded-full cursor-pointer"
      >
        <GrFormClose />
      </div>
    </div>
  );
};

export { UserCard };

export default MemberList;
