import React, { useContext, useEffect, useMemo, useState } from 'react';
import Home from './home';
import Summary from './summary';
import { StoreContext } from 'context';
import { FiFile } from 'react-icons/fi';
import { useAppSelector } from 'store/hooks';
import { useNavigate } from 'react-router-dom';
import SuperModal from 'components/shared/SuperModal';

const Index = () => {
  const team = useAppSelector((m) => m.team);
  const user = useAppSelector((m) => m.user);
  let { data, selectedProjectIndex } = useContext(StoreContext);
  const [loading, setLoading] = useState(true);
  const [teamItem, setTeamItem] = useState<any[]>([]);
  const [brief, setBrief] = React.useState(false);
  const [pop, setPop] = useState(false);
  let navigate = useNavigate();
  const handleLoad = () => {};

  useEffect(() => {
    if (!team.loading) {
      let acc: any[] = [];
      for (let i in team.data) {
        if (team.data[i] && team.data[i].role !== 'general') acc.push(team.data[i]);
      }
      setTeamItem(acc);
    }
  }, [team]);

  let isTeamMember = useMemo(() => {
    let isTeamMember = false;
    data[selectedProjectIndex].team.map((m: { id: string }, i: number) => {
      if (m.id === user._id) {
        isTeamMember = true;
      }
    });
    return isTeamMember || user.role === 'portfolioManager';
  }, [data, selectedProjectIndex]);

  const closer = () => {
    setPop(false);
  };

  let xLoading = useMemo(() => {
    return team.loading;
  }, [team, isTeamMember, loading, data, selectedProjectIndex]);

  return (
    <div className="w-full h-full ">
      {pop && (
        <SuperModal classes=" bg-black  bg-opacity-20" closer={closer}>
          <div className="  p-6 w-full h-full items-center flex flex-col overflow-y-auto scrollbar">
            <div
              onClick={(e) => {
                e.stopPropagation();
              }}
              className=" bg-white rounded-md">
              <Home isPopUp closer={closer} />
            </div>
          </div>
        </SuperModal>
      )}
      <div className="flex items-center justify-between">
        <span className="text-2xl font-semibold">Dashboard</span>
        <div className="flex items-center ">
          {isTeamMember && (
            <>
              <div
                onClick={() => {
                  navigate(`/projects/${data[selectedProjectIndex]._id}/communication/chats`);
                }}
                className="hidden lg:flex items-center gap-0.5">
                {teamItem.map((m) => (
                  <Pic
                    key={m.logo + m.initials}
                    {...m}
                    name={m.name}
                    className="w-10 h-10 rounded-full bg-bblack-0"
                    textClass="font-medium text-white"
                  />
                ))}
              </div>

              <button
                className="text-bblue border px-8 ml-2 py-3 flex items-center font-medium rounded-md border-bblue"
                onClick={() => {
                  if (isTeamMember) {
                    setPop(!pop);
                  }
                  // setBrief((_) => !_);
                }}>
                <FiFile size={16} color="" className="text-bblue mr-2" />
                {brief ? 'Dashboard' : 'Project brief'}
              </button>
            </>
          )}
        </div>
      </div>
      <div className="w-full mt-8">{isTeamMember ? !brief ? <Summary /> : <Home /> : <Home />}</div>
    </div>
  );
};

interface PicProps {
  logo: string;
  initials: string;
  className?: string;
  textClass?: string;
  name?: string;
}
const Pic = ({ logo, initials, className, textClass, name }: PicProps) => {
  const [hovered, setHovered] = useState(false);
  return (
    <div className="relative flex flex-col items-center">
      {hovered && (
        <span className=" z-10 -bottom-7 absolute bg-black whitespace-nowrap text-white py-1 px-2 text-xxs rounded-full ">
          {name}
        </span>
      )}
      <span
        className="cursor-pointer"
        onMouseLeave={() => setHovered(false)}
        onMouseOver={() => setHovered(true)}>
        {logo ? (
          <img src={logo} className={` object-cover ${className ?? ''}`} />
        ) : (
          <span className={`flex items-center justify-center ${className ?? ''}`}>
            <span className={`${textClass ?? ''}`}>{initials?.toUpperCase()}</span>
          </span>
        )}
      </span>
    </div>
  );
};

export default Index;
