import { useState, useMemo, useRef } from 'react';
import { BsPatchCheckFill, BsCheckLg } from 'react-icons/bs';
import { TbBuildingSkyscraper } from 'react-icons/tb';
import { LoaderX } from 'components/shared/Loader';
import { convertToProper } from 'components/shared/utils';
import { addContractor, removeContractor } from '../../../../../store/slices/contractorSlice';
import { useAppDispatch, useAppSelector } from '../../../../../store/hooks';
import { checkforSelection } from 'components/shared/utils';
import { display } from 'store/slices/contractorProfileSlice';
import { IoEllipsisVertical } from 'react-icons/io5';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import { postForm } from 'apis/postForm';
import { updateProfessional } from 'store/slices/professionals';
import { canHaveCompanyName, isProfessional } from 'Hooks/roleFunctions';

interface Prop {
  contractor: any;
  toggler: any;
  idSetter: any;
  showSelector?: boolean;
  displayFn: (type: 'contractor' | 'consultant', id: string) => void;
}

const ProfessionalCard = ({ contractor, displayFn, toggler, idSetter, showSelector }: Prop) => {
  const dispatch = useAppDispatch();
  const contractors = useAppSelector((state) => state.contractor);
  const [verifying, setVerifying] = useState(false);
  const [disabling, setDisabling] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [loaderror, setLoaderror] = useState(false);
  const [modal, setModal] = useState(false);
  let verified = contractor?.isVerified?.account;
  let image = useMemo(() => contractor?.businessInformation?.logo || '', []);
  let modalRef = useRef<HTMLSpanElement>(null);
  useClickOutSideComponent(modalRef, () => setModal(false));
  let user = useAppSelector((m) => m.user);
  let disabled: boolean = useMemo(() => {
    return Boolean(contractor?.disabled);
  }, [contractor]);

  const handleVerify = async () => {
    setVerifying(true);

    let { e, response } = await postForm(
      'patch',
      `professionals/verify?professionalId=${contractor._id}`,
      {},
      'iam'
    );

    if (e) {
      Promise.reject(e);
    }

    if (response) {
      dispatch(updateProfessional(response.data.data));
      setModal(false);
    }

    setVerifying(false);
  };

  const handleDisable = async () => {
    setDisabling(true);
    let { e, response } = await postForm(
      'patch',
      `professionals/${contractor?.disabled ? `resume` : `disable`}?professionalId=${
        contractor._id
      }`,
      {},
      'iam'
    );

    if (e) {
      Promise.reject(e);
    }

    if (response) {
      dispatch(updateProfessional(response.data.data));
      setModal(false);
    }

    setDisabling(false);
  };
  return (
    <tr
      onClick={() => {
        displayFn(contractor.type, contractor._id);
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
              <TbBuildingSkyscraper className="m-1" size={32} />
            ) : (
              <img
                className="w-10 h-10 rounded-full object-cover"
                src={image}
                onError={() => setLoaderror(true)}
                alt="img"
              />
            )}
          </span>
          <div>
            <div className="flex items-center ">
              <span className="mr-2 font-semibold text-bblack-0">{contractor?.name}</span>
              {contractor?.businessInformation?.isverified ? (
                <BsPatchCheckFill color={'#459A33'} className="" />
              ) : null}
            </div>
          </div>
        </div>
      </td>
      <td className="cursor-pointer">{contractor?.city}</td>
      <td>{convertToProper(contractor.type)}</td>
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
      <td>{contractor.phoneNumber}</td>
      <td className="">{contractor.email}</td>
      <td className=" ">
        <span
          className={`p-1 rounded-full ${
            !disabled ? ' bg-bgreen-1 text-bgreen-0' : ' bg-redShades-1 text-redShades-2 '
          } flex items-center justify-center`}>
          <span className="text-sm whitespace-nowrap">{disabled ? 'disabled' : 'active'}</span>
        </span>
      </td>
      <td
        onClick={(e) => {
          e.stopPropagation();
        }}
        className="p-4 hover:cursor-pointer">
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
          className="absolute rounded-md flex flex-col gap-1 hover:cursor-pointer bg-white shadow-bnkle z-30 w-36 right-0 -bottom-4 p-2">
          <Options text="View Profile" onClick={() => displayFn(contractor.type, contractor._id)} />
          {(user.role as unknown as string) === 'portfolioManager' && (
            <>
              {!contractor?.isVerified?.account && (
                <Options loading={verifying} text="Verify" onClick={handleVerify} />
              )}
              <Options
                loading={disabling}
                text={disabled ? 'Restore' : 'Disable'}
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
  onClick: () => void | Promise<void>;
  loading?: boolean;
}

const Options = ({ text, className, onClick, loading }: Props) => {
  return (
    <div
      onClick={onClick}
      className={
        'text-sm py-2 font-medium px-1 hover:bg-ashShade-0 rounded ' +
        className +
        `${loading ? ' flex items-center justify-center' : ''}`
      }>
      {!loading ? text : <LoaderX color="blue" />}
    </div>
  );
};

export default ProfessionalCard;
