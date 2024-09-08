import Button from 'components/shared/Button';
import React, { useState, useEffect, useContext, useMemo } from 'react';
import CustomModal from 'components/shared/CustomModal';
import { centered, errorStyle, flexer, hoverFade } from 'constants/globalStyles';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { GoVerified } from 'react-icons/go';
import { FiTrash2 } from 'react-icons/fi';
import { memberSchema } from '../validation';
import useRole, { UserRoleConstants, UserRoles } from 'Hooks/useRole';
import useFetch from 'Hooks/useFetch';
import { Bid, Brief, ProjectID, User } from 'types';
import { getAllUsersByType } from 'apis/user';
import { displayError } from 'Utils';
import { addDeveloperToTeam, addGuestToTeam, addProjectManagerToTeam } from 'apis/projectBrief';
import { StoreContext } from 'context';
import { MdClose } from 'react-icons/md';
import { RoleBaseLogo } from 'pages/projects/Home/Components/ActionMenu';
import SelectField from 'components/shared/SelectField/SelectField';
import { _canSeeSnapshot } from 'pages/projects/Home/Components/Snapshot';
import useCompanyList from 'Hooks/useCompanyList';

export type NewMember = {
  id?: string;
  name: string;
  email: string;
  firstName: string;
  type: UserRoles | 'guest';
  isVerified: { account: boolean; email: boolean };
  companyName?: string;
};

