import useClusters from 'Hooks/useClusters';
import MemberCard from 'components/projects/Team/Views/Components/MemberCard';
import NoContent from 'components/projects/photos/NoContent';
import Button from 'components/shared/Button';
import { LoaderX } from 'components/shared/Loader';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { TbChevronDown, TbFolderPlus, TbPlus, TbSearch } from 'react-icons/tb';
import { useParams } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import ClusterMemberCard from './ClusterMemberCard';
import AddClusterMemberModal from './AddClusterMemberModal';
import { IconType } from 'react-icons';
import useRole from 'Hooks/useRole';

const ClusterMembers = () => {
  let inputRef = useRef<any>();
  const [userAction, setUserAction] = useState<any>({});
  let { getClusters } = useClusters(true);
  let { data, loading: teamLoading } = useAppSelector((m) => m.team);
  let { data: _clusters, loading: clusterLoading } = useAppSelector((m) => m.cluster);
  const [modal, setModal] = useState(false);
  let { id } = useParams();
  const current = useMemo(() => {
    return _clusters.find((m) => m._id === id);
  }, [id, _clusters]);
  let { isProfessional, canDeleteCluster } = useRole();

  useEffect(() => {
    if (!clusterLoading && _clusters.length < 1) {
      getClusters();
    }
  }, []);
  const toggleModal = () => {
    setModal(!modal);
  };

  return (
    <div className=" flex flex-col flex-1 overflow-y-auto">
      {modal && (
        <AddClusterMemberModal
          userAction={userAction}
          closer={() => {
            setModal(false);
            setUserAction(undefined);
          }}
        />
      )}
      <div className=" flex w-full items-center justify-between ">
        <span
          onClick={() => inputRef?.current?.focus()}
          className="items-center rounded-md p-2 hover:border-bblue hover:border bg-white flex">
          <TbSearch color="#9099A8" className="mr-4 " />
          <input ref={inputRef} type="text" placeholder="Search" className=" px-2 outline-none" />
        </span>

        {canDeleteCluster && (
          <Button
            onClick={() => setModal(true)}
            className=" border-bblue"
            type="plain"
            textStyle=" text-bblue"
            LeftIcon={<TbPlus color="#437ADB" className="ml-2" />}
            text="Add ClusterMember"
          />
        )}
      </div>
      <div className="  flex-1 items-center justify-center mt-10">
        {current?.team && current?.team?.length > 0 ? (
          teamLoading ? (
            <div className="w-full p-10">
              <LoaderX />
            </div>
          ) : (
            <div className=" w-full grid grid-cols-3 gap-4">
              {current.team.map((m) => (
                <ClusterMemberCard
                  toggleModal={toggleModal}
                  handleAction={(x: any) => setUserAction(x)}
                  {...m}
                  key={m._id}
                />
              ))}
            </div>
          )
        ) : (
          <NoContent
            title="No Members Added"
            subtitle="There are no members added to this cluster yet."
          />
        )}
      </div>
    </div>
  );
};

export default ClusterMembers;
