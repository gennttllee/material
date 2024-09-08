import React, { useContext, useMemo, useEffect } from 'react';
import MemberCard from './Components/MemberCard';
import { StoreContext } from 'context';
import { UserRoles } from 'Hooks/useRole';
import { useAppSelector } from 'store/hooks';
import { TeamContext } from '..';
import { LoaderX } from 'components/shared/Loader';

export type Member = {
  role: UserRoles;
  name?: string;
  _id: string;
  id: string;
};

export default function Members() {
  const { data, selectedProjectIndex } = useContext(StoreContext);
  const loading = useContext(TeamContext);
  const team = useAppSelector((m) => m.team);
  const members = useMemo(() => {
    return Object.keys(team.data).filter((m) => m !== data[selectedProjectIndex]._id);
  }, [team, loading]);
  return (
    <>
      {loading || team.loading ? (
        <div className="w-full pt-10  flex items-center justify-center">
          <LoaderX color="blue" />
        </div>
      ) : members[0] && loading === false ? (
        <div className="w-full grid lg:grid-cols-3 xl:grid-cols-4 md:grid-cols-3 grid-cols-1 gap-5  ">
          {React.Children.toArray(members.map((member) => <MemberCard member={member} />))}
        </div>
      ) : (
        <p className="w-full text-center ">No Team Member has been added to this Project yet</p>
      )}
    </>
  );
}
