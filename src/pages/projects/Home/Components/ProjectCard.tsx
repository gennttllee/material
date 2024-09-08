import StatusBanner from 'components/projects/bids/contractor/components/StatusBanner';
import { centered, flexer, hoverFade } from 'constants/globalStyles';
import { TbBed, TbCheck, TbEdit, TbFolderFilled, TbPlus, TbTrash } from 'react-icons/tb';
import buildingIcon from 'assets/buildingType.svg';
import { useNavigate } from 'react-router-dom';
import { Brief, StatusEnum } from 'types';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { StoreContext } from 'context';
import useRole, { UserRoles } from 'Hooks/useRole';
import { deleteProtoType } from 'apis/prototypes';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { AiOutlineClose } from 'react-icons/ai';
import DeleteModal from 'components/shared/DeleteModal/DeleteModal';
import useFetch from 'Hooks/useFetch';
import Moment from 'react-moment';
import { TbBuildingSkyscraper } from 'react-icons/tb';
import { FaEllipsisVertical } from 'react-icons/fa6';
import { IconType } from 'react-icons';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import MoveToClusterModal from './MoveToClusterModal';
import { LoaderX } from 'components/shared/Loader';
import { useAppSelector } from 'store/hooks';
import { deleteProjectBrief } from 'apis/projectBrief';
import { displayInfo, displaySuccess } from 'Utils';

