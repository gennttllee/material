import { hoverFade } from 'constants/globalStyles';
import useRole, { UserRoles } from 'Hooks/useRole';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { BsFillTriangleFill } from 'react-icons/bs';
import { FiSettings, FiUser } from 'react-icons/fi';
import { HiOutlineLogout } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { setUser } from 'store/slices/userSlice';
import notification from '../../../../assets/notification.svg';
import Notifications, { _NotificationResponse } from './Notifications';
import { FetchImage } from 'components/shared/FetchImage';
import { User } from 'types';
import { BucketNames } from '../../../../constants';

export const getInitials = (user: User) => {
  if (user.type === UserRoles.Consultant || user.type === UserRoles.Contractor) {
    let usernames = user?.name.split(' ');

    let initials = usernames ? usernames[0]?.charAt(0) : '';

    if (usernames && usernames[1]) initials += usernames[1].charAt(0).toUpperCase();
    else
      initials +=
        usernames && usernames[0]
          ? usernames[0].charAt(1).toUpperCase()
          : `${user.name[0] + user.name[0]}`.toUpperCase();

    return initials;
  } else if (user.type === UserRoles.Developer) {
    return `${user.name.split(' ')[0].charAt(0) + user.name.split(' ')[1].charAt(0)}`;
  } else {
    return `${(user.firstName || '').charAt(0) + user.lastName?.charAt(0)}`;
  }
};

export const RoleBaseLogo = ({ size, user }: { user: User; size?: string }) => {
  const { isProfessional } = useRole();

  const logo = useMemo(() => {
    if (isProfessional) return user?.businessInformation?.logo;
    return user?.logo;
  }, [isProfessional, user]);

  return logo ? (
    <div
      className={`bg-pbg border text-center ${
        size || 'w-10 h-10'
      } relative overflow-hidden p-1 flex items-center justify-center rounded-full`}>
      <FetchImage
        src={logo}
        bucketName={BucketNames[isProfessional ? 0 : 1]}
        className="w-full object-cover absolute h-ful top-0 left-0"
      />
    </div>
  ) : (
    <div className="bg-bash text-center relative flex items-center justify-center rounded-full">
      <span
        className={` ${
          size || 'w-12 h-12'
        } bg-ashShade-4 rounded-full flex items-center justify-center`}>
        <span className="text-base font-semibold uppercase text-ashShade-1">
          {getInitials(user)}
        </span>
      </span>
    </div>
  );
};

export default function AccountMenu() {
  const dispatch = useAppDispatch();
  const { isProfessional } = useRole();
  const user = useAppSelector((state) => state.user);
  const [showNotification, setShowNotification] = useState(false);
  const logout = () => {
    Promise.resolve(localStorage.clear()).then(() => {
      dispatch(setUser(undefined));
      const loginLink = '/signin';
      if (process.env.REACT_APP_IS_LOCAL === 'true') {
        window.location.replace('/');
      } else {
        window.location.replace(`${process.env.REACT_APP_AUTH_URL}/${loginLink}?action=logout`);
      }
    });
  };

  const MenuCard = (
    <div
      style={{ top: '140%', right: '20%' }}
      className="bg-white shadow-md rounded-md py-6 px-4 absolute hidden group-hover:block z-[150]">
      <BsFillTriangleFill className="text-white text-xl absolute -top-3 right-1" />
      <div className="flex items-start">
        <RoleBaseLogo {...{ user, isProfessional }} size="w-12 h-12" />
        <div className="ml-4 flex flex-col items-start">
          <strong className="font-Medium text-base truncate">
            {user.name || user.firstName + ' ' + user.lastName}
          </strong>
          <strong className="text-sm text-bash font-Medium">{user.email}</strong>
          <strong className="text-sm text-gray-300 font-Medium capitalize">
            {localStorage.getItem('role')}
          </strong>
        </div>
      </div>
      <hr className="my-4" />
      {isProfessional && (
        <a
          className={'flex items-center' + hoverFade}
          href={`${process.env.REACT_APP_AUTH_URL}?token=${localStorage.getItem('token')}`}>
          <FiUser className="text-bash mr-3" />
          <p className="font-Medium text-base text-bash">Company profile</p>
        </a>
      )}
      <div className="my-2" />
      <Link className={'flex items-center' + hoverFade} to="/projects/account">
        <FiSettings className="text-bash mr-3" />
        <p className="font-Medium text-base text-bash">Account settings</p>
      </Link>
      <hr className="my-4" />
      <div className={'flex items-center' + hoverFade} onClick={logout} id="Logout_btn">
        <p className="font-Medium text-base text-bash">Logout</p>
        <HiOutlineLogout className="text-bash ml-3" />
      </div>
      <div style={{ bottom: '85%' }} className="absolute left-0 w-full h-1/4" />
    </div>
  );

  const notices = useAppSelector((m) => m.notification);
  const unreads = useMemo(() => {
    let count = 0;
    notices.data.map((m: _NotificationResponse) => {
      m.recipients.map((m) => {
        if (!m.read && m.userId === user._id) {
          count++;
          return;
        }
      });
    });

    const icon = document.getElementsByClassName('tabicon') as unknown as any[];
    if (icon) {
      for (const i of icon) {
        i.href = count < 1 ? '/bnkleFav.ico' : '/bnkleFav2.ico';
      }
    }
    return count;
  }, [notices]);

  const handleToggle = useCallback(() => {
    setShowNotification(!showNotification);
  }, [showNotification]);

  return (
    <span className="flex items-center">
      <div className="flex items-center relative ">
        <div onClick={handleToggle} className="hover:cursor-pointer">
          {unreads > 0 && (
            <span
              // onClick={handleToggle}
              className="absolute items-center justify-center flex w-4 h-4 bg-bblue text-xxs  text-white top-0 -left-0.5  rounded-full">
              <span>{unreads > 99 ? '99+' : unreads}</span>
            </span>
          )}
          <img
            loading="lazy"
            decoding="async"
            alt="notification"
            src={notification}
            className="mr-4 w-6 "
          />
        </div>

        <Notifications
          _status={showNotification}
          toggler={(x: boolean) => setShowNotification(x)}
        />
      </div>

      <div id="Account_menu" className="group relative flex items-center justify-center ">
        <RoleBaseLogo {...{ user, isProfessional }} />
        {MenuCard}
      </div>
    </span>
  );
}
