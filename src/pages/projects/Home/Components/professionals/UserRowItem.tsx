import { useState, useMemo, useRef, ReactNode } from 'react';
import { BsPatchCheckFill, BsCheckLg } from 'react-icons/bs';
import { TbBuildingSkyscraper } from 'react-icons/tb';
import { LoaderX } from 'components/shared/Loader';
import { convertToProper } from 'components/shared/utils';
import { addContractor, removeContractor } from '../../../../../store/slices/contractorSlice';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { checkforSelection } from 'components/shared/utils';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import { postForm } from 'apis/postForm';
import { updateProjectManager } from 'store/slices/projectManagerSlice';
import { isCompany, isProfessional } from 'Hooks/roleFunctions';
import { updateProfessional } from 'store/slices/professionals';
import { updateDeveloper } from 'store/slices/developerSlice';
import useRole, { UserRoles } from 'Hooks/useRole';
import { displayError } from 'Utils';
import PersonalProfile from '../PersonalProfile';
import { FiUser } from 'react-icons/fi';
import { flexer } from 'constants/globalStyles';
import { FetchImage } from 'components/shared/FetchImage';

interface Prop {
  contractor: any;
  toggler?: any;
  idSetter?: any;
  showSelector?: boolean;
  displayFn: (type: 'contractor' | 'consultant', id: string) => void;
  type?: 'professionals' | 'developers' | 'projectManagers';
  handleRename?: () => void;
  showEditModal?: () => void;
}

type actionKeyTypes = 'developer' | 'consultant' | 'contractor' | 'projectManager';
let UpdateActions = {
  developer: (x: any) => updateDeveloper(x),
  consultant: (x: any) => updateProfessional(x),
  contractor: (x: any) => updateProfessional(x),
  projectManager: (x: any) => updateProjectManager(x)
};

