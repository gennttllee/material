import { flexer, hoverFade } from 'constants/globalStyles';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { useContext, useState } from 'react';
import { StoreContext } from 'context';
import { postForm } from 'apis/postForm';
import { useEffect } from 'react';
import { addMember, clear } from 'store/slices/teamSlice';
import NewMemberBtn from './Views/Components/NewMemberBtn';
import { LoaderX } from 'components/shared/Loader';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import React, { useMemo } from 'react';
import Button from 'components/shared/Button';
import { useAllProjectPending } from './Views/Components/UsePending';
import { ChatNotification } from './Views/Components/ChatGroups';

export default function Team() {
  return (
    <Meet>
      <_Team />
    </Meet>
  );
}

export function _Team() {
  const { data, selectedProjectIndex } = useContext(StoreContext);
  let [showing, setShowing, editing, setEditing] = React.useContext(MeetingContext);
  let team = useAppSelector((m) => m.team);
  const [loading, setLoading] = useState(true);
  let dispatch = useAppDispatch();
  let { pathname } = useLocation();

  let tab = useMemo(() => {
    let paths = pathname.split('/');
    return paths[paths.length - 1];
  }, [pathname]);
  useEffect(() => {
    checkForTeams();
  }, [team]);

  const checkForTeams = () => {
    if (!loading) setLoading(true);
    if (Object.keys(team).length === 0) {
      fetchAllTeamMemberDetails();
    } else {
      setLoading(false);
    }
  };

  const fetchAllTeamMemberDetails = async () => {
    setLoading(true);
    const projectId = data[selectedProjectIndex]._id;
    const members = data[selectedProjectIndex].team;
    const isProfessional = (s: string) => ['contractor', 'consultant'].includes(s);

    await Promise.all(
      members.map(async (m) => {
        let prof = isProfessional(m.role || '');
        dispatch(
          addMember({
            role: 'general',
            id: projectId,
            _id: projectId,
            name: 'General'
          })
        );
        const { response } = await postForm(
          'get',
          `users/user-and-professional/${m.id}`,
          {},
          `iam`
        );
        if (response) {
          const data = response.data.data;
          if (!isProfessional(data.rolename)) {
            data.name = `${data?.firstName + ' ' + data?.lastName}`;
          }
          const nameSplit = (data?.firstName + ' ' + data?.lastName)?.split(' ') || '';
          data.initials = isProfessional(data.rolename)
            ? data.name.slice(0, 2)
            : `${nameSplit[0]?.toUpperCase()[0]}${nameSplit[1]?.toUpperCase()[0]}`;

          data.prole = m.role;
          data.logo =
            isProfessional(data.rolename) && data?.businessInformation?.logo
              ? 'https://bnkle-iam-images.s3.eu-west-1.amazonaws.com/' +
                data?.businessInformation?.logo
              : data.logo;
          dispatch(addMember(data));
        }
      })
    );
    setLoading(false);
  };
  let pending = useAllProjectPending();
  return (
    <div className=" w-full h-full flex flex-col ">
      <div className={flexer}>
        <h1 className="text-2xl font-Medium">Communication</h1>
        {tab !== 'meetings' ? (
          <NewMemberBtn />
        ) : (
          <Button
            onClick={() => {
              setShowing('schedule');
              setEditing(false);
            }}
            text="Schedule meeting"
          />
        )}
      </div>
      <div className="flex w-full items-center mt-2 mb-8 gap-x-4  border-b border-b-ashShade-4">
        <NavLink
          className={({ isActive }) =>
            ` ${isActive && 'text-blue-500 border-b-2 border-b-bblue'} pb-2 text-base ${hoverFade}`
          }
          to={`/projects/${data[selectedProjectIndex]._id}/communication/team`}>
          Team
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            ` ${
              isActive && 'text-blue-500 border-b-2 relative border-b-bblue'
            } pb-2 text-base mx-4 ${hoverFade}`
          }
          to={`/projects/${data[selectedProjectIndex]._id}/communication/chats`}>
          <span className="relative">
            Chats
            {pending > 0 && ChatNotification(pending, ' absolute top-0')}
          </span>
        </NavLink>

        <NavLink
          className={({ isActive }) =>
            ` ${isActive && 'text-blue-500 border-b-2 border-b-bblue'} pb-2 text-base  ${hoverFade}`
          }
          to={`/projects/${data[selectedProjectIndex]._id}/communication/meetings`}>
          Meetings
        </NavLink>
      </div>
      <div className="flex-1 overflow-y-auto">
        <Boundary Element={Outlet} loading={loading} />
      </div>
    </div>
  );
}

interface Prop {
  Element: React.FC;
  loading: boolean;
}

export const MeetingContext = React.createContext<[undefined | null | string, any, any, any]>([
  undefined,
  undefined,
  undefined,
  undefined
]);

export const TeamContext = React.createContext<any>(true);

const Meet = ({ children }: { children: React.ReactElement }) => {
  const [showing, setShowing] = useState<undefined | null | string>(undefined);
  const [editing, setEditing] = useState<undefined | null | string>(undefined);
  return (
    <MeetingContext.Provider value={[showing, setShowing, editing, setEditing]}>
      {children}
    </MeetingContext.Provider>
  );
};

const Boundary = ({ Element, loading }: Prop) => {
  let isloading = useMemo(() => loading, [loading]);
  return (
    <TeamContext.Provider value={isloading}>
      <Element />
    </TeamContext.Provider>
  );
};
