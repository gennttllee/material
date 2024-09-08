import useRole, { UserRoles } from 'Hooks/useRole';
import React, { useState, useEffect, useContext, useCallback, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { postFormWithAbortController } from 'apis/postForm';
import { StoreContext } from 'context';
import { useAppSelector } from 'store/hooks';
import { useAllProjectPending } from './Team/Views/Components/UsePending';

interface Prop {
  active: boolean;
  image: string;
  name: string;
  path: string;
  onSelect?: any;
  collapsed?: boolean;
  closeMenu: () => void;
  unread?: number;
}

const controller = new AbortController();

const MenuItem = ({ active, image, name, unread, path, onSelect, collapsed, closeMenu }: Prop) => {
  const { selectedProject, menuProjects } = useContext(StoreContext);
  let user = useAppSelector((m) => m.user);
  const navigate = useNavigate();

  const { isProfessional, isOfType } = useRole();
  const [isVisible, setIsVisible] = useState<boolean | undefined>(undefined);

  const routesByRole = useCallback(() => {
    const routes = ['/management',"/procurement", '/communication', '/documents', '/photos', '/financials'] as const;

    // if user not a professional show all links
    if (!isProfessional || !menuProjects[0]) return routes;

    const projectId = window.location.pathname.split('/')[2];

    // if (isPartOfTheTeam) return [...routes, "/financials"];
    if (projectId) {
      // check if s/he has won a bid ( By being a part of the Team)
      const project = menuProjects.find((one) => one._id === projectId);

      if (!project) return [];

      let isPartOfTheTeam = project.team.find((member) => member.id === user._id);
      //
      if (isPartOfTheTeam) return routes;
    }

    return [] as const;
  }, [isProfessional, user, selectedProject]);

  const professionalPages = ['/bid', '/home', '/referrals', ...routesByRole()] as const;
  const bookKeeperPages = ['/home', '/referrals', '/communication', '/documents', '/photos', '/financials'];

  const checkforBids = useCallback(async () => {
    if (path.includes('bid') && selectedProject._id) {
      const { response } = await postFormWithAbortController(
        'get',
        `bids/project/${selectedProject._id}`,
        {},
        '',
        controller.signal
      );
      if (response && response.data.data.length > 0) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    }
  }, [path, selectedProject]);

  const isProffesionalPage = isProfessional && professionalPages.find((one) => path.includes(one));

  useEffect(() => {
    if (!isProfessional) checkforBids();
    return () => {
      controller.abort();
    };
  }, [checkforBids, isProfessional]);

  const [showtip, setShowtip] = useState(false);

  const roleClasses = useMemo(() => {
    const map: any = {
      consultant: ['/bid', '/home', '/referrals', ...routesByRole()],
      contractor: ['/bid', '/home', '/referrals', ...routesByRole()],
      bookKeeper: [ '/referrals', '/communication', '/documents', '/photos', '/financials']
    };

    for (let x of ['developer', 'portfolioManager', 'projectManager', 'projectOwner', 'guest']) {
      map[x] = [
        '/home',
        '/referrals',
        "/procurement",
        '/communication',
        '/documents',
        '/photos',
        '/financials',
        '/management',
        "/bid"
      ];
    }

    if (isProfessional) {
      return !isProffesionalPage ? 'hidden' : 'first-letter:';
    } else {
      let _path = path.split('/');
      return map[user.role]?.includes(`/${_path[_path.length - 1]}`) ? 'first_letter: ' : ' hidden';
    }
  }, [user, checkforBids, isVisible, path]);

  return (
    <div
      onMouseEnter={() => setShowtip(true)}
      onMouseLeave={() => setShowtip(false)}
      onClick={() => {
        closeMenu();
        if (isProfessional) {
          onSelect(false);
        }
        navigate(path);
      }}
      className={`flex   ${
        !isVisible && path === 'bid' && ['projectOwner', 'bookKeeper'].includes(user.role)
          ? 'hidden'
          : ''
      } w-full relative cursor-pointer text-sm lg:text-base ${
        active ? 'bg-lightblue' : ' hover:bg-bidsbg'
      }  ${roleClasses} `}>
      {showtip ? (
        <span
          className={` text-xs   ${
            collapsed
              ? ' absolute -top-6 left-2 z-[99]  whitespace-nowrap bg-bblack-0 text-white rounded-md p-2'
              : 'hidden'
          }`}>
          {name}
        </span>
      ) : null}

      <div className={`flex-1 flex pl-4 py-4 items-center ${collapsed ? 'justify-center' : ''} `}>
        <img loading="lazy" decoding="async" className="mr-4" src={image} alt="icon" />
        <span className={collapsed ? 'hidden' : 'truncate flex-1'}>{name}</span>
      </div>

      <div className="flex items-center justify-between">
        <span
          className={`bg-borange  ${
            !unread || unread === 0 || name !== 'Team' ? 'hidden' : ''
          } px-1.5 text-center min-w-[20px] mr-3 rounded-lg text-white text-xs`}>
          {unread && unread > 99 ? '99+' : unread}
        </span>

        {active && <span className="w-1 min-h-full inline bg-bblue"></span>}
      </div>
    </div>
  );
};

export default MenuItem;
