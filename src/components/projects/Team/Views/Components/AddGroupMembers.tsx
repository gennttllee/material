import Button from 'components/shared/Button';
import InputField from 'components/shared/InputField';
import SelectField from 'components/shared/SelectField';
import SuperModal from 'components/shared/SuperModal';
import { StoreContext } from 'context';
import React, { MouseEvent, useContext, useEffect, useMemo, useRef } from 'react';
import { TbCheck, TbChevronDown, TbChevronRight, TbSearch } from 'react-icons/tb';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setModal } from 'store/slices/contractorProfileSlice';
import { GrFormClose } from 'react-icons/gr';
import { useClickOutSideComponent } from './OnScreen';
import { chats, updateChatGroup } from 'store/slices/chatsSlice';
import axios from 'axios';
import { MESSAGING_REST } from 'apis/postForm';
import { cleanError, displayError, displaySuccess } from 'Utils';

interface AddGroupMembersProps {
  closer: () => void;
}

type Selected = { id: string; name: string };

const AddGroupMembers = ({ closer }: AddGroupMembersProps) => {
  const [loading, setLoading] = React.useState(false);
  const [selection, setSelection] = React.useState<Selected[]>([]);
  const [filter, setFilter] = React.useState('');
  const [showList, setShowList] = React.useState(false);
  let optionsRef = useRef<any>();
  let { selectedProject } = useContext(StoreContext);

  let team = useAppSelector((m) => m.team);
  let chat = useAppSelector((m) => m.chats);
  let dispatch = useAppDispatch();
  useClickOutSideComponent(optionsRef, () => {
    if (showList !== false) {
      setShowList(false);
    }
  });

  let _team = useMemo(() => {
    let list: Selected[] = [];
    let keys = Object.keys(team.data);
    for (let key of keys) {
      if (key.toLowerCase() !== selectedProject._id)
        list.push({ id: key, name: team.data[key]?.name });
    }

    let groupMembers = chat['groups'].groups[chat.selection.id || ''].members;
    let memberIds = groupMembers.map((m) => m.userId);
    list = list.filter((m) => !memberIds.includes(m.id));

    return list;
  }, [team]);

  let filtered = useMemo(() => {
    return _team.filter((m) => m.name.toLowerCase().includes(filter.toLowerCase()));
  }, [filter, team]);
  const create = () => {};

  const display = useMemo(() => {}, []);

  const toggleSelection = (value: Selected) => () => {
    let selects = [...selection];
    let ids = selects.map((m) => m.id);
    if (ids.includes(value.id)) {
      selects = selects.filter((m) => m.id !== value.id);
    } else {
      selects.push(value);
    }
    setSelection(selects);
  };
  const toggleList = (event: any) => {
    setShowList(!showList);
  };
  const handleMemberUpdate = async () => {
    setLoading(true);
    let token = localStorage.getItem('token');
    let list = selection.map((m) => {
      let user: { userId?: string; id?: string; role?: string; name?: string } = { ...m };
      user.userId = user.id;
      // user.role = team.data[user.userId || '']?.rolename;

      delete user.id;
      delete user.name;

      return user;
    });
    try {
      let res = await axios({
        method: 'patch',
        url: MESSAGING_REST + '/group/add-members',
        data: {
          groupId: chat.selection.id,
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
            <span className=" text-xl text-bblack-1 font-semibold ">Add group members</span>
            <span onClick={closer} className=" text-bash text-sm cursor-pointer">
              Close
            </span>
          </div>
          <div className="flex flex-wrap mt-4">
            {selection.map((m) => {
              return (
                <span className="flex items-center m-1 px-2 py-1 bg-ashShade-0 rounded-md">
                  <span className=" items-center flex flex-wrap">{m.name}</span>

                  <span onClick={toggleSelection(m)}>
                    <GrFormClose className=" text-bash ml-2" color="#9099A8" />
                  </span>
                </span>
              );
            })}
          </div>
          <div className="w-full relative rounded-md">
            {
              <div ref={optionsRef} className=" bg-white  px-4 w-full z-10 ">
                <InputField
                  value={filter}
                  className="ml-4"
                  LeftIconProp={<TbSearch />}
                  label=""
                  onChange={(x) => {
                    setFilter(x.target.value);
                  }}
                  placeholder="Search"
                />
                <div className="w-full h-52 overflow-y-auto scrollbar">
                  {filtered.map((m) => (
                    <div
                      onClick={toggleSelection(m)}
                      className=" w-full hover:bg-lightblue hover:text-blueShades-0 cursor-pointer rounded-md flex py-2 px-2 items-center ">
                      <span
                        className={`w-4 h-4 border flex items-center justify-center ${
                          selection.includes(m)
                            ? ' border-bblue bg-bblue '
                            : 'bg-white border-ashShade-2'
                        } rounded`}>
                        <TbCheck color="white" size={12} />
                      </span>
                      <span className="ml-2.5">{m.name}</span>
                    </div>
                  ))}
                </div>
                <div className="w-full flex justify-end py-4">
                  <Button
                    disabled={loading}
                    textStyle=" !text-bblack-1"
                    className=" !border-ashShade-4 "
                    type="plain"
                    onClick={closer}
                    text="Cancel"
                  />
                  <Button
                    disabled={loading}
                    className=" ml-2"
                    isLoading={loading}
                    onClick={handleMemberUpdate}
                    text="Done"
                  />
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default AddGroupMembers;