const NewMemberBtn = () => {
  const companyList = useCompanyList();
  const [showModal, setModal] = useState(false);
  const { isProfessional, isOfType, canSeeSnapshot, role, AddableRolesList } = useRole();
  const [roleFilter, setRoleFilter] = useState<UserRoles | ''>(UserRoles.Guest);
  const { selectedProject, setContext } = useContext(StoreContext);
  const [selectedUser, setSelectedUser] = useState<NewMember[]>([]);

  const activeGuestsCount = useMemo(() => {
    return selectedProject.team.filter((one) => one.role === 'guest').length;
  }, [selectedProject]);

  const pendingGuestsCount = useMemo(() => {
    return selectedUser.filter((one) => one.type === 'guest').length;
  }, [selectedUser]);

  const {
    load: loadUsers,
    successResponse,
    isLoading,
    setError,
    error
  } = useFetch<User[]>({ initialData: [] });
  const { load, isLoading: isAdding } = useFetch<Brief<Bid<ProjectID>[] | undefined>[]>();

  const {
    reset,
    watch,
    control,
    setValue,
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{
    email: string;
  }>({
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
    resolver: yupResolver(memberSchema)
  });

  useEffect(() => {
    if (
      showModal &&
      (!successResponse || !successResponse[0]) &&
      !['', 'guest'].includes(roleFilter)
    ) {
      loadUsers(getAllUsersByType<User[]>(roleFilter || ('' as UserRoles)));
    }
    // eslint-disable-next-line
  }, [showModal, successResponse, role, roleFilter]);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const handleUserSubmission = async () => {
    if (!selectedUser[0]) return setError('Must at least have one selected member');
    else setError('');
    const guests: any[] = selectedUser
      .filter((one) => one.type === 'guest')
      .map(({ email }) => ({ email }));
    const projectManagers: any[] = selectedUser
      .filter(({ type }) => type === UserRoles.ProjectManager)
      .map(({ id, type }) => ({ id, role: type }));

    const developers: any[] = selectedUser
      .filter(({ type }) => [UserRoles.Developer, UserRoles.BookKeeper].includes(type as UserRoles))
      .map(({ type, email }) => ({ type, email }));
    const portfolioManagers: any[] = selectedUser
      .filter(({ type }) => type === 'portfolioManager')
      .map(({ type, email }) => ({ type, email }));

    const projectOwners: any[] = selectedUser
      .filter(({ type }) => type === UserRoles.ProjectOwner)
      .map(({ type, email }) => ({ type, email }));

    const mutateFunction = (index: number, team: any[]) => {
      switch (index) {
        case 0:
          return addGuestToTeam({
            projectId: selectedProject._id,
            team
          });
        case 1:
          return addProjectManagerToTeam({
            projectId: selectedProject._id,
            team
          });
        default:
          return addDeveloperToTeam({
            projectId: selectedProject._id,
            team
          });
      }
    };
    /** submit one at a time */
    [guests, projectManagers, developers, projectOwners, portfolioManagers].forEach(
      (team, index) => {
        if (team[0])
          load(mutateFunction(index, team) as any).then((res) => {
            toggleModal();
            setSelectedUser([]);
            setContext((prev) => ({
              ...prev,
              data: prev.data.map((project) =>
                project._id === selectedProject._id ? res.data[0] : project
              )
            }));
          });
      }
    );
  };

  const submitHandler = handleSubmit(({ email }) => {
    if (!successResponse) return null;

    let newUser: NewMember;

    /** check if email doesn't already exist */
    const emailExists = selectedUser.find((one) => one.email === email);

    if (emailExists) return displayError('User already selected');

    if (!roleFilter || roleFilter === UserRoles.Guest) {
      /** Count guest on the project */
      if (activeGuestsCount >= 4) return displayError("Guests can't exceed 4 on the team");
      /** Count guest from project and selected users */
      if (activeGuestsCount + pendingGuestsCount >= 4)
        return displayError("Guests can't exceed 4 on the team");
      /** if there's no role use, set user as Guest */
      newUser = {
        email,
        type: 'guest',
        name: email.split('@')[0],
        firstName: email.split('@')[0],
        isVerified: { account: false, email: false }
      };
    } else if (AddableRolesList.includes(roleFilter)) {
      newUser = {
        email,
        type: roleFilter,
        name: email.split('@')[0],
        firstName: email.split('@')[0],
        isVerified: { account: false, email: false }
      };
    } else {
      const exists = successResponse.find((one) => one.email === email);

      if (!exists) return displayError(`User with email = ${email} doesn't exist`);
      else
        newUser = {
          email,
          id: exists._id,
          isVerified: exists.isVerified,
          type: (roleFilter || '') as UserRoles,
          name: exists.name || email.split('@')[0],
          firstName: exists.firstName || email.split('@')[0]
        };
    }

    if (newUser) {
      setSelectedUser((prev) => [...prev, newUser]);
    }
    reset();
  });

  const SearchResultView =
    watch('email') && canSeeSnapshot ? (
      <div className="absolute left-0 top-full shadow-xl border z-10 rounded-md max-h-80 overflow-y-scroll w-full h-fit bg-white">
        {!roleFilter || roleFilter === 'guest' ? null : isLoading ? ( // no options (suggestions) if there's is no role picked
          <div className={centered}>
            {' '}
            <p className="animate-pulse text-xl text-bash">loading ...</p>{' '}
          </div>
        ) : (
          React.Children.toArray(
            !successResponse || !successResponse[0]
              ? null
              : successResponse
                  .filter(
                    (one) =>
                      one.email.includes(watch('email')) ||
                      (one.firstName ? `${one.firstName} $${one.lastName}` : one.name)
                        .toLowerCase()
                        .includes(watch('email'))
                  ) // filter query
                  .map((user) => (
                    <NewMemberCard
                      {...{ user }}
                      onClick={() => {
                        setValue('email', user.email);
                        submitHandler();
                      }}
                    />
                  ))
          )
        )}
      </div>
    ) : null;

  const SelectedUsersView = () => (
    <div className="max-h-80 h-fit overflow-x-scroll w-full">
      {React.Children.toArray(
        selectedUser.map((user) => (
          <div className={flexer + 'w-full mt-5'}>
            <div className="rounded-full px-3 py-1 bg-pbg">
              <h1 className="text-black font-Medium text-xl">
                {(user.name || user.firstName).charAt(0)}
              </h1>
            </div>
            <div className="flex-1 px-4">
              <div className="flex items-center">
                <p className="font-semibold text-sm">{user.firstName || user.name}</p>
                {user.isVerified.email ? <GoVerified className="text-green-600 ml-2" /> : null}
              </div>
              <p className="text-bash">{user.email}</p>
            </div>
            <div className="flex items-center">
              <strong className="font-Medium capitalize">{user.type}</strong>
              <div
                onClick={() =>
                  setSelectedUser((prev) => prev.filter((one) => one.email !== user.email))
                }
                className={hoverFade + 'mx-4'}>
                <FiTrash2 className="text-bred text-base" />
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );

  let optionsData = useMemo(() => {
    const data = [
      {
        value: UserRoles.Guest,
        label: UserRoleConstants.guest
      },
      {
        value: UserRoles.PortfolioManager,
        label: UserRoleConstants[UserRoles.PortfolioManager]
      },
      {
        value: UserRoles.ProjectManager,
        label: UserRoleConstants[UserRoles.ProjectManager]
      },
      {
        value: UserRoles.Developer,
        label: UserRoleConstants[UserRoles.Developer]
      },
      {
        value: UserRoles.ProjectOwner,
        label: UserRoleConstants[UserRoles.ProjectOwner]
      },
      {
        value: UserRoles.BookKeeper,
        label: UserRoleConstants[UserRoles.BookKeeper]
      }
    ];

    if ([UserRoles.ProjectManager, UserRoles.ProjectOwner].includes(role)) {
      return [data[0]];
    }

    if (role === UserRoles.Developer) {
      return [data[0], data[2]];
    }

    if (role === UserRoles.PortfolioManager) {
      return data;
    }

    return [];
  }, []);

  const NewMemberView = (
    <>
      <div className={flexer + 'mb-3'}>
        <h4 className="font-base font-Medium">Add Team Member</h4>
        <label
          onClick={toggleModal}
          className="capitalize text-orange-300 hover:text-orange-500 cursor-pointer">
          close
        </label>
      </div>
      <form className="relative" onSubmit={submitHandler}>
        <div className={flexer}>
          <div
            className={
              flexer +
              `flex-[0.95] pl-4 pr-1 pb-1 border ${
                errors.email?.message ? 'border-bred' : 'border-bash'
              }  rounded-md`
            }>
            <div className={flexer + ' gap-2 flex-[0.95]'}>
              <input
                className={`flex-1 outline-none ${errors.email?.message ? 'placeholder-bred' : ''}`}
                placeholder={errors.email?.message ? 'Provide the email' : 'Enter email'}
                {...register('email')}
              />
              <Controller
                control={control}
                name="email"
                render={({ field: { value: email, onChange } }) => (
                  <>
                    {email ? (
                      <MdClose
                        onClick={() => onChange('')}
                        className={'text-bash mr-2' + hoverFade}
                      />
                    ) : null}
                  </>
                )}
              />
            </div>
            {!isProfessional ? (
              <>
                <SelectField
                  placeholder="Choose"
                  className="!w-[40%] !my-0 scrollbar-thin "
                  wrapperClassName="bg-pbg !w-full border-none"
                  value={roleFilter}
                  data={optionsData}
                  onChange={(key) => setRoleFilter(key as UserRoles)}
                />
              </>
            ) : (
              <div className="my-4" />
            )}
          </div>
          <Button text="Add User" btnType="submit" />
        </div>
        {SearchResultView}
      </form>
      <SelectedUsersView />
      <p className={errorStyle + 'text-center'}>{error}</p>
      {selectedUser[0] ? (
        <Button
          btnType="button"
          isLoading={isAdding}
          text="Invite to Team"
          className="w-full mt-6"
          onClick={handleUserSubmission}
        />
      ) : null}
    </>
  );

  const Modal = (
    <CustomModal
      visible={showModal}
      toggle={toggleModal}
      className="z-20 !items-start"
      containerClassName="w-11/12 md:w-3/6 !top-[10vh]">
      {NewMemberView}
    </CustomModal>
  );

  return (
    <>
      {!isProfessional && <Button text="Add team member" onClick={toggleModal} />}
      {Modal}
    </>
  );
};

const NewMemberCard = ({ user, onClick }: { user: User; onClick: () => void }) => (
  <div
    {...{ onClick }}
    className={flexer + hoverFade + 'hover:bg-pbg p-3 relative overflow-hidden '}>
    <RoleBaseLogo {...{ user }} />
    <div className="flex-1 px-4 ">
      <div className="flex items-center">
        <p className="font-semibold text-sm">
          {user.firstName ? `${user.firstName} ${user.lastName}` : user.name}
        </p>
        {user.isVerified ? <GoVerified className="text-green-600 ml-2" /> : null}
      </div>
      <p className="text-bash">{user.email}</p>
    </div>
    <div />
  </div>
);

export default NewMemberBtn;
