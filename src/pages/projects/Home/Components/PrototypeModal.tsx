import useRole, { UserRoles } from 'Hooks/useRole';
import Button from 'components/shared/Button/Button';
import { FetchImage } from 'components/shared/FetchImage';
import { Image } from 'components/shared/Image';
import React, { useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { CgExtensionAdd } from 'react-icons/cg';
import { centered, flexer, hoverFade, responsiveFlex } from 'constants/globalStyles';
import { MdOutlineLocalDining, MdOutlineTableBar } from 'react-icons/md';
import { RxBoxModel } from 'react-icons/rx';
import { TbArmchair, TbArrowLeft, TbBath, TbBed } from 'react-icons/tb';
import noContentImg from 'assets/nocontent.svg';
import { Brief, Prototype, User } from 'types';
import bookIcon from 'assets/book.svg';
import UsePrototypeForm from './usePrototypeForm';
import useFetch from 'Hooks/useFetch';
import { createProjectBrief, deleteProjectBrief } from 'apis/projectBrief';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { BucketNames } from '../../../../constants';
import { StoreContext } from 'context';
import PrototypeImageModal from './PrototypeImageModal';
import { setModal } from 'store/slices/contractorProfileSlice';

export type Props = Prototype & {
  toggleEditModal: () => void;
  toggleModal: () => void;
  consultant?: User;
  logo?: string;
  name?: string;
};

const PrototypeModal = React.forwardRef<HTMLDivElement | null, Props>((allProps, ref) => {
  const { toggleModal } = allProps;
  const { setContext } = useContext(StoreContext);
  const containerRef = useRef<HTMLDivElement>(null);
  const [newProject, setNewProject] = useState<Brief>();
  const [modalType, setModalType] = useState<'auto' | 'form'>('auto');

  useEffect(() => {
    if (newProject) {
      toggleModalType();
    }
  }, [newProject]);

  const toggleModalType = () => {
    if (containerRef.current) {
      containerRef.current.scrollTo({ left: 0, top: 0 });
      setModalType((prev) => (prev === 'auto' ? 'form' : 'auto'));
    }
  };

  const {
    load: loadDelete,
    isLoading: isDeleting,
    successResponse: deleteResponse
  } = useFetch({
    onSuccess: () => {
      if (newProject) {
        setContext((prev) => ({
          ...prev,
          // remove the brief from other stored brief
          data: prev.data.filter((one) => one._id !== newProject._id),
          menuProjects: prev.menuProjects.filter((one) => one._id !== newProject._id)
        }));
      }
      setNewProject(undefined);
      if (modalType === 'form') {
        toggleModalType();
      } else {
        toggleModal();
      }
    }
  });

  const ConditionalRender = useCallback(
    ({ modalType }: { modalType?: string | null }) => {
      switch (modalType) {
        case 'auto':
          return (
            <AutoComp
              {...{
                ...allProps,
                setNewProject,
              }}
            />
          );
        case 'form':
          return newProject ? (
            <UsePrototypeForm
              {...{
                ...allProps,
                toggleModalType,
                projectId: newProject._id,
                setNewProject
              }}
            />
          ) : (
            <></>
          );
        default:
          return <></>;
      }
    },
    [newProject]
  );

  const Container = useCallback(
    ({ modalType }: { modalType: string | null }) => (
      <div ref={ref} className="px-5 lg:px-14 py-10 h-fit relative">
        <ConditionalRender modalType={modalType} />
      </div>
    ),
    [newProject]
  );

  return (
    <>
      {}
      <div className="fixed top-0 left-0 w-screen h-screen bg-[#FFFFFF] flex flex-col z-20">
        <header className="container pt-10 pb-5 max-w-[calc(90%)] 2xl:max-w-[1184px] mx-auto">
          <div
            onClick={() => {
              if (modalType === 'form' && newProject) {
                loadDelete(deleteProjectBrief(newProject._id)).then(() => {});
              } else toggleModal();
            }}
            className="hover:text-black text-bash font-Medium text-base flex items-center cursor-pointer w-fit">
            {isDeleting ? (
              <AiOutlineLoading3Quarters className="animate-spin text-sm" />
            ) : (
              <TbArrowLeft />
            )}
            <p className="ml-2">Back</p>
          </div>
          <div />
        </header>
        <div className="w-full border-t" />
        <div
          ref={containerRef}
          className="container flex-1 overflow-y-scroll max-w-[calc(90%)] 2xl:max-w-[1184px] mx-auto">
          <Container modalType={modalType} />
        </div>
      </div>
    </>
  );
});

const AutoComp = ({
  logo,
  name,
  description,
  projectName,
  projectType,
  setNewProject,
  prototypeImages,
  ...rest
}: Props & { setNewProject: (val: any) => void }) => {
  const { isOfType, canCreateBrief } = useRole();
  const { setContext } = useContext(StoreContext);
  const [activeImage, setActiveImage] = useState(0);
  const [showModal, setShowModal] = useState(false);

  const { load, isLoading } = useFetch({
    onSuccess: (brief) => {
      setContext((prev) => ({
        ...prev,
        data: [brief, ...prev.data],
        menuProjects: [brief, ...prev.data]
      }));
      setNewProject(brief);
    }
  });

  const handlePrototypeUsage = () => {
    const payload: { [key: string]: any } = {
      projectType: 'residential',
      residentialType: projectType,
      commercialType: 'office',
      numberOfBaths: '1',
      projectLocation: {
        country: 'Nigeria',
        city: 'FCT',
        state: 'FCT'
      },
      numberOfUnits: String(rest.units || 1),
      numberOfToilets: String(rest.numberOfToilets),
      numberOfStorage: String(rest.numberOfStorage),
      numberOfBedrooms: String(rest.numberOfBedRooms),
      numberOfKitchens: String(rest.numberOfKitchens),
      numberOfLivingRooms: String(rest.numberOfLivingRooms),
      numberOfDiningRooms: String(rest.numberOfDiningRooms),
      defaultUnitOfMeasurement: (rest.unitOfMeasurement as any) === 'sqm' ? 'Metric' : 'Imperial',
      otherSpaces: []
    };
    load(createProjectBrief(payload));
  };

  const appliances = [
    {
      Icon: TbBed,
      label: 'Bedroom',
      count: rest.numberOfBedRooms
    },
    {
      Icon: MdOutlineLocalDining,
      label: 'kitchen',
      count: rest.numberOfKitchens
    },
    {
      Icon: TbArmchair,
      label: 'Living room',
      count: rest.numberOfLivingRooms
    },
    {
      Icon: RxBoxModel,
      label: 'Store',
      count: rest.numberOfStorage
    },
    {
      Icon: MdOutlineTableBar,
      label: 'Dining room',
      count: rest.numberOfDiningRooms
    },
    {
      Icon: TbBath,
      label: 'Toilet/Bathroom',
      count: rest.numberOfToilets
    }
  ];
  const handleImageClick = (idx: number) => {
    setActiveImage(idx);
  };

  return (
    <>
      {showModal && (
        <PrototypeImageModal
          active={activeImage}
          closer={() => setShowModal(false)}
          images={prototypeImages}
        />
      )}
      <div>
        <h2 className="text-2xl font-Medium">{projectName}</h2>
        <div className="flex items-center">
          <p className="text-sm font-Medium">By</p>
          <div className="bg-pbg p-1 rounded-full ml-2">
            {logo ? (
              <Image src={logo} decoding="sync" className="rounded-full w-5 h-5 !bg-bred" />
            ) : null}
          </div>
          <p className="font-Medium text-black ml-1 mr-2">{name || 'Loading...'}</p>
        </div>
      </div>
      <div className={flexer + 'my-5 lg:my-10 flex-col lg:flex-row w-full gap-2'}>
        <FetchImage
          onClick={() => {
            setShowModal(true);
            setActiveImage(0);
          }}
          hasTransitionEffect
          src={prototypeImages[0].key}
          className="w-full lg:w-1/2 rounded-md border-2 h-[400px] object-cover bg-gray-100"
        />
        <div className="relative lg:h-[400px] lg:w-1/2 overflow-hidden py-2">
          <div className="h-full py-1 w-full relative grid-rows-2  grid grid-cols-2 gap-3 transform scale-y-105">
            {React.Children.toArray(
              prototypeImages.slice(1, 5).map(({ key }, index) => (
                <div className="w-full h-full relative">
                  <FetchImage
                    className={
                      `rounded-lg w-full h-full object-cover border-2 bg-gray-100 ${
                        activeImage === index && ' border-bblue'
                      }` + hoverFade
                    }
                    onClick={() => {
                      setShowModal(true);
                      setActiveImage(index + 1);
                    }}
                    src={key}
                  />
                  {prototypeImages.length > 5 && index === 3 && (
                    <div
                      onClick={() => {
                        setShowModal(true);
                        setActiveImage(index + 1);
                      }}
                      className="absolute z-50 w-full h-full cursor-pointer bg-opacity-70 hover:bg-opacity-80 bg-white top-0 text-bblue text-3xl font-semibold left-0 flex items-center justify-center text-center">
                      +{prototypeImages.length - 5}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
          {prototypeImages.length > 5 && (
            <div className="absolute w-full h-10 -bottom-2 left-0 bg-gradient-to-b from-transparent to-white" />
          )}
        </div>
      </div>
      <div
        className={
          responsiveFlex + ' my-8 text-bash text-sm font-Medium gap-x-4   md:!items-start '
        }>
        <div className="w-full md:w-7/12 ">
          <div className="flex items-center mb-5">
            <p className="text-sm text-bash font-Medium capitalize mr-2">
              {rest.floorArea.toLocaleString()} {rest.unitOfMeasurement}
              {' Total area'}
            </p>
            &bull;
            <div className="flex items-center ml-2">
              <img src={bookIcon} alt="" className="w-4 h-4" />
              <p className="text-sm text-bash font-Medium truncate capitalize">{projectType}</p>
            </div>
          </div>

          <p className="text-black text-lg">{description}</p>
          <div className="border-t border-black w-full mt-5" />
          <p className="my-5 font-Medium">Facilities</p>
          <div className="flex flex-wrap gap-4 max-h-36 pb-5 overflow-y-scroll">
            {React.Children.toArray(
              appliances.map(({ label, count, Icon }) => (
                <div className="flex flex-col items-center border border-black px-6 py-3 rounded-lg">
                  <Icon className="text-bash text-lg mr-2" />
                  <p className="font-Medium">
                    <span className="text-black mr-1">{count}</span>
                    <span className="text-bash">{label}</span>
                  </p>
                </div>
              ))
            )}
            {React.Children.toArray(
              rest.otherSpaces.map(({ name, number }) => (
                <div className="flex flex-col items-center border border-black px-6 py-3 rounded-lg">
                  <CgExtensionAdd className="text-bash text-lg mr-2" />
                  <p className="font-Medium">
                    <span className="text-black mr-1">{number}</span>
                    <span className="text-bash">{name}</span>
                  </p>
                </div>
              ))
            )}
          </div>
        </div>
        {canCreateBrief ? (
          <div className={centered + ' flex-col w-full md:w-2/5'}>
            <div className={centered + 'flex-col p-6 border rounded'}>
              <h3 className="font-Medium text-center text-black text-xl">
                Collaborate with the Prototype Creator
              </h3>
              <p className="text-bash text-center text-lg">
                By using the prototype, you&apos;ll be working directly with the consultant on your
                project.
              </p>
              <Button
                type="primary"
                className="mt-5"
                {...{ isLoading }}
                text="Use Prototype"
                onClick={handlePrototypeUsage}
              />
            </div>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default PrototypeModal;