export default function ProjectCard(
  project: Brief & {
    selected?: boolean;
    onClick?: () => void;
    showCheckBox?: boolean;
  }
) {
  const navigate = useNavigate();
  const { isOfType, isOwner, canCreateBrief } = useRole();
  const [showMenu, setMenu] = useState(false);
  const [showDeleteModal, setDeleteModal] = useState(false);
  const [clusterModal, setClusterModal] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const { isLoading, load } = useFetch();
  const { handleContext, menuProjects, setContext } = useContext(StoreContext);
  const uniqueClassName = `project${project._id}`;
  const [options, setOptions] = useState(false);
  let optionsRef = useRef<HTMLSpanElement>(null);
  let { _id } = useAppSelector((m) => m.user);
  useClickOutSideComponent(optionsRef, () => {
    setOptions(!options);
  });

  useEffect(() => {
    // click event that's in charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (
        e.target &&
        (e.target.contains(menuRef.current) || !e.target.classList.contains(uniqueClassName))
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
    // eslint-disable-next-line
  }, []);
  const isCommercial = useMemo(() => {
    return project.projectType === 'commercial';
  }, [project]);
  const toggleDeleteModal = () => {
    setDeleteModal((prev) => !prev);
  };

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  const handleClick = () => {
    if (options) {
      setOptions(false);
      return;
    } else {
      if (!project?.onClick) {
        let index = 0;
        for (const one of menuProjects) {
          if (one._id === project._id) break;
          index += 1;
        }
        handleContext('selectedProjectIndex', index);
        navigate(`/projects/${project._id}/home`);
      } else {
        project?.onClick();
      }
    }
  };

  const handleDelete = () => {
    load(deleteProjectBrief(project._id))
      .then((res) => {
        if (res.status === 200) {
          /** remove the prototype from local data */
          setContext((prev) => ({
            ...prev,
            menuProjects: prev.menuProjects.filter((one) => one._id !== project._id)
          }));
          displaySuccess('Project Deleted');
          setDeleteModal(false);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const canDeleteCurrentProject = useMemo(() => {
    let isPortfolioManager = isOfType(UserRoles.PortfolioManager);

    let isInTeam = project?.team.find((m) => m.id === _id);

    return isPortfolioManager;
  }, [project]);

  const status = useMemo(() => {
    switch (project.status) {
      case StatusEnum.ongoing:
        return 'pending';
      case StatusEnum.completed:
        return 'completed';
      default:
        return 'dormant';
    }
  }, [project.status]);

  return (
    <>
      {clusterModal && (
        <MoveToClusterModal projectId={project._id} closer={() => setClusterModal(false)} />
      )}
      <DeleteModal
        {...{ isLoading }}
        title="Delete project"
        visible={showDeleteModal}
        toggle={toggleDeleteModal}
        deleteRequest={handleDelete}
      />
      <div
        className={`relative group-scoped ${uniqueClassName} ${
          project?.literalBids && !project.pseudoProjectName ? 'hidden' : ''
        }`}>
        <div
          onClick={handleClick}
          className={
            'flex-col flex group-scoped justify-between p-6 bg-white rounded relative' +
            hoverFade +
            'hover:opacity-75'
          }>
          <div className=" relative flex items-center justify-between w-full">
            <div className={'bg-blue-100 rounded-full p-2 w-fit' + centered}>
              <TbFolderFilled className="text-bblue w-4 h-4" />
            </div>
            {project?.showCheckBox ? (
              <span
                className={` flex items-center justify-center w-4 h-4 border ${
                  project?.selected ? 'border-bblue bg-bblue' : ' border-ashShade-2 bg-white'
                } rounded `}>
                {project?.selected && <TbCheck color="white" size={12} />}
              </span>
            ) : (
              <span
                className=" p-2 rounded-full hover:bg-ashShade-0"
                onClick={(e) => {
                  e.stopPropagation();
                  setOptions(true);
                }}>
                <FaEllipsisVertical />
              </span>
            )}

            {options && canCreateBrief && (
              <>
                <span
                  ref={optionsRef}
                  onClick={(e) => e.stopPropagation()}
                  className="absolute z-40 right-0 top-7 bg-white p-4 rounded-md shadow-bnkle ">
                  <TheOption text="Edit" icon={TbEdit} onClick={() => {}} />
                  {!project?.clusterId && (
                    <TheOption
                      text="Add to cluster"
                      icon={TbPlus}
                      onClick={() => {
                        setClusterModal(true);
                        setOptions(false);
                      }}
                    />
                  )}
                  {canDeleteCurrentProject && (
                    <TheOption
                      text="Delete"
                      icon={TbTrash}
                      onClick={toggleDeleteModal}
                      className=" hover:bg-redShades-1  text-redShades-2 hover:text-redShades-2 "
                      iconColor="#B63434"
                      iconHoveredColor="#B63434"
                    />
                  )}
                </span>
              </>
            )}
          </div>

          <p className="text-xl truncate font-semibold capitalize my-2">
            {project.pseudoProjectName}
          </p>
          <div className="flex items-center mb-2">
            <div className="flex items-center">
              {isCommercial ? (
                <span className="text-bash text-sm mx-1 truncate">{project.commercialType}</span>
              ) : (
                <>
                  <TbBed className="text-bash text-base" />
                  <p className="text-bash text-sm mx-1 truncate">
                    {project.numberOfBedrooms} Bedroom
                    {project.numberOfBedrooms > 1 && 's'}
                  </p>
                </>
              )}
            </div>
            &bull;
            <div className="flex items-center">
              {isCommercial ? (
                <TbBuildingSkyscraper className=" mx-1" color="#77828D" />
              ) : (
                <img src={buildingIcon} alt="duplex" className="w-4 h-4 mx-1 text-bash" />
              )}
              <p className="text-bash text-sm capitalize">{project.projectType}</p>
            </div>
          </div>
          <div className={flexer}>
            <StatusBanner type={status} label={project.status} className="w-fit" />
            <Moment fromNow className="text-bash text-sm">
              {project.createdAt}
            </Moment>
          </div>
        </div>
      </div>
    </>
  );
}

interface Props {
  text: string;
  onClick: () => void;
  icon: IconType;
  className?: string;
  iconClass?: string;
  iconHoveredColor?: string;
  iconColor?: string;
  iconRight?: IconType;
  loading?: boolean;
  loaderColor?: 'blue' | 'red' | 'green';
}
const TheOption = ({
  text,
  onClick,
  icon,
  className,
  iconClass,
  iconColor,
  iconHoveredColor,
  iconRight,
  loading,
  loaderColor
}: Props) => {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onClick={() => {
        if (!loading) {
          onClick();
        }
      }}
      className={` cursor-pointer  rounded-md hover:bg-lightblue  items-center flex text-bash hover:text-bblue p-2 ${className}`}>
      {React.createElement(icon, {
        className: iconClass ?? ' mr-2',
        color: hovered ? iconHoveredColor ?? '#437ADB' : iconColor ?? '#9099A8'
      })}
      {loading ? <LoaderX color={loaderColor} /> : text}
      {iconRight &&
        React.createElement(iconRight, {
          className: iconClass ?? ' mr-2',
          color: hovered ? iconHoveredColor ?? '#437ADB' : iconColor ?? '#9099A8'
        })}
    </span>
  );
};

export { TheOption };
