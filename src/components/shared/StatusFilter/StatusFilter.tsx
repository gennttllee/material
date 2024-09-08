import { hoverFade } from 'constants/globalStyles';
import React, { useEffect, useRef, useState } from 'react';
import { TbSortDescending } from 'react-icons/tb';

interface Props {
  onChange: (val: string | undefined) => void;
  value: string | undefined;
  options: string[];
}

const StatusFilter = ({ value, onChange, options }: Props) => {
  const menuRef = useRef<HTMLDivElement>(null);
  const [showMenu, setMenu] = useState(false);

  useEffect(() => {
    // click event that's in-charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (e.target && e.target.contains(menuRef.current)) {
        setMenu(false);
      }
    });

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setMenu(false);
      });
    };
  }, []);

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  return (
    <div className="relative w-fit">
      <button onClick={toggleMenu} className={'flex items-center' + hoverFade}>
        <TbSortDescending
          className={`text-sm md:text-base ${value ? 'text-black' : 'text-bash'}`}
        />
        <p
          className={`text-sm md:text-base ml-1 ${
            value ? 'text-black font-Medium' : ' text-bash'
          }`}>
          {value || 'Filter'}
        </p>
      </button>
      <div
        ref={menuRef}
        className={`z-20 filter-menu ${
          !showMenu && 'hidden'
        } p-3 rounded w-fit bg-white absolute top-[120%] shadow-md border right-0`}>
        {options.map((status) => (
          <div
            className={
              `py-1 px-4 w-full group filter-menu ${
                value !== status ? 'hover:bg-blue-100' : ''
              }  rounded` + hoverFade
            }
            onClick={() => {
              onChange(status);
              toggleMenu();
            }}>
            <p
              className={`text-sm  filter-menu ${
                value === status ? 'text-bblue' : 'text-bash group-hover:text-bblue'
              } font-Medium whitespace-nowrap`}>
              {status}
            </p>
          </div>
        ))}
        <div
          className={
            `py-1 px-4 w-full ${!value ? '' : 'hover:bg-blue-100'} group filter-menu rounded` +
            hoverFade
          }
          onClick={() => {
            onChange(undefined);
            toggleMenu();
          }}>
          <p
            className={`text-sm ${
              !value ? 'text-bblue' : 'text-bash group-hover:text-bblue'
            } filter-menu font-Medium whitespace-nowrap`}>
            All
          </p>
        </div>
      </div>
    </div>
  );
};

export default StatusFilter;
