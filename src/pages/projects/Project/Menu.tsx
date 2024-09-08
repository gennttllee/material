import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import MenuItem from '../../../components/projects/MenuItem';
import { menuitems, ref } from '../../../components/projects/menuitems';
import plus from '../../../assets/plus.svg';
import { AiOutlineClose } from 'react-icons/ai';
import { BsChevronUp, BsChevronDown } from 'react-icons/bs';
import { convertToProper } from '../../../components/shared/utils';
import useRole from 'Hooks/useRole';
import { hoverFade } from 'constants/globalStyles';
import { useAppSelector } from 'store/hooks';
import { Brief, ProfessionalBrief } from '../../../types';
import { RxDoubleArrowLeft, RxDoubleArrowRight } from 'react-icons/rx';
import betalogo from 'assets/betalogo.png';
import { HiHome } from 'react-icons/hi';
import { useAllProjectPending } from 'components/projects/Team/Views/Components/UsePending';
interface Prop {
  toggle: [boolean, React.Dispatch<React.SetStateAction<boolean>>];
  selected: [number, (val: number) => void];
  data: Brief[] | ProfessionalBrief[];
  collapseFn: () => void;
  collapsed: boolean;
}
const finder = (str: string, arr: Brief[] | ProfessionalBrief[]) => {
  return arr?.filter((m) => m.pseudoProjectName?.toLowerCase()?.includes(str?.toLowerCase()));
};

const Menu = ({ toggle, data, selected, collapsed, collapseFn }: Prop) => {
  const navigate = useNavigate();
  const { projectId } = useParams();
  let { canCreateBrief } = useRole();
  const [text, setText] = useState('');
  const { isProfessional } = useRole();
  const user = useAppSelector((state) => state.user);
  const [showAllBriefs, setShowAllBriefs] = useState(false);
  const [filtered, setFiltered] = useState<Brief[] | ProfessionalBrief[]>(data);
  //
  const container = useRef<HTMLDivElement>(null);
  let pending = useAllProjectPending();
  let index = selected[0];
  let path = useLocation().pathname;
  useEffect(() => {
    setFiltered(finder(text, data));
  }, [text, data]);

  useEffect(() => {
    setShowAllBriefs(false);
  }, [index]);

  useEffect(() => {
    document.addEventListener('click', (e: any) => {
      if (e.target && e.target.contains(container.current)) {
        setShowAllBriefs(false);
      }
    });
    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setShowAllBriefs(false);
      });
    };
  }, []);

  return (
    <>
      <span
        className="lg:hidden w-full flex pr-2 justify-end items-center self-end"
        onClick={() => toggle[1](!toggle[0])}>
        <span className="  p-2 mb-2 rounded-md">
          <AiOutlineClose size={20} style={{ color: 'black' }} />
        </span>
      </span>

      <div
        onClick={() => collapseFn()}
        className={`w-full hidden  px-4 mb-10 lg:flex items-center ${
          collapsed ? 'justify-center' : 'justify-between'
        }`}>
        {!collapsed && <img src={betalogo} alt="bnklebeta" className="w-20 h-8 ml-4" />}
        {collapsed ? (
          <RxDoubleArrowRight color="black" size={24} />
        ) : (
          <RxDoubleArrowLeft color="black" size={24} />
        )}
      </div>

      <Link className={'mb-5 mx-5 flex items-center' + hoverFade} to="/projects">
        <HiHome className={` ${collapsed ? 'text-lg ml-3' : 'mr-3'} text-bash`} />
        <p className={`${collapsed ? 'hidden' : ''} font-Medium`}>Home</p>
      </Link>

      <div className={'bg-ashShade-0 px-4 relative'}>
        <div
          className={`flex transition-transform justify-between  py-3 my-1  items-center  bg-ashShade-0`}>
          <div
            className={`flex-1 flex items-center ${
              collapsed ? 'justify-center' : 'justify-between'
            }`}>
            <span
              className={
                collapsed ? 'hidden' : 'text-base w-9/12 font-semibold capitalize truncate'
              }>
              {data.length > 0 ? convertToProper(data[selected[0]].pseudoProjectName) : 'No Data'}
            </span>
            {collapsed && user.role === 'projectOwner' ? null : (
              <span
                onClick={() => {
                  if (!showAllBriefs && collapsed) {
                    collapseFn();
                  }
                  setShowAllBriefs(!showAllBriefs);
                }}
                className={`${hoverFade} `}>
                {showAllBriefs && data && data.length ? (
                  <BsChevronUp />
                ) : (
                  data.length > 1 && <BsChevronDown />
                )}
              </span>
            )}
            {canCreateBrief ? (
              <span
                onClick={() => navigate('/projectform')}
                className="flex rounded-full bg-borange items-center justify-center w-9 h-9">
                <img src={plus} alt="add project" loading="lazy" decoding="async" />
              </span>
            ) : null}
          </div>
        </div>
        <div
          ref={container}
          className={` 
            absolute top-100 z-20 h-fit ${collapsed ? 'w-[262px] ' : 'w-11/12'} h-fit bg-white
             min-h-[120px]
            max-h-96  shadow-md rounded-md
            ${!showAllBriefs ? 'zero-height hidden  ' : 'auto-height border overflow-y-auto'}
          `}>
          <div className="w-full p-2">
            <input
              onChange={(e) => {
                setText(e.target.value);
              }}
              type="text"
              value={text}
              placeholder="Search..."
              className="w-full p-2 border border-bblue rounded-md"
            />
          </div>

          {filtered && filtered.length > 0 ? (
            React.Children.toArray(
              filtered.map((m: Brief, i: number) => (
                <p
                  onClick={() => {
                    let idx = 0;
                    data.forEach((k, i) => {
                      if (k._id === m._id) {
                        idx = i;
                      }
                    });
                    selected[1](idx);
                    if (window.innerWidth < 1024) {
                      toggle[1](false);
                    }

                    // navigate("/projects/home");
                  }}
                  className={`my-1 text-base font-Medium capitalize truncate cursor-pointer hover:text-white hover:bg-bblue ${
                    i === selected[0] ? 'hidden ' : ' '
                  } py-2 px-3 `}>
                  {convertToProper(m.pseudoProjectName)}
                </p>
              ))
            )
          ) : (
            <span className="w-full p-4 my-4">No search results...</span>
          )}
        </div>
      </div>
      <div className={'w-full flex flex-col justify-between flex-1 mt-4 '}>
        <div className="w-full relative">
          {data[0] &&
            menuitems.map((m, i) => (
              <MenuItem
                unread={pending}
                key={i}
                closeMenu={() => {
                  if (window.innerWidth < 1024) {
                    toggle[1](false);
                  }
                }}
                collapsed={collapsed}
                name={m.name}
                image={m.image}
                onSelect={toggle[1]}
                path={`/projects/${projectId}/${m.path}`}
                active={path.includes('/' + m.path)}
              />
            ))}
          {/* <div className="w-full flex-col flex my-5">
            {isProfessional ? null : (
              <hr className="w-4/5 rounded-lg bg-bidsbg h-0.5 self-center" />
            )}
          </div> */}
          {/* <MenuItem
            unread={pending}
            key={8}
            closeMenu={() => {
              if (window.innerWidth < 1024) {
                toggle[1](false);
              }
            }}
            name={ref.name}
            image={ref.image}
            onSelect={toggle[1]}
            collapsed={collapsed}
            active={path.includes('/' + ref.path)}
            path={`/projects/${projectId}/${ref.path}`}
          /> */}
        </div>
      </div>
    </>
  );
};

export default Menu;
