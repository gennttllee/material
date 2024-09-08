import { centered, flexer, hoverFade } from 'constants/globalStyles';
import { TbMail, TbPhone, TbPin } from 'react-icons/tb';
import { Options } from './professionals/UserRowItem';
import Loader from 'components/shared/Loader';
import GridItems from '../Layout/GridItems';
import { Fragment, useEffect, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import ProjectCard from './ProjectCard';
import { Brief, Persona, User } from 'types';
import useFetch from 'Hooks/useFetch';
import { getUserProjects } from 'apis/projectBrief';
import { FetchImage } from 'components/shared/FetchImage';

type TPersonaBrief = User & { projects: Brief[] };

const PersonalProfile = ({
  hasIcon,
  persona,
  className
}: {
  persona: Persona;
  hasIcon?: boolean;
  className?: string;
}) => {
  const { isLoading, successResponse, load, usageCount } = useFetch<TPersonaBrief>();
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (showModal && !usageCount) {
      load(getUserProjects(persona._id));
    }
  }, [showModal]);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  return (
    <Fragment key={persona._id + '_profile'}>
      <Options
        {...{ hasIcon }}
        text="View Profile"
        onClick={toggleModal}
        className={'text-left text-bash hover:text-black text-sm' + hoverFade + className}
      />
      <div
        className={`${
          !showModal && 'hidden'
        } fixed z-[100] bg-pbg w-screen h-screen overflow-hidden top-0 left-0`}>
        <div
          className={
            'relative z-0 max-w-[calc(100%)] px-12 lg:px-24 xl:px-40 2xl:px-0 overflow-y-scroll flex-1 w-full no-scrollbar 2xl:max-w-[1440px] mx-auto mt-5' +
            flexer
          }>
          <div />
          <button
            onClick={toggleModal}
            className={'w-10 h-10 bg-white rounded-full border' + centered + hoverFade}>
            <IoClose className="text-bash text-xl" />
          </button>
        </div>
        <div className={centered + 'my-10'}>
          <div className="flex gap-5">
            <div className={'w-32 h-32 rounded-full bg-bblue border-4 border-white' + centered}>
              {persona.logo ? (
                <FetchImage
                  className="w-full rounded-full object-cover"
                  src={persona.logo}
                  alt="img"
                />
              ) : (
                <p className="text-white text-6xl uppercase">
                  {persona.firstName ? persona.firstName.charAt(0) : null}
                  {persona.lastName ? persona.lastName.charAt(0) : null}
                </p>
              )}
            </div>
            <div>
              <h4 className="font-Demibold text-xl capitalize">
                {persona.firstName} {persona.lastName}
              </h4>
              <div className="flex items-center gap-3 mt-2">
                <TbMail className="text-bash text-base" />
                <p className="text-bash text-lg">{persona.email}</p>
              </div>
              <div className="flex items-center gap-3">
                <TbPhone className="text-bash text-base" />
                <p className="text-bash text-lg">{persona.phoneNumber}</p>
              </div>
              <div className="flex items-center gap-3">
                <TbPin className="text-bash text-base" />
                <p className="text-bash text-lg">
                  {persona.country
                    ? `${persona.country}, ${persona.state}, ${persona.city}`
                    : 'Not Set'}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="h-full overflow-hidden">
          <div className="w-full border-b">
            <div
              className={
                'relative z-0 max-w-[calc(100%)] px-12 lg:px-24 xl:px-40 2xl:px-0 overflow-y-scroll flex-1 w-full no-scrollbar 2xl:max-w-[1440px] mx-auto' +
                flexer
              }>
              <div className="relative">
                <p className={'font-Medium text-lg mb-2' + hoverFade}>Projects</p>
                <div className="absolute h-2 w-1/2 bg-bblue  left-1/2 transform -translate-x-1/2 rounded-full top-[95%]" />
              </div>
            </div>
          </div>
          <div className="relative h-[70%] z-0 max-w-[calc(100%)] px-12 lg:px-24 xl:px-40 2xl:px-0 overflow-y-scroll flex-1 w-full 2xl:max-w-[1440px] mx-auto pb-10">
            {isLoading ? (
              <Loader />
            ) : successResponse ? (
              <GridItems<Brief>
                data={successResponse.projects}
                gridClassName="h-full overflow-scroll"
                Card={ProjectCard}
                paginationEnabled
                showMore={false}
              />
            ) : null}
          </div>
        </div>
      </div>
    </Fragment>
  );
};

export default PersonalProfile;
