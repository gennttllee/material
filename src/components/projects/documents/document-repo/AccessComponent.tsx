// import { FetchImage } from 'components/shared/FetchImage';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import Button from 'components/shared/Button';
import { FetchImage } from 'components/shared/FetchImage';
import InputField from 'components/shared/InputField';
import SuperModal from 'components/shared/SuperModal';
import { Option } from 'pages/projects/Clusters/BuildingTypes';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TbCheck, TbChevronDown, TbChevronLeft, TbChevronRight, TbLock } from 'react-icons/tb';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { prototypeImage } from 'types';
import { UserComponent } from './UserComponent';
import Team from 'components/projects/Team';
import { postForm } from 'apis/postForm';
import useFiles from './useFiles';
import { StoreContext } from 'context';
import { displayError } from 'Utils';
import { LoaderX } from 'components/shared/Loader';
import { Access, FileFolder } from '../types';
import { LatestDoc, NewDoc } from './SingleDocModal';
import { addFileFolders, updateFile, updateFolder } from 'store/slices/folderSlice';
import { removeemptyFields } from 'pages/projectform/utils';

interface Props {
  closer: () => void;
  title?: string;
  onGrantUserAccess?: (user: Record<string, any>) => Promise<void>;
  onRemoveUserAccess?: (user: Record<string, any>) => Promise<void>;
  onToggleGeneralAccess?: () => Promise<void>;
  selectedUsers: string[];
  Members: Record<string, any>[];
  ownerId?: string;
  isDisplay?: boolean;
  MemberAccessList?: Access[];
  onChangeAccessType?: (_user: Record<string, any>, x: string) => Promise<void> | void;
  onChangeRole?: (_user: Record<string, any>, x: string) => Promise<void> | void;
  roleOptions?: string[];
  accessTypeOptions?: string[];
}

const subs: { [key: string | _Access['status']]: string } = {
  'Restrict access': 'No one can access this folder',
  'Allow access': 'Everyone can access this folder'
};

type _Access = {
  status: 'Restrict access' | 'Allow access';
  access?: 'Editor' | 'Viewer';
};

