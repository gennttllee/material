import { useMembersDetails } from 'Hooks/useTeamMembers';
import { Team } from 'components/projects/Team/Views/Components/ChatsView';
import { LoaderX } from 'components/shared/Loader';
import { convertToProper } from 'components/shared/utils';
import React, { useRef, useState } from 'react';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { TbCheck, TbPlus, TbUser } from 'react-icons/tb';
import { RiDeleteBin6Line } from 'react-icons/ri';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import useRole from 'Hooks/useRole';

const ClusterMemberCard = (
  member: Team & { handleAction?: (x: any) => void; toggleModal?: () => void }
) => {
  const { data, error, loading } = useMembersDetails(member);
  const [options, setOptions] = useState(false);
  const [imageError, setImageError] = useState(false);
  let optionsRef = useRef<any>();
  let { isProfessional } = useRole();

  useClickOutSideComponent(optionsRef, () => setOptions(false));
  const handle = (action: string) => {
    if (member?.handleAction) {
      member.handleAction({ user: data, action });
    }
    if (member?.toggleModal) {
      member.toggleModal();
    }
  };
  return (
    <div className="w-full relative flex items-center flex-col p-4 bg-white rounded-md ">
      {loading ? (
        <div className="p-10">
          <LoaderX color="blue" />
        </div>
      ) : error ? (
        <div className=" p-10">
          <p>Cant Fetch details</p>
        </div>
      ) : (
        <>
          <div
            onClick={() => {
              setOptions(true);
            }}
            className="w-full flex justify-end ">
            <span className="p-2 rounded-full hover:bg-ashShade-0">
              <FaEllipsisVertical />
            </span>
          </div>
          {data?.logo && !imageError ? (
            <img
              onError={() => {
                setImageError(true);
              }}
              src={data?.logo}
              className=" bg-white rounded-full w-32 h-32 object-cover"
              alt=""
            />
          ) : (
            <TbUser className=" bg-bblue rounded-full " size={128} />
          )}
          <p className=" mt-4 font-semibold">{data?.name}</p>
          <p className=" mt-4 font-semibold text-bash ">{convertToProper(member?.role || '')}</p>
        </>
      )}
      <img src="" alt="" />
      {options && !isProfessional && (
        <div
          ref={optionsRef}
          className=" shadow-bnkle bg-white absolute rounded-md p-2 top-14 max-h-64 overflow-y-auto flex flex-col right-0">
          <span
            className={` p-2 cursor-pointer flex items-center rounded-md hover:bg-ashShade-0`}
            onClick={() => {
              handle('add');
            }}>
            <TbPlus className={`mr-2  `} />
            Add to Project
          </span>

          <span
            className={` p-2 cursor-pointer text-bred flex items-center rounded-md  hover:bg-redShades-1`}
            onClick={() => {
              handle('delete');
            }}>
            <RiDeleteBin6Line color="red" className={`mr-2  `} />
            Remove
          </span>
        </div>
      )}
    </div>
  );
};

export default ClusterMemberCard;
