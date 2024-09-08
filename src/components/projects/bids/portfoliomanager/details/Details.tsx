import { useEffect, useState } from 'react';
import { useAppSelector } from '../../../../../store/hooks';
import { BsChevronRight } from 'react-icons/bs';
import {
  useNavigate,
  useLocation,
  Routes,
  Route,
  Navigate,
  Outlet,
  useParams
} from 'react-router-dom';
import { tabs } from '../constants';
import Tab from '../TabComponent';
import { convertToProper } from '../../../../shared/utils';
import { AiOutlineCheckCircle } from 'react-icons/ai';
import ProfilePage from '../../portfoliomanager/profiles';
import useRole from 'Hooks/useRole';

export default function Details() {
  const { projectId } = useParams();
  const setChecklist = useState(false)[1];
  const role = localStorage.getItem('role');
  let { bid, profilepage, user } = useAppSelector((m) => m);
  let navigate = useNavigate();
  let { canSeeSnapshot } = useRole();
  useEffect(() => {
    if (!bid._id) {
      navigate(`/projects/${projectId}/bid`);
    }
    //eslint-disable-next-line
  }, [bid]);

  let { pathname } = useLocation();
  const isActive = (check: string) => {
    let paths = pathname.split('/');
    return paths.includes(check);
  };
  return profilepage && canSeeSnapshot ? (
    <ProfilePage />
  ) : (
    <div className="w-full h-full">
      <div className="flex bg-projectBg sticky top-0 z-20 items-center pb-2  text-sm cursor-pointer">
        <span
          onClick={() => navigate(`/projects/${projectId}/bid`)}
          className="text-borange mr-2 flex  items-center">
          Bid <BsChevronRight className="text-borange ml-2" />{' '}
        </span>
        <span className="text-bash ">{bid?.name}</span>
      </div>
      {bid?.winningBid?.status === 'answered' ? (
        <div className="w-full flex flex-col xmd:flex-row items-center justify-between px-6 py-2 my-6 rounded-lg bg-lightblue">
          <span className="flex items-center text-blueShades-0">
            <AiOutlineCheckCircle size={24} color="#365EAF" />
            <span className="mx-2 flex items-center font-bold">UP NEXT</span>
            Provide additional documents
          </span>
          <button className="rounded-lg mt-3 xmd:mt-0 bg-bblue text-white px-8 py-2">
            Upload Additional Documents
          </button>
        </div>
      ) : null}
      <p className="my-6 text-2xl font-semibold">{bid?.name}</p>
      <div
        className={`flex  items-center justify-between ${
          role === 'projectOwner' ? 'border-b-0' : 'border-b mb-10'
        } pb-0 border-b-ashShade-4`}>
        <div className="flex items-center">
          {canSeeSnapshot
            ? tabs.map((m, i) => (
                <Tab
                  closeChecklist={() => setChecklist(false)}
                  key={i}
                  label={m.name === 'Invite' ? `${m.name} ${convertToProper(bid.type)}` : m.name}
                  details={m}
                  active={isActive(m.route)}
                  route={m.route}
                />
              ))
            : null}
        </div>
        {role === 'portfolioManager' ? (
          <span
            onClick={() => navigate(`/projects/${projectId}/bid/details/checklist`)}
            className="text-bblue  cursor-pointer hover:underline">
            Document Checklist
          </span>
        ) : null}
      </div>
      <div>
        <Outlet />
      </div>
    </div>
  );
}
