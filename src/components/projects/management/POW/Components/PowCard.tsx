import { yupResolver } from '@hookform/resolvers/yup';
import React, {
  ForwardRefRenderFunction,
  forwardRef,
  memo,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { useForm } from 'react-hook-form';
import { AiOutlineClose } from 'react-icons/ai';
import { BiLoaderAlt } from 'react-icons/bi';
import { TbDotsVertical, TbEdit, TbTrash } from 'react-icons/tb';
import Moment from 'react-moment';
import useFetch from '../../../../../Hooks/useFetch';
import { POW, POWStatus, ProjectTask } from '../../types';
import { deletePow, editPow } from '../../../../../apis/pow';
import { centered, flexer, hoverFade } from '../../../../../constants/globalStyles';
import StatusBanner from '../../../bids/contractor/components/StatusBanner';
import { editPowSchema } from '../../../../../validation/task';
import CustomModal from '../../../../shared/CustomModal';
import InputField from '../../../../shared/InputField';
import Button from '../../../../shared/Button';
import { PMStoreContext } from '../../Context';
import { getTasksByPOW } from 'apis/tasks';
import useRole from 'Hooks/useRole';
import { getProfessional } from 'apis/user';
import { User } from 'types';
import { StoreContext } from 'context';
import { SortTasksByDate, isAwaiting } from '../helpers';
import { BucketNames, dateFormat } from '../../../../../constants';
import { FetchImage } from 'components/shared/FetchImage';

interface Props {
  pow: POW;
  onClick: () => void;
}

const getEndDateFromTaskList = (tasks: ProjectTask[]) => {
  let max = 0;
  for (let task of tasks) {
    if (task?.subTasks && task.subTasks.length > 0) {
      for (let sub of task.subTasks) {
        if (sub?.status.toLowerCase() !== 'Awaiting Approval'.toLowerCase()) {
          max = Math.max(new Date(sub.endDate).getTime(), max);
        }
      }
    }
  }
  return max < 1 ? null : new Date(max);
};

const getStartDateFromTaskList = (tasks: ProjectTask[]) => {
  let min = Infinity;
  for (let task of tasks) {
    if (task?.subTasks && task.subTasks.length > 0) {
      for (let sub of task.subTasks) {
        if (sub?.status.toLowerCase() !== 'Awaiting Approval'.toLowerCase()) {
          min = Math.min(new Date(sub.startDate.value).getTime(), min);
        }
      }
    }
  }
  return min === Infinity ? null : new Date(min);
};

function PowCard({ pow, onClick }: Props) {
  const { setContext, tasks } = useContext(PMStoreContext);
  const POWRef = useRef<HTMLDivElement>(null);
  const { isProfessional } = useRole();
  //
  const {
    load: tasksLoad,
    isLoading: isTaskLoading,
    successResponse: TaskResponse
  } = useFetch<ProjectTask[]>({
    showDisplayError: false
  });
  const { load: professionalLoad, successResponse } = useFetch<[User]>();

  useEffect(() => {
    if (TaskResponse) {
      setContext((prev) => ({
        ...prev,
        tasks: { ...prev.tasks, [pow._id]: TaskResponse }
      }));
    }
  }, [TaskResponse]);

  const { startDate, endDate } = useMemo(() => {
    if (tasks && tasks[pow._id]) {
      let endDate = getEndDateFromTaskList(tasks[pow._id]);
      return {
        // startDate: TasksSortedByStart[0] ? TasksSortedByStart[0].startDate : null,
        startDate: getStartDateFromTaskList(tasks[pow._id]),
        endDate: endDate
      };
    }
    return {
      startDate: null,
      endDate: null
    };
  }, [tasks, pow]);

  useEffect(() => {
    if (!tasks[pow._id]) {
      tasksLoad(getTasksByPOW(pow._id));
    }
  }, [tasks, pow]);

  useEffect(() => {
    if (!isProfessional && pow.professional)
      if (pow.professional) {
        /**
         * get the pow's / professional's creator info
         * if not the oe viewing
         */
        professionalLoad(getProfessional(pow.professional));
      }
  }, [isProfessional]);

  const today = new Date();

  const hasStarted = useMemo(() => {
    return startDate ? today.getTime() >= new Date(startDate).getTime() : false;
  }, [startDate]);

  const hasEnded = useMemo(() => {
    return endDate ? today.getTime() >= new Date(endDate).getTime() : false;
  }, [endDate]);

  const handleClick = () => {
    if (TaskResponse && !tasks[pow._id] && successResponse) {
      setContext((prev) => ({
        ...prev,
        tasks: {
          ...prev.tasks,
          [pow._id]: TaskResponse
        },
        pows: prev.pows.map((one) =>
          one._id === pow._id ? { ...one, professionalInfo: successResponse[0] } : one
        )
      }));
    }
    onClick();
  };

  const StatusType = useMemo(() => {
    switch (pow.status) {
      case POWStatus.AwaitingApproval:
        return 'dormant';
      case POWStatus.NotStarted:
        return 'not started';
      case POWStatus.InProgress:
        return 'pending';
      case POWStatus.Completed:
        return 'done';
      default:
        return 'completed';
    }
  }, [pow.status]);

  return (
    <div className={centered + `w-full relative `}>
      <OpsDropdown ref={POWRef} pow={pow} />
      <div
        onClick={handleClick}
        ref={POWRef}
        className={
          'bg-white py-6 px-4 w-full h-full  rounded-md cursor-pointer hover:opacity-95 relative z-0'
        }>
        {isProfessional || !pow.professional ? (
          <div />
        ) : pow.professionalInfo ? (
          <div className={flexer}>
            <div className="flex items-center capitalize">
              <label className="text-sm font-Medium text-bash">Contractor :</label>
              <span className="text-sm font-Medium text-black ml-1 mr-2">
                {pow.professionalInfo?.name || 'Not Set'}
              </span>
              {pow.professionalInfo?.businessInformation.logo ? (
                <FetchImage
                  bucketName={BucketNames[0]}
                  src={pow.professionalInfo?.businessInformation.logo}
                  className="bg-bblue w-6 h-6 rounded-full border"
                />
              ) : null}
            </div>
          </div>
        ) : successResponse && successResponse[0] ? (
          <div className={flexer}>
            <div className="flex items-center capitalize">
              <label className="text-sm font-Medium text-bash">Contractor :</label>
              <span className="text-sm font-Medium text-black ml-1 mr-2">
                {successResponse[0].name || 'Not Set'}
              </span>
              {successResponse[0]['businessInformation']['logo'] ? (
                <FetchImage
                  bucketName={BucketNames[0]}
                  src={successResponse[0]['businessInformation']['logo']}
                  className="bg-bblue w-6 h-6 rounded-full border"
                />
              ) : null}
            </div>
          </div>
        ) : (
          <p className="text-ashShade-3 font-Medium">Loading...</p>
        )}

        <p className="text-2xl font-semibold mt-8 mb-6 truncate capitalize">{pow.name}</p>
        <div className={'flex justify-between items-end'}>
          <div className={flexer + 'transform translate-y-1'}>
            <div>
              <p className="text-sm font-Medium truncate">Start{hasStarted ? 'ed' : 's'} </p>
              <p className="text-sm text-bash font-Medium">
                {isTaskLoading ? (
                  'Loading...'
                ) : startDate ? (
                  <Moment className="text-sm" format={dateFormat}>
                    {startDate}
                  </Moment>
                ) : (
                  'Not Set'
                )}
              </p>
            </div>
            <div className="ml-5">
              <p className="text-sm font-Medium">
                {`${
                  hasEnded && !['done', 'completed'].includes(StatusType)
                    ? 'Ends'
                    : `End${hasEnded ? 'ed' : 's'}`
                }`}
              </p>
              <p className="text-sm text-bash font-Medium">
                {isTaskLoading ? (
                  'Loading...'
                ) : endDate && !isNaN(endDate.getTime()) ? (
                  <Moment className="text-sm" format={dateFormat}>
                    {endDate}
                  </Moment>
                ) : (
                  'Not Set'
                )}
              </p>
            </div>
          </div>
          <StatusBanner
            type={StatusType}
            label={pow.status}
            className={`${isAwaiting(pow.status) ? 'bg-white' : ''} ml-auto`}
          />
        </div>
      </div>
    </div>
  );
}

const Dropdown: ForwardRefRenderFunction<HTMLDivElement, { pow: POW }> = ({ pow }, ref) => {
  const { setContext } = useContext(PMStoreContext);
  const { setContext: setBidContext, selectedProjectIndex } = useContext(StoreContext);
  const { isLoading: isDeleting, load: deleteLoad } = useFetch<POW>();
  const [showModal, setModal] = useState(false);
  const [showMenu, setMenu] = useState(false);
  const { isLoading, load } = useFetch();
  const {
    register,
    handleSubmit,
    formState: { errors }
  } = useForm<{ name: string }>({
    reValidateMode: 'onChange',
    defaultValues: { name: pow.name },
    resolver: yupResolver(editPowSchema)
  });

  useEffect(() => {
    // click event that's in-charge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      // @ts-ignore
      if (e.target && e.target.contains(ref?.current)) {
        setMenu(false);
      }
    });

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setMenu(false);
      });
    };
  }, []);

  const handleDelete = () => {
    deleteLoad(deletePow(pow._id)).then((res) => {
      // 1. remove the pow reference on the bid #locally
      setBidContext((prev) => {
        const data = prev.menuProjects[selectedProjectIndex];
        const bids = data.literalBids.map((one) => {
          if (one._id !== pow.bidId) return one;
          return { ...one, pow: undefined };
        });
        const newProjects = prev.menuProjects.map((project) => {
          if (project._id === data._id) {
            return { ...project, literalBids: bids };
          } else {
            return project;
          }
        });

        return {
          ...prev,
          menuProjects: newProjects
        };
      });
      // 2. remove the POW
      setContext((prev) => ({
        ...prev,
        pows: prev.pows.filter((one) => one._id !== res.data._id)
        // tasks: { ...prev.tasks, [res.data._id]: undefined },
      }));
    });
  };

  const toggleMenu = () => {
    setMenu((prev) => !prev);
  };

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const submitHandler = handleSubmit(({ name }) => {
    load(editPow(pow._id, { name })).then(() => {
      setContext((prev) => ({
        ...prev,
        pows: prev.pows.map((one) => (one._id === pow._id ? { ...pow, name } : one))
      }));
      toggleModal();
    });
  });

  const Menu = () => (
    <div
      className={` ${
        !showMenu && 'hidden'
      } bg-white border absolute top-full right-2 shadow-lg rounded-md p-2 `}>
      <div
        onClick={toggleModal}
        className={'flex items-center group hover:bg-blue-100 p-2 rounded-md' + hoverFade}>
        <TbEdit className="text-blue-600 text-sm font-Medium" />
        <p className="text-blue-600 text-sm font-Medium ml-1">Rename</p>
      </div>
      <div
        onClick={handleDelete}
        className={'flex items-center group hover:bg-red-100 p-2 rounded-md pr-5' + hoverFade}>
        {isDeleting ? (
          <BiLoaderAlt className="text-red-600 animate-spin" />
        ) : (
          <TbTrash className="text-red-600 text-sm font-Medium" />
        )}
        <p className="text-red-600 text-sm font-Medium ml-1">Delete</p>
      </div>
    </div>
  );

  const EditModal = (
    <>
      <div className={flexer}>
        <p className="font-Medium">Edit Program of works</p>
        <button className="text-sm text-bash" onClick={toggleModal}>
          close
        </button>
      </div>
      <form onSubmit={submitHandler} className="w-full">
        <InputField label="Title" register={register('name')} error={errors.name?.message} />
        <Button text="Save" {...{ isLoading }} className="w-full" />
      </form>
    </>
  );

  return (
    <>
      <CustomModal
        className="z-20"
        containerClassName="z-20 w-11/12 md:w-1/2 lg:w-1/3"
        toggle={toggleModal}
        visible={showModal}>
        {EditModal}
      </CustomModal>
      <div className="absolute z-[5] top-8 right-4 ">
        <Menu />
        {showMenu ? (
          <AiOutlineClose onClick={toggleMenu} className={'text-bash text-sm' + hoverFade} />
        ) : (
          <TbDotsVertical onClick={toggleMenu} className={'text-bash' + hoverFade} />
        )}
      </div>
    </>
  );
};

const OpsDropdown = forwardRef<HTMLDivElement, { pow: POW }>(Dropdown);
export { getEndDateFromTaskList, getStartDateFromTaskList };
export default memo(PowCard);