const UserRowItem = ({ contractor, displayFn, showSelector, type, showEditModal }: Prop) => {
  const dispatch = useAppDispatch();
  const contractors = useAppSelector((state) => state.contractor);
  const [verifying, setVerifying] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [suspending, setSuspending] = useState(false);
  const [loaderror, setLoaderror] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [modal, setModal] = useState(false);
  const { isOfType } = useRole();

  const verified = contractor?.isVerified?.account;
  const image = useMemo(
    () => contractor?.businessInformation?.logo || contractor.logo || '',
    [contractor]
  );
  const modalRef = useRef<HTMLSpanElement>(null);
  useClickOutSideComponent(modalRef, () => setModal(false));
  const user = useAppSelector((m) => m.user);
  const disabled: boolean = useMemo(() => {
    return Boolean(contractor?.disabled);
  }, [contractor]);
  const { role } = useRole();
  const suspended: boolean = useMemo(() => {
    return Boolean(contractor?.suspended);
  }, [contractor]);
  const handleVerify = async () => {
    setVerifying(true);

    const { e, response } = await postForm(
      'patch',
      `professionals/verify?professionalId=${contractor._id}`,
      {},
      'iam'
    );

    if (response) {
      dispatch(updateProfessional(response.data.data));
      setModal(false);
    } else {
      Promise.reject(e);
    }

    setVerifying(false);
  };

  const handleSuspension = async () => {
    const url = isCompany(contractor.type || contractor.rolename)
      ? `professionals/${contractor?.suspended ? `resume-suspended` : `suspend`}?professionalId=${
          contractor._id
        }`
      : `users/${contractor?.suspended ? `resume-suspended-manager` : `suspend`}?userId=${
          contractor._id
        }`;
    setSuspending(true);
    const { e, response } = await postForm('patch', url, {}, 'iam');
    // if (e) {
    //   Promise.reject(e);
    // }
    if (response) {
      dispatch(
        UpdateActions[(contractor.type || contractor.rolename) as actionKeyTypes](
          response.data.data
        )
      );
      setModal(false);
    } else {
      displayError(e);
    }
    setSuspending(false);
  };

  const handleDisable = async () => {
    const url = isCompany(contractor.type || contractor.rolename)
      ? `professionals/${contractor?.disabled ? `resume` : `disable`}?professionalId=${
          contractor._id
        }`
      : `users/${contractor?.disabled ? `resume-disabled-manager` : `disable`}?userId=${
          contractor._id
        }`;
    setDisabling(true);
    const { e, response } = await postForm('patch', url, {}, 'iam');

    if (response) {
      dispatch(
        UpdateActions[(contractor.type || contractor.rolename) as actionKeyTypes](
          response.data.data
        )
      );
      setModal(false);
    } else {
      displayError(e);
      // Promise.reject(e);
    }

    setDisabling(false);
  };
  return (
    <tr
      onClick={() => {
        displayFn(contractor.type || contractor.rolename, contractor._id);
      }}
      className="bg-white text-sm mx-7 relative hover:bg-lightblue  ">
      <td className="py-4">
        <div className="flex items-center cursor-pointer">
          <hr className="absolute bg-ashShade-3 h-[2px] w-[calc(100%-48px)] wc bottom-0 mx-6 " />
          <span
            onClick={(e) => {
              e.stopPropagation();
              if (checkforSelection(contractors, contractor._id)) {
                dispatch(removeContractor(contractor));
              } else {
                dispatch(addContractor(contractor));
              }
            }}
            className={`mx-8 my-2 ${
              showSelector ? '' : 'invisible'
            } w-4 h-4 rounded-sm flex justify-center items-center ${
              !checkforSelection(contractors, contractor._id)
                ? 'border-bash'
                : ' border-bblue bg-bblue'
            } border-2`}>
            {checkforSelection(contractors, contractor._id) && <BsCheckLg color="white" size={8} />}
          </span>
          <span className=" mr-2 rounded-full bg-ashShade-3">
            {fetching ? (
              <LoaderX />
            ) : image === '' || loaderror ? (
              isCompany(contractor.type || contractor.rolename) ? (
                <TbBuildingSkyscraper className="m-1" size={32} />
              ) : (
                <span className="font-semibold text-white flex p-1 items-center justify-center rounded-full w-8 h-8 bg-bblue whitespace-nowrap">
                  {`${contractor?.firstName.charAt(0)}${contractor?.lastName?.charAt(
                    0
                  )}`.toUpperCase()}
                </span>
              )
            ) : (
              <FetchImage
                className="w-10 h-10 rounded-full object-cover"
                onError={() => setLoaderror(true)}
                src={image}
                alt="img"
              />
            )}
          </span>
          <div>
            <div className="flex items-center ">
              <span className="mr-2 font-semibold text-bblack-0">
                {isCompany(contractor.type)
                  ? contractor?.name
                  : convertToProper(`${contractor?.firstName ?? ''} ${contractor?.lastName ?? ''}`)}
              </span>
              {contractor?.businessInformation?.isverified ? (
                <BsPatchCheckFill color={'#459A33'} className="" />
              ) : null}
            </div>
          </div>
        </div>
      </td>
      {!isProfessional(contractor.type) && role !== UserRoles.Developer && (
        <td className="cursor-pointer">{contractor?.companyName}</td>
      )}
      {!isProfessional(contractor.type) && <td className="cursor-pointer">{contractor?.state}</td>}
      {isProfessional(contractor.type) && <td className="cursor-pointer">{contractor?.city}</td>}
      {isProfessional(contractor.type) && <td>{convertToProper(contractor.type)}</td>}
      {isProfessional(contractor.type) && (
        <td className="mx-2 p-2">
          <span
            className={`p-1 rounded-full ${
              verified ? ' bg-bgreen-1 text-bgreen-0' : ' bg-redShades-1 text-redShades-2 '
            } flex items-center justify-center`}>
            <span className="text-sm whitespace-nowrap">
              {verified ? 'Verified' : 'Not-verified'}
            </span>
          </span>
        </td>
      )}
      {!isProfessional(contractor.type) && <td className="">{contractor?.city}</td>}
      <td>{contractor.phoneNumber}</td>
      <td className="">{contractor.email}</td>
      <td className="">
        <span
          className={`p-1 rounded-full ${
            contractor?.status === 'active'
              ? ' bg-bgreen-1 text-bgreen-0'
              : ' bg-redShades-1 text-redShades-2 '
          } flex items-center justify-center`}>
          <span className="text-sm whitespace-nowrap">{contractor?.status}</span>
        </span>
      </td>
      <td
        onClick={(e) => {
          e.stopPropagation();
        }}
        className={'p-4 hover:cursor-pointer'}>
        <span
          onClick={() => setModal(true)}
          className=" w-8 h-8 items-center justify-center flex rounded-full hover:border hover:border-bblue ">
          <IoEllipsisVertical size={16} color="#C8CDD4" />
        </span>
      </td>
      {modal && (
        <span
          ref={modalRef}
          onClick={(e) => {
            e.stopPropagation();
          }}
          className="absolute rounded-md flex flex-col gap-1 hover:cursor-pointer bg-white shadow-bnkle z-30  right-0.5 top-[70%] border p-2">
          {isCompany(contractor.type) && (
            <Options
              text="View Profile"
              onClick={() => {
                displayFn(contractor.type, contractor._id);
              }}
            />
          )}

          {contractor.type === 'projectManager' && !isOfType(UserRoles.Developer) ? (
            <Options text="Edit Company Name" onClick={showEditModal || (() => {})} />
          ) : null}

          {contractor.type === 'projectManager' && <PersonalProfile persona={contractor} />}

          {isOfType(UserRoles.PortfolioManager) && (
            <>
              {isProfessional(contractor.type) && !contractor?.isVerified?.account && (
                <Options loading={verifying} text="Verify" onClick={handleVerify} />
              )}
              <Options
                loading={suspending}
                text={suspended ? 'Restore' : 'Suspend'}
                className={!suspended ? ' text-bgreen-0' : ' text-bred'}
                onClick={handleSuspension}
              />
              <Options
                loading={disabling}
                text={disabled ? 'Enable' : 'Disable'}
                className={disabled ? ' text-bgreen-0' : ' text-bred'}
                onClick={handleDisable}
              />
            </>
          )}
        </span>
      )}
    </tr>
  );
};

interface Props {
  text: string;
  className?: string;
  onClick?: () => void | Promise<void>;
  loading?: boolean;
  hasIcon?: boolean;
}

export const Options = ({ text, className, onClick, loading, hasIcon }: Props) => {
  return (
    <button
      onClick={onClick}
      className={
        'text-sm py-2 whitespace-nowrap font-medium px-2 hover:bg-ashShade-0 rounded-md ' +
        className +
        `${loading ? ' flex items-center justify-center' : flexer + 'gap-1'}`
      }>
      {!loading ? (
        <>
          {hasIcon && <FiUser className={className} />}
          {text}
        </>
      ) : (
        <LoaderX color="blue" />
      )}
    </button>
  );
};

export default UserRowItem;
