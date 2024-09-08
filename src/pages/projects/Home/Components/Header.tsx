import { Image } from 'components/shared/Image';
import { NavLink, useLocation } from 'react-router-dom';
import betalogo from 'assets/betalogo.png';
import React, { useContext, useMemo } from 'react';
import AccountMenu from './ActionMenu';
import { TbSearch } from 'react-icons/tb';
import { StoreContext } from 'context';
import useRole, { UserRoles } from 'Hooks/useRole';
import { IoIosClose } from 'react-icons/io';
import { hoverFade } from 'constants/globalStyles';
import { Controller, useForm } from 'react-hook-form';

const paths = [
  'home',
  'all',
  'prototypes',
  'calculator',
  'referrals',
  'notifications'
  // "tutorials"
] as const;

export type Path = (typeof paths)[number];

interface Props {
  pathname?: Path;
  hideNavs?: boolean;
  hideSearch?: boolean;
}

export default function Header({ pathname, hideNavs, hideSearch }: Props) {
  const { isOfType } = useRole();
  const { handleContext, searchQuery } = useContext(StoreContext);
  const location = useLocation();
  const { control } = useForm<{ searchQuery: string }>({
    defaultValues: { searchQuery }
  });

  let showNavs = useMemo(() => {
    let split = location.pathname.split('/');
    if (split[split.length - 1] === 'create') {
      return false;
    }
    return true;
  }, [location]);

  const conditionalPaths = useMemo(() => {
    if (isOfType(UserRoles.Contractor)) {
      return paths.filter((path) => !['prototypes'].includes(path));
    } else {
      return paths;
    }
  }, [isOfType]);

  return (
    <nav className={`bg-white pt-6 w-full ${showNavs ? '' : ' border-b border-b-ashShade-3'} `}>
      <header className="flex w-full justify-between items-center px-2  sm:px-12 lg:px-24 xl:px-40 2xl:px-0 2xl:max-w-[1440px] max-w-[calc(100%)] sm:mx-auto">
        <Image src={betalogo} className="transform -translate-y-2 w-16 sm:w-20" />
        <ul
          className={` ${` !data || !data[0] ? "hidden" : ""`} hidden lg:flex items-center mt-auto`}>
          {!hideNavs &&
            React.Children.toArray(
              conditionalPaths
                .filter((m) => m != 'notifications')
                .map((path, index) => (
                  <NavLink
                    className={`${index ? 'mx-3' : ' ml-4 sm:ml-16'} p-2 relative`}
                    to={
                      path !== 'calculator'
                        ? `/projects/${path}`
                        : String(process.env.REACT_APP_CALCULATOR_URL)
                    }>
                    <li
                      className={`capitalize text-lg font-Medium ${
                        pathname?.includes(path) && 'text-bblue'
                      } `}>
                      {path === 'all' ? 'Projects' : path}
                    </li>
                    <div className="my-3" />
                    <div
                      className={`absolute w-full h-1 ${
                        pathname?.includes(path) ? 'bg-bblue' : 'bg-white'
                      } bottom-0 right-0`}
                    />
                  </NavLink>
                ))
            )}
        </ul>
        <div className="mx-auto" />
        {
          <div className="flex justify-between items-center sm:items-start mb-4">
            {!hideSearch && (
              <Controller
                control={control}
                name="searchQuery"
                render={({ field: { onChange, value } }) => (
                  <div className="hidden py-1 px-1 text-sm  sm:py-3 sm:px-3 bg-pbg sm:flex items-center rounded-md sm:mr-9">
                    <TbSearch color={'#9099A8'} className=" text-base mr-3" />
                    <input
                      {...{ value }}
                      onChange={(ev) => {
                        onChange(ev.target.value);
                        handleContext('searchQuery', ev.target.value);
                      }}
                      onBlur={(ev) => {
                        onChange(ev.target.value);
                        handleContext('searchQuery', ev.target.value);
                      }}
                      placeholder="Search everything!"
                      className=" sm:flex-1 outline-none text-bash font-Medium text-base bg-transparent"
                    />
                    <button
                      className={hoverFade}
                      onClick={() => {
                        onChange('');
                        handleContext('searchQuery', '');
                      }}>
                      <IoIosClose
                        className={`text-bash text-lg  ${
                          searchQuery ? 'opacity-100' : 'opacity-0'
                        }`}
                      />
                    </button>
                  </div>
                )}
              />
            )}
            <AccountMenu />
          </div>
        }
      </header>
      <div className="flex flex-col lg:hidden justify-center items-center w-full ">
        <Controller
          control={control}
          name="searchQuery"
          render={({ field: { onChange, value } }) => (
            <div className="mx-6  mb-3 md:mb-0 sm:hidden  py-1 px-3 text-sm  sm:py-4 sm:px-5 bg-pbg flex items-center rounded-md sm:mr-9">
              <TbSearch color="#9099A8" className=" text-base mr-3" />
              <input
                {...{ value }}
                onChange={(ev) => {
                  onChange(ev.target.value);
                  handleContext('searchQuery', ev.target.value);
                }}
                onBlur={(ev) => {
                  onChange(ev.target.value);
                  handleContext('searchQuery', ev.target.value);
                }}
                placeholder="Search everything!"
                className=" sm:flex-1 outline-none text-bash font-Medium text-base bg-transparent"
              />
              <button
                className={hoverFade}
                onClick={() => {
                  onChange('');
                  handleContext('searchQuery', '');
                }}>
                <IoIosClose
                  className={`text-bash text-lg  ${searchQuery ? 'opacity-100' : 'opacity-0'}`}
                />
              </button>
            </div>
          )}
        />
        <ul
          className={` ${` !data || !data[0] ? "hidden" : ""`}  flex lg:hidden items-center mt-auto`}>
          {React.Children.toArray(
            conditionalPaths
              .filter((m) => m != 'notifications')
              .map((path, index) => (
                <NavLink
                  className={`${index ? ' mx-2 sm:mx-3' : ''} sm:p-2 relative`}
                  to={
                    path !== 'calculator'
                      ? `/projects/${path}`
                      : String(process.env.REACT_APP_CALCULATOR_URL)
                  }>
                  <li
                    className={`capitalize text-xs sm:text-lg font-Medium ${
                      pathname === path && 'text-bblue'
                    } `}>
                    {path === 'all' ? 'Projects' : path}
                  </li>
                  <div className="my-3" />
                  <div
                    className={`absolute w-full h-1 ${
                      pathname === path ? 'bg-bblue' : 'bg-white'
                    } bottom-0 right-0`}
                  />
                </NavLink>
              ))
          )}
        </ul>
      </div>
    </nav>
  );
}