const AccessComponent = ({
  closer,
  title,
  onGrantUserAccess,
  onRemoveUserAccess,
  onToggleGeneralAccess,
  Members,
  selectedUsers,
  ownerId,
  isDisplay,
  MemberAccessList,
  onChangeAccessType,
  onChangeRole,
  roleOptions,
  accessTypeOptions
}: Props) => {
  let { data, loading } = useAppSelector((m) => m.team);

  const [changingAccess, setChangingAccess] = useState(false);
  let dispatch = useAppDispatch();
  const [access, setAccess] = useState<_Access>({
    status: 'Restrict access',
    access: 'Viewer'
  });
  const [showAccess, setShowAccess] = useState(false);
  const [showTypeOption, setShowTypeOption] = useState(false);
  const [value, setValue] = useState('');
  const [focused, setFocused] = useState(false);
  const team = useAppSelector((m) => m.team);

  const accessRef = useRef<any>();
  const typeRef = useRef<any>();
  useClickOutSideComponent(accessRef, () => {
    setShowAccess(false);
  });
  useClickOutSideComponent(typeRef, () => {
    setShowTypeOption(false);
  });

  let teamRef = useRef<any>();
  useClickOutSideComponent(teamRef, () => {
    setFocused(false);
  });
  useEffect(() => {
    setAccess({
      ...access,
      status: selectedUsers.length < 2 ? 'Restrict access' : 'Allow access'
    });
  }, [selectedUsers]);
  const viewers = useMemo(() => {
    let _members = selectedUsers.length > Members.length ? Object.values(team.data) : Members;
    const _viewers = _members?.filter((m) => selectedUsers?.includes(m?._id));
    let _viewerIds = _viewers.map((m) => m?._id);
    let unAddedMembers = Members?.filter(
      (m) => m && m?.role.toLowerCase() !== 'general' && !_viewerIds?.includes(m?._id)
    );

    unAddedMembers = unAddedMembers?.filter((m) => {
      let val = value?.toLowerCase();
      let name = m?.mame?.toLowerCase();
      let email = m?.email?.toLowerCase();
      return (email && email?.includes(val)) || (name && name?.includes(val));
    });

    return {
      _viewers,
      unAddedMembers
    };
  }, [Members, value]);

  const handleGeneralAcess = async () => {
    setChangingAccess(true);
    if (onToggleGeneralAccess) {
      await onToggleGeneralAccess();
    }
    setChangingAccess(false);
  };

  const handleAdd = async () => {
    if (value) {
      let _user = Members.find((m) => m?.email === value) as Record<string, any>;

      setChangingAccess(true);
      if (onGrantUserAccess) {
        await onGrantUserAccess(_user);
        setValue('');
      }

      setChangingAccess(false);
    }
  };

  const getUserAccess = (id: string) => {
    return MemberAccessList?.find((m) => m.userId === id);
  };

  return (
    <SuperModal closer={closer} classes=" bg-black bg-opacity-60 ">
      <div className="w-full h-full flex justify-center gap-x-3 md:gap-x-8  sm:px-12">
        <div className=" h-full w-full flex flex-col items-center  ">
          <div
            onClick={(e) => {
              e.stopPropagation();
            }}
            className=" bg-white max-h-[calc(100vh-100px)]   flex flex-col rounded-md lg:w-1/2 mt-20  max-w-[500px] p-6 sm:px-10 ">
            <div className=" flex items-center justify-between">
              <p className="  text-bblack-1 font-bold text-xl ">{title}</p>
              <span
                onClick={closer}
                className=" text-bash font-semibold text-xs p-1 cursor-pointer">
                Close
              </span>
            </div>

            <p className=" font-semibold text-bblack-1 mt-6   ">People with Access</p>
            {
              <div>
                <div className="flex gap-x-2  mt-6 items-end">
                  <span className=" flex-1 relative">
                    <InputField
                      onFocus={() => {
                        setFocused(true);
                      }}
                      onChange={(e) => {
                        setValue(e.target.value);
                      }}
                      label="Email address"
                      className=""
                      ContainerClassName=" !my-0 "
                      placeholder="eg johndoe@gmail.com "
                      value={value}
                    />
                    {focused && (
                      <div
                        ref={teamRef}
                        className=" z-20 bg-white absolute w-full rounded-md top-20 gap-y-2 shadow-bnkle border-bash border  h-40 overflow-y-auto">
                        {viewers.unAddedMembers.map((m) => (
                          <div
                            className=" hover:bg-lightblue py-2 pl-6 rounded-md"
                            onClick={() => {
                              setValue(m.email ?? '');
                              setFocused(false);
                            }}>
                            <UserComponent
                              email={m?.email || ''}
                              name={m?.name || ''}
                              url={m?.logo || ''}
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </span>
                  <span
                    onClick={handleAdd}
                    className="  p-2 border cursor-pointer rounded-md border-black ">
                    {changingAccess ? <LoaderX color="blue" /> : 'Add User'}
                  </span>
                </div>
              </div>
            }
            <div className=" w-full flex-1 flex flex-col   rounded-md ">
              <div className=" w-full space-y-6 max-h-[35vh] scrollbar-thin   overflow-y-auto  mt-6 rounded-md ">
                {viewers._viewers.map((m) => (
                  <UserComponent
                    AccessValue={getUserAccess(m._id)}
                    email={m?.email}
                    name={m?.name}
                    url={m?.logo}
                    onChangeAccessType={async (x: string) => {
                      if (onChangeAccessType) await onChangeAccessType(m, x);
                    }}
                    onChangeRole={async (x: string) => {
                      if (onChangeRole) await onChangeRole(m, x);
                    }}
                    roleOptions={roleOptions}
                    accessTypeOptions={accessTypeOptions}
                    role={'Owner'}
                    showRole={m._id === ownerId}
                    showDelete={isDisplay ? false : m._id !== ownerId}
                    onDelete={() => {
                      if (onRemoveUserAccess) {
                        onRemoveUserAccess(m);
                      }
                    }}
                  />
                ))}
              </div>

              <p className=" mt-8 font-semibold mb-6 text-bblack-1 ">General Access</p>
              <div className=" w-full  h-16 mt-6 rounded-md ">
                <div className=" flex items-center justify-between  ">
                  <span className=" flex items-center ">
                    <span
                      className={` rounded-full h-8 w-8 ${
                        access.status === 'Restrict access' ? ' bg-redShades-2 ' : ' bg-bgreen-0'
                      } flex items-center justify-center`}>
                      {access.status === 'Restrict access' ? (
                        <TbLock color="white" />
                      ) : (
                        <TbCheck color="white" />
                      )}
                    </span>
                    <div className=" ml-2.5 z-10  relative ">
                      <div
                        onClick={() => {
                          setShowAccess(!showAccess);
                        }}
                        className=" flex cursor-pointer relative  items-center  font-semibold text-sm">
                        {access.status} <TbChevronDown size={20} className=" ml-2" />
                      </div>
                      {showAccess && (
                        <span
                          ref={accessRef}
                          className="absolute cursor-pointer top-7 z-[100] flex flex-col left-4 bg-white shadow-bnkle p-2 rounded-md gap-y-1">
                          {['Restrict access', 'Allow access'].map((m) => (
                            <span
                              onClick={(e) => {
                                e.stopPropagation();
                                if (access.status !== m) handleGeneralAcess();
                                setShowAccess(false);
                              }}
                              className={`p-2 text-xs font-semibold whitespace-nowrap ${
                                access.status !== m ? 'hover:bg-lightblue' : 'hover:bg-ashShade-0'
                              }   rounded-md`}>
                              {m}
                            </span>
                          ))}
                        </span>
                      )}
                      <p className=" text-bash text-xs">{subs[access.status]}</p>
                    </div>
                  </span>
                  <span className=" relative ">{changingAccess && <LoaderX color="blue" />}</span>
                </div>
              </div>
            </div>

            <span className=" w-full mt-8 justify-end flex">
              <Button onClick={closer} className=" px-4 py-1.5" text="Done" type="primary" />
            </span>
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default AccessComponent;
