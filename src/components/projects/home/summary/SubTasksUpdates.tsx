import { postForm } from 'apis/postForm';
import { SubTask, SubTaskStatus } from 'components/projects/management/types';
import { LoaderX } from 'components/shared/Loader';
import { StoreContext } from 'context';
import React, { useContext, useEffect, useMemo, useState } from 'react';
import { getDateFormat } from './Tasks';
import { differenceInDays } from 'date-fns';
import SuperModal from 'components/shared/SuperModal';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { loadSubTasks } from 'store/slices/subTasks';
import useOverdueSubtasks from './useOverdueSubtasks';

function SubTasksUpdates() {
  const { activeProject } = useContext(StoreContext);
  // const [list, setList] = useState<SubTask[]>([]);
  let { loading, data } = useAppSelector((m) => m.subTask);
  const [modal, setModal] = useState(false);
  let dispatch = useAppDispatch();

  const closer = () => {
    setModal(!modal);
  };
  if (!loading && data.length < 1) {
    return null;
  }

  return (
    <>
      {modal && (
        <SuperModal classes=" bg-black bg-opacity-70 flex flex-col items-center " closer={closer}>
          <div
            onClick={(e) => e.stopPropagation()}
            className="bg-white p-6 mt-20 rounded-md w-3/4  sm:w-2/3 lg:w-1/2  ">
            <div className=" flex items-center justify-between ">
              <p className=" text-bblack-0 font-semibold text-lg ">Subtasks behind schedule</p>
              <span onClick={closer} className=" text-bash text-sm font-semibold cursor-pointer  ">
                Close
              </span>
            </div>

            <div className=" max-h-[700px] overflow-y-auto mt-4 scrollbar-thin">
              {
                <div className=" w-full flex flex-col gap-y-3   ">
                  {data.map((m) => (
                    <SubTaskItem className=" border !p-4 " subtask={m} key={m._id} />
                  ))}
                </div>
              }
            </div>
          </div>
        </SuperModal>
      )}
      <div className={`w-full bg-lightblue h-full flex flex-col max-h-full rounded-lg p-5 `}>
        <div className=" flex items-center justify-between">
          <span className=" font-semibold">Sub tasks behind schedule {`(${data.length})`} </span>
          <span onClick={closer} className=" hover:cursor-pointer hover:underline text-borange ">
            View All
          </span>
        </div>
        <div className=" mt-2 flex-1 relative   rounded-md overflow-y-auto scrollbar-thin ">
          <div className="absolute top-0 left-0 w-full h-full max-h-full  overflow-y-auto scrollbar-thin">
            {loading ? (
              <div className="w-full  flex items-center justify-center p-5">
                <LoaderX />
              </div>
            ) : (
              <div className=" w-full flex flex-col gap-y-3   ">
                {data.slice(0, 2).map((m) => (
                  <SubTaskItem subtask={m} key={m._id} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}

interface SubTaskItemProps {
  className?: string;
  subtask: SubTask;
}
function SubTaskItem({ className, subtask }: SubTaskItemProps) {
  let days = differenceInDays(new Date(), new Date(subtask.endDate));
  const _date = useMemo(() => {
    let start = subtask.startDate.value as unknown as string;
    let end = subtask.endDate as unknown as string;
    let notStarted = [SubTaskStatus.awaitingApproval, SubTaskStatus.notStarted].includes(
      subtask.status
    );

    let days = differenceInDays(new Date(), new Date(notStarted ? start : end));

    let date = getDateFormat(notStarted ? start : end);

    return { notStarted, days, date };
  }, []);
  return (
    <div
      className={` w-full flex items-end justify-between rounded-md py-2 px-3 bg-white ${className}`}>
      <div className="w-4/5">
        <p className=" underline text-bblue  truncate  ">{subtask.name}</p>

        <p className=" text-xs mt-1 font-semibold ">
          {`${_date.notStarted ? 'Start' : 'End'}`} date
        </p>
        <p className=" text-xs  text-bash font-semibold ">{_date.date}</p>
      </div>

      <span className=" text-xs bg-redShades-2 text-white py-1 px-2 rounded-full ">{`${_date.days} days`}</span>
    </div>
  );
}

export default SubTasksUpdates;
