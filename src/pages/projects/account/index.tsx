import React from 'react';
import Layout from 'pages/projects/Home/Layout';
import { NavLink, Outlet, useLocation } from 'react-router-dom';
import { centered, hoverFade } from '../../../constants/globalStyles';

function AccountSettings() {
  const { pathname } = useLocation();
  const links = [
    { label: 'Personal info', path: 'personal-info' },
    { label: 'Security', path: 'security' },
    { label: 'Preference', path: 'preferences' }
    // { label: "Team", path: "manage/team" },
  ];

  const Page = () => (
    <div className="h-full mt-6">
      <h1 className="font-semibold text-2xl text-black">Account Settings</h1>
      <div className="flex items-center my-6 border-b-2 border-ashShade-4 w-full">
        {React.Children.toArray(
          links.map(({ label, path }) => (
            <div className={centered + 'relative mr-4'}>
              <NavLink
                className={({ isActive }) =>
                  `text-base mb-2 font-Medium ${
                    isActive ? 'text-blue-500  capitalize ' : 'text-bash'
                  } ` + hoverFade
                }
                to={`/projects/account/${path}`}>
                {label}
              </NavLink>
              {pathname.includes(path) ? (
                <div className="bg-blue-500 h-[3px] w-2/5 absolute -bottom-[2px]" />
              ) : null}
            </div>
          ))
        )}
      </div>
      <div className="flex flex-1 w-full mt-6">
        <Outlet />
      </div>
    </div>
  );

  return (
    <Layout>
      <Page />
    </Layout>
  );
}

export default AccountSettings;
