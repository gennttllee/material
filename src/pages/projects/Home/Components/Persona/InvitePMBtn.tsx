import Button from 'components/shared/Button';
import React, { useState, useContext, useMemo, useEffect, BaseSyntheticEvent } from 'react';
import CustomModal from 'components/shared/CustomModal';
import { errorStyle, flexer, hoverFade } from 'constants/globalStyles';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { FiTrash2 } from 'react-icons/fi';
import useFetch from 'Hooks/useFetch';
import { displayError } from 'Utils';
import { StoreContext } from 'context';
import useRole, { UserRoleConstants, UserRoles } from 'Hooks/useRole';
import { Bid, Brief, ProjectID, User } from 'types';
import { memberSchema } from 'components/projects/Team/Views/validation';
import { addProjectManagerToBnkle } from 'apis/projectBrief';
import InputField from 'components/shared/InputField';
import Select from '../professionals/Select';
import SelectField from 'components/shared/SelectField';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { isActive } from 'components/projects/home/summary/Updates';
import { TbEdit } from 'react-icons/tb';
import { convertToProper } from 'components/shared/utils';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { loadDevelopers } from 'store/slices/developerSlice';
import { loadProjectManagers } from 'store/slices/projectManagerSlice';
type PMAdditionType = { email: string; type: string; company?: string };
const InvitePMBtn = ({ role }: { role: UserRoles }) => {
  const { isProfessional } = useRole();
  const [showModal, setModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<PMAdditionType[]>([]);
  const devs = useAppSelector((m) => m.developers);
  const managers = useAppSelector((m) => m.projectManagers);
  const { setError, error } = useFetch<User[]>({ initialData: [] });
  const { load, isLoading: isAdding } = useFetch<Brief<Bid<ProjectID>[] | undefined>[]>();
  let dispatch = useAppDispatch();
  const toggleModal = () => {
    setModal((prev) => !prev);
  };
  let { role: userRole } = useRole();
  const handleUserSubmission = async () => {
    if (!selectedUser[0]) return setError('Must at least have one selected member');
    else setError('');

    const users = selectedUser.map(({ email, type, company }) => ({
      companyName: company === '' ? 'General' : company,
      email,
      type
    }));

    load(addProjectManagerToBnkle(users)).then((res: any) => {
      if (res.status < 300) {
        dispatch(
          role === 'developer'
            ? loadDevelopers({ loading: false, data: [...devs.data, ...res.data] })
            : loadProjectManagers({ loading: false, data: [...managers.data, ...res.data] })
        );
      }
      toggleModal();
      setSelectedUser([]);
    });
  };
  const {
    reset,
    control,
    register,
    handleSubmit,
    formState: { errors, touchedFields }
  } = useForm<{
    email: string;
  }>({
    reValidateMode: 'onChange',
    defaultValues: { email: '' },
    resolver: yupResolver(memberSchema)
  });
  const submitHandler = (e: any) => {
    e.preventDefault();
    return handleSubmit(({ email }) => {
      /** check if email doesn't already exist */
      const emailExists = selectedUser.find((one) => one.email === email);
      if (emailExists) return displayError('User already selected');
      setSelectedUser((prev: PMAdditionType[]) => {
        return [...prev, { email, company: company ?? 'General', type: role.toString() }];
      });
      reset();
    })(e as unknown as BaseSyntheticEvent);
  };

  const label = ['', 'Select Company', `Invite ${UserRoleConstants[role]}s`];
  const [step, setStep] = useState(role === 'developer' ? 2 : 1);
  const [company, setCompany] = useState('');

  const companyList = useMemo(() => {
    return [
      { label: 'General', value: 'General' },
      ...devs.data
        .map((m) => m.companyName)
        .filter((m) => m)
        .map((m) => {
          return { label: m, value: m };
        })
    ];
  }, []);

  let btnActive = useMemo(() => {
    let isActive =
      step === 1 && company ? true : step === 2 && selectedUser.length > 0 ? true : false;
    let label = step === 1 ? 'Next' : `Add ${UserRoleConstants[role]}s`;
    return {
      isActive,
      label
    };
  }, [step, company, selectedUser]);

  const handleClick = () => {
    if (btnActive.isActive) {
      if (step === 1) {
        setStep(2);
      }
    }
  };
  const handleBack = () => {
    setStep(1);
  };

  const SelectedUsersView = () => (
    <div className="max-h-80 h-fit overflow-x-scroll w-full">
      {React.Children.toArray(
        selectedUser.map((user) => (
          <div className={flexer + 'w-full mt-5'}>
            <div className="rounded-full px-4 py-2 bg-pbg">
              <h1 className="text-black font-Medium text-xl">{user.email.charAt(0)}</h1>
            </div>
            <div className="flex-1 px-4">
              <p className="font-semibold text-sm">{user.email}</p>
            </div>
            <button
              onClick={() => setSelectedUser((prev) => prev.filter((one) => one !== user))}
              className={hoverFade + 'mx-4'}>
              <FiTrash2 className="text-bred text-base" />
            </button>
          </div>
        ))
      )}
    </div>
  );

  const NewMemberView = (
    <>
      <div className={flexer + 'mb-3'}>
        <span className="flex items-center">
          {step === 2 && role !== 'developer' && (
            <span className="hover:cursor-pointer" onClick={handleBack}>
              {<FaArrowLeftLong color="#5E6777" className="mr-4" />}
            </span>
          )}

          <span className="text-bash text-sm">{`Step ${step} of 2`}</span>
        </span>

        <button onClick={toggleModal} className={'capitalize text-bash cursor-pointer' + hoverFade}>
          close
        </button>
      </div>
      <p className="text-bblack-0 text-2xl mt-3 font-semibold ">{label[step]}</p>

      {step === 1 && (
        <SelectField
          placeholder="Select Company"
          value={company}
          onChange={(x) => {
            setCompany(x);
          }}
          data={companyList}
        />
      )}

      {step === 2 && (
        <>
          {role !== 'developer' && (
            <>
              <div className="rounded-md bg-lightblue py-2 px-4 mt-4 flex items-center justify-between ">
                <span className="text-bblack-0">
                  <p className=" text-sm ">Selected Company</p>
                  <p className="font-semibold text-lg mt-1">{convertToProper(company)}</p>
                </span>
                <span className="flex items-center cursor-pointer hover:underline text-bash">
                  <span onClick={handleBack} className="text-sm mr-2">
                    Change
                  </span>
                  <TbEdit size={16} />
                </span>
              </div>

              <div className=" my-6 border-t border-t-bash " />
            </>
          )}
          <form className="relative flex items-end gap-3 w-full mt-6" onSubmit={submitHandler}>
            <InputField
              label=""
              ContainerClassName="!my-0"
              register={register('email')}
              placeholder="e.g Johndoe@hello.com"
              wrapperClassName={`${errors.email?.message ? '!border-red-500' : ''}`}
            />
            <Button text="Add User" className="!h-fit" btnType="submit" />
          </form>
        </>
      )}
      <p className={errorStyle + ''}>{error}</p>
      {touchedFields.email && <p className={errorStyle}>{errors.email?.message}</p>}
      {step === 2 && <SelectedUsersView />}

      {selectedUser[0] && step == 2 ? (
        <Button
          btnType="button"
          isLoading={isAdding}
          text={`Add ${UserRoleConstants[role]}s`}
          className="w-full mt-6"
          onClick={handleUserSubmission}
        />
      ) : null}
      {step === 2 && btnActive.isActive ? null : (
        <div>
          <button
            onClick={handleClick}
            className={`w-full mt-8 py-2  rounded-md border ${
              btnActive.isActive
                ? 'bg-bblue border-bblue text-white'
                : ' border-ashShade-4 bg-ashShade-3 text-bash'
            }`}>
            {btnActive.label}
          </button>
        </div>
      )}
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
      {userRole === UserRoles.PortfolioManager && role === UserRoles.ProjectManager && (
        <Button text="Add user" onClick={toggleModal} btnType="button" />
      )}
      {Modal}
    </>
  );
};

export default InvitePMBtn;
