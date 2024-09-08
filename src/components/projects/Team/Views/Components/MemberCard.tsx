import { centered, flexer } from 'constants/globalStyles';
import React, {
  Fragment,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import Button from 'components/shared/Button';
import { displayError } from 'Utils';
import randomColor from 'randomcolor';
import useFetch from 'Hooks/useFetch';
import { Persona, User } from 'types';
import { StoreContext } from 'context';
import { useNavigate } from 'react-router-dom';
import useRole, { UserRoles } from 'Hooks/useRole';
import { hoverFade } from 'constants/globalStyles';
import { BsThreeDotsVertical } from 'react-icons/bs';
import { removeProjectMember } from 'apis/projectBrief';
import CustomModal from 'components/shared/CustomModal';
import { FiMail, FiTrash2, FiUser } from 'react-icons/fi';
import { convertToProper } from 'components/shared/utils';
import { FetchImage } from 'components/shared/FetchImage';
import { AiOutlineLoading3Quarters } from 'react-icons/ai';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { display } from 'store/slices/contractorProfileSlice';
import ContractorProfile from 'components/shared/ContractorProfile';
import { RoleBaseLogo } from 'pages/projects/Home/Components/ActionMenu';
import PersonalProfile from 'pages/projects/Home/Components/PersonalProfile';

const professionals = [UserRoles.Consultant, UserRoles.Contractor];

let controller = new AbortController();

interface Prop {
  member: string;
}
const MemberCard = ({ member }: Prop) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [showMenu, setMenu] = useState(false);
  const [showModal, setModal] = useState(false);
  const [user, setUser] = useState<User | any>();
  const container = useRef<HTMLDivElement | null>(null);
  const { selectedProject, setContext, data, selectedProjectIndex } = useContext(StoreContext);
  const profileModal = useAppSelector((s) => s.contractorModal);
  const AuthUser = useAppSelector((s) => s.user);
  const team = useAppSelector((m) => m.team);
  const { canRemoveTeamMember } = useRole();
  const mem = useMemo(() => team.data[member], [team, member]);
  let roleObj = useMemo(() => {
    let _team = selectedProject.team;
    let role = _team.find((m) => m.id === mem?._id);
    return role;
  }, [mem, selectedProject]);

  const uniqueClassName = `MemberCard${mem?._id}`;
  const isProfessional = useMemo(() => professionals.includes(mem?.rolename), [mem]);
  const isProjectOwner = useMemo(() => UserRoles.ProjectOwner === mem?.rolename, [mem]);
  const isProjectManager = useMemo(() => UserRoles.ProjectManager === mem?.rolename, [mem]);

  const fetchUserDetails = useCallback(async () => {
    try {
      setUser(mem);
    } catch (error: any) {
      displayError(error.message);
    }
  }, [team, isProfessional]);

  const { load, isLoading } = useFetch();

  useEffect(() => {
    if (mem) {
      if (mem._id === AuthUser._id) {
        setUser(AuthUser);
      } else {
        setUser(undefined);
        fetchUserDetails();
      }
    }
    // return controller.abort();
  }, [fetchUserDetails, mem, AuthUser]);

  const backgroundColor = useMemo(() => {
    return randomColor({ luminosity: 'dark' });
  }, []);

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

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

  const handleDelete = () => {
    load(
      removeProjectMember({
        projectId: selectedProject._id,
        team: [{ id: mem._id, role: mem.rolename }]
      })
    ).then((res) => {
      toggleModal();
      setContext((prev) => ({
        ...prev,
        data: prev.data.map((project) =>
          project._id === selectedProject._id ? res.data[0] : project
        )
      }));
    });
  };

  const DeleteView = (
    <>
      <div className={flexer + 'mb-3'}>
        <h4 className="font-base font-Medium">Remove Team Member</h4>
        <label
          onClick={toggleModal}
          className="capitalize text-orange-300 hover:text-orange-500 cursor-pointer">
          close
        </label>
      </div>
      <div className={centered + 'flex-col'}>
        {user?.email ? (
          <div className={'w-52 h-52 relative bg-gray-100 mb-4 rounded-md' + centered}>
            <RoleBaseLogo {...{ user }} size="w-20 h-20" />
          </div>
        ) : null}
        <h6 className="font-bold">Are you sure you want to continue?</h6>
        <label className="text-gray-500">This member will be completely removed</label>
        <div className={flexer + 'mt-4'}>
          <Button text="Cancel" className="mr-5" type="secondary" onClick={toggleModal} />
          <Button type="danger" text="Yes, I’m sure" isLoading={isLoading} onClick={handleDelete} />
        </div>
      </div>
    </>
  );

  const Modal = (
    <CustomModal
      className="z-20"
      visible={showModal}
      toggle={toggleModal}
      containerClassName="w-11/12 md:w-3/6">
      {DeleteView}
    </CustomModal>
  );

  const Menu = () => (
    <div className={`absolute top-4 right-5 flex flex-col items-end ${uniqueClassName}`}>
      <div
        onClick={toggleMenu}
        className={
          `${
            showMenu && 'bg-blue-500'
          } hover:bg-blue-600 p-1 rounded-full w-fit ${uniqueClassName}` + hoverFade
        }>
        <BsThreeDotsVertical
          className={`${showMenu ? 'text-white' : 'text-bash'} hover:text-white ${uniqueClassName}`}
        />
      </div>
      <div className={` ${!showMenu && 'hidden'} shadow-md bg-white p-2 rounded-md mt-2`}>
        {isProfessional ? (
          <div
            onClick={() => {
              dispatch(display({ type: mem.rolename, profId: mem._id }));
            }}
            className={`flex items-center p-2 rounded-md group hover:bg-bbg cursor-pointer ${uniqueClassName}`}>
            <FiUser className={'text-bash group-hover:text-black ' + uniqueClassName} />
            <p className={'text-sm text-bash ml-1 group-hover:text-black ' + uniqueClassName}>
              View Profile
            </p>
          </div>
        ) : isProjectOwner || isProjectManager ? (
          <PersonalProfile persona={mem as Persona} hasIcon className={uniqueClassName} />
        ) : null}
        <div
          onClick={() => {
            navigate(`/projects/${data[selectedProjectIndex]._id}/communication/chats/${member}`);
          }}
          className={`flex items-center gap-1 p-2 rounded-md group hover:bg-bbg cursor-pointer ${uniqueClassName}`}>
          <FiMail className={'text-bash group-hover:text-bblue ' + uniqueClassName} />
          <p className={'text-sm text-bash group-hover:text-bblue ' + uniqueClassName}>Message</p>
        </div>
        {canRemoveTeamMember && (
          <>
            <div
              onClick={toggleModal}
              className="flex items-center gap-1 p-2 rounded-md group hover:bg-red-100 cursor-pointer">
              {isLoading ? (
                <AiOutlineLoading3Quarters className="animate-spin text-bash group-hover:text-bred" />
              ) : (
                <FiTrash2 className="text-bash group-hover:text-bred" />
              )}
              <p className="text-sm text-bash group-hover:text-bred">Remove</p>
            </div>
          </>
        )}
      </div>
    </div>
  );

  const name = useMemo(() => {
    if (!mem?.email) {
      console.log(mem);
    }

    const [emailPrefix] = String(mem?.email).split('@');

    if (
      mem?.rolename === UserRoles.Developer &&
      (Object.values(mem).includes('not set') || mem?.status === 'pending')
    ) {
      return 'Pending';
    }
    return mem?.firstName === emailPrefix && mem.lastName === emailPrefix
      ? 'Pending'
      : convertToProper(mem?.name);
  }, [mem]);

  return (
    <Fragment key={uniqueClassName}>
      <div
        ref={container}
        className={`flex-col ${
          mem ? '' : ' hidden '
        } flex w-full items-center min-w-0 bg-white p-10 rounded-md relative ${uniqueClassName}`}>
        <Menu />
        <div
          style={{ backgroundColor: !mem?.logo ? backgroundColor : '#F1F2F4' }}
          className={`w-32 h-32 flex justify-center items-center bg-pbg rounded-full border-2`}>
          {mem?.logo ? (
            <img
              alt="logo"
              loading="lazy"
              className="w-full h-full object-cover border rounded-full"
              src={mem.logo}
            />
          ) : (
            <span className="text-white uppercase font-semibold text-5xl">
              {mem?.name
                ? `${mem?.name[0]}`
                : `
                ${(user?.firstName || '')[0]}
              `}
            </span>
          )}
        </div>
        <div className="flex flex-col flex-1 justify-center items-center my-1">
          {name === 'Pending' ? <p className="font-semibold truncate">{mem.email}</p> : null}
          <p
            className={`font-semibold truncate ${name === 'Pending' ? 'text-bash' : 'text-black'}`}>
            {name}
          </p>
          <span className="text-sm block text-bash w-full text-center truncate">
            {convertToProper(roleObj?.role)}
          </span>
        </div>
      </div>
      {Modal}
      {profileModal.display && isProfessional ? <ContractorProfile /> : null}
    </Fragment>
  );
};

export default MemberCard;
