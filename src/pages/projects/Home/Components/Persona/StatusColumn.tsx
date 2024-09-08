import React, { useEffect, useRef, useState } from 'react';
import { Row } from '@tanstack/react-table';
import { flexer, hoverFade } from 'constants/globalStyles';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import {
  TbDotsVertical,
  TbLockAccess,
  TbLockCancel,
  TbLockCheck,
  TbLockPause
} from 'react-icons/tb';
import { Persona } from 'types';
import useFetch from 'Hooks/useFetch';
import { UserRoles } from 'Hooks/useRole';
import CompanyNameEdit from './CompanyNameEdit';
import {
  DisableManager,
  ResumeDisabledManager,
  ResumeSuspendedManager,
  SuspendManager,
  ResumeDisabledDeveloper,
  SuspendDeveloper,
  ResumeSuspendedDeveloper,
  DisableDeveloper
} from 'apis/user';
import { useAppDispatch } from 'store/hooks';
import { updateProjectManager } from 'store/slices/projectManagerSlice';
import { updateDeveloper } from 'store/slices/developerSlice';

const UserMap = {
  developer: [
    DisableDeveloper,
    ResumeDisabledDeveloper,
    SuspendDeveloper,
    ResumeSuspendedDeveloper
  ],
  projectManager: [DisableManager, ResumeDisabledManager, SuspendManager, ResumeSuspendedManager]
};

type UserMapKey = keyof { developer: () => Promise<any>[]; projectManager: () => Promise<any>[] };

const StatusColumn = ({ row, UserRole }: { row: Row<Persona>; UserRole: UserRoles }) => {
  const dispatch = useAppDispatch();
  const [showMenu, setMenu] = useState(false);
  const container = useRef<HTMLDivElement>(null);
  const uniqueClassName = `${row.original.rolename}Persona${row.original._id}`;
  const {
    load: loadStatus,
    isLoading: isStatusLoading,
    successResponse: statusResponse
  } = useFetch<Persona>({
    onSuccess: () => {
      if (statusResponse)
        dispatch(
          UserRole === UserRoles.Developer
            ? updateDeveloper(statusResponse)
            : updateProjectManager(statusResponse)
        );
    }
  });
  const {
    load: loadSuspense,
    isLoading: isSuspenseLoading,
    successResponse: suspenseResponse
  } = useFetch<Persona>({
    onSuccess: () => {
      if (suspenseResponse) {
        dispatch(
          UserRole === UserRoles.Developer
            ? updateDeveloper(suspenseResponse)
            : updateProjectManager(suspenseResponse)
        );
      }
    }
  });

  useEffect(() => {
    // click event that's in-charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (
        e.target &&
        (e.target.contains(container.current) || !e.target.classList.contains(uniqueClassName))
      ) {
        setMenu(false);
      }
    });

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setMenu(false);
      });
    };
  }, [uniqueClassName]);

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  const handleDisable = () => {
    let list = UserMap[UserRole as UserMapKey];
    loadStatus(row.original.disabled ? list[1](row.original._id) : list[0](row.original._id));
  };

  const handleSuspend = () => {
    let list = UserMap[UserRole as UserMapKey];
    loadSuspense(row.original.suspended ? list[3](row.original._id) : list[2](row.original._id));
  };

  return (
    <div
      className={'relative min-w-10/12 w-11/12 gap-5' + flexer + uniqueClassName}
      ref={container}>
      <p
        className={`${
          !row.original.status
            ? 'text-black'
            : !row.original.disabled && !row.original.suspended
              ? 'text-bgreen-0'
              : 'text-bred'
        } text-bash font-Medium capitalize ${uniqueClassName}`}>
        {row.original.status || 'Not set'}
      </p>
      <TbDotsVertical
        onClick={toggleMenu}
        className={'text-bash text-base p-1' + hoverFade + uniqueClassName}
      />
      <div
        className={`absolute z-10 shadow p-2 w-fit rounded-md border bg-white ${
          !showMenu && 'hidden'
        } top-full right-0 flex flex-col ${uniqueClassName}`}>
        {UserRole === UserRoles.ProjectManager && (
          <CompanyNameEdit
            {...{ uniqueClassName }}
            defaultValue={row.original.companyName}
            userId={row.original._id}
          />
        )}
        <button
          onClick={handleSuspend}
          className={'flex gap-2 w-full p-2 rounded-md group hover:bg-bbg ' + uniqueClassName}>
          {isSuspenseLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-bash group-hover:text-black text-sm" />
          ) : row.original.suspended ? (
            <TbLockAccess className={'text-bash group-hover:text-black ' + uniqueClassName} />
          ) : (
            <TbLockPause className={'text-bash group-hover:text-black ' + uniqueClassName} />
          )}
          <p className={'text-sm text-bash ml-1 group-hover:text-black ' + uniqueClassName}>
            {row.original.suspended ? 'Restore' : 'Suspend'}
          </p>
        </button>
        <button
          onClick={handleDisable}
          className={'flex gap-2 w-full p-2 rounded-md group hover:bg-bbg ' + uniqueClassName}>
          {isStatusLoading ? (
            <AiOutlineLoading3Quarters className="animate-spin text-bash group-hover:text-black text-sm" />
          ) : row.original.disabled ? (
            <TbLockCheck className={'text-bash group-hover:text-black ' + uniqueClassName} />
          ) : (
            <TbLockCancel className={'text-bash group-hover:text-black ' + uniqueClassName} />
          )}
          <p className={'text-sm text-bash ml-1 group-hover:text-black ' + uniqueClassName}>
            {row.original.disabled ? 'Enable' : 'Disable'}
          </p>
        </button>
      </div>
    </div>
  );
};

export default StatusColumn;
