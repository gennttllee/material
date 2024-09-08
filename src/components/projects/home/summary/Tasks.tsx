import useProjectTasks, { SubTaskType, TaskType } from 'Hooks/useProjectTasks';
import NoContent from 'components/projects/photos/NoContent';
import { LoaderX } from 'components/shared/Loader';
import { centered } from 'constants/globalStyles';
import React, { useEffect, useMemo, useState } from 'react';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { NoContentDashBoard } from '.';
import { differenceInDays } from 'date-fns';
import projectbrief from 'components/projectbrief';
import { SubTask } from 'components/projects/management/types';

let tabs = ['Summary', 'Not Started', 'In Progress', 'Completed'];
const getColor = (percent: number) => {
  return percent <= 0.4 ? 'bg-bred' : percent <= 0.9 ? 'bg-byellow-1' : ' bg-bgreen-0';
};

const getColorHex = (percent: number) => {
  return percent <= 0.4 ? '#A7194B' : percent <= 0.9 ? 'yellow' : ' #459A33';
};

let statusMap: {
  [key: string]: string[];
} = {
  'Not Started': ['Not started', 'Awaiting Approval'],
  'In Progress': ['In progress'],
  Completed: ['Completed', 'Verified']
};
const Tasks = () => {
  const [active, setActive] = useState('Summary');
  let { tasks, loading } = useProjectTasks();

  let filtered = useMemo(() => {
    return tasks.filter((m) => {
      if (active === 'Summary') return true;
      let isOneApproved = m?.subTasks.find(
        (m) => m.status.toLowerCase() !== 'Awaiting Approval'.toLowerCase()
      );
      return (
        statusMap[active].map((m) => m.toLowerCase()).includes(m.status.toLowerCase()) &&
        isOneApproved
      );
    });
  }, [tasks, active]);

  return (
    <div className="flex-1 rounded-md lg:h-full   flex flex-col bg-white px-4 py-6">
      <p className=" text-bblack-0 text-2xl font-semibold">Task</p>
      <div className="border-b-pbg mt-4 mb-4 hover:cursor-pointer  gap-6 flex items-center">
        {tabs.map((m, i) => (
          <span
            className={`pb-2 border-b ${
              active === m ? ' text-bblue border-b-bblue' : 'border-b-transparent'
            }`}
            onClick={() => setActive(m)}
            key={i}>
            {m}
          </span>
        ))}
      </div>

      <div className=" overflow-y-auto flex-col ">
        {loading ? (
          <div className={centered + ' w-full h-full'}>
            <div className=" border-4 h-10 w-10 border-t-transparent rounded-full border-x-bblue border-b-bblue animate-spin"></div>
          </div>
        ) : active === 'Summary' ? (
          <Summary tasks={tasks} />
        ) : (
          <div className="flex-1 overflow-y-auto flex flex-col gap-4 max-h-[400px] scrollbar-thin   ">
            {filtered.length > 0 ? (
              filtered.map((m, i) => <Task {...m} key={i} />)
            ) : (
              <NoContentDashBoard
                imageClass="w-1/3"
                titleClass="font-semibold"
                containerClass=" flex flex-col items-center "
                title="No Tasks found in this category"
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
};

const Task = ({ name, subTasks, startDate, endDate, status }: TaskType) => {
  let completed = subTasks.filter((m) =>
    statusMap.Completed.map((m) => m.toLowerCase()).includes(m.status.toLowerCase())
  ).length;

  return (
    <div className="w-full py-3 px-4 bg-ashShade-3 rounded-md ">
      <p className="text-bblack-1 text-xl font-semibold">{name}</p>
      <div className="flex items-center justify-between mt-2.5 ">
        <div className="flex items-center gap-2">
          <div>
            <p className="text-sm">Start Date</p>
            <p className="text-bash text-sm">
              {startDate?.slice(0, 10).split('-').reverse().join('/') || 'nil'}
            </p>
          </div>
          <div>
            <p className="text-sm">End Date</p>
            <p className="text-bash text-sm">
              {endDate?.slice(0, 10).split('-').reverse().join('/') || 'nil'}
            </p>
          </div>
        </div>
        <div className="w-1/2">
          <div className="flex items-center justify-between w-full">
            <span className="text-bblack-1 font-medium">
              {completed}/
              {
                subTasks.filter((m) => m.status.toLowerCase() !== 'Awaiting Approval'.toLowerCase())
                  .length
              }
            </span>
            <span className="text-bash">{status}</span>
          </div>

          <div className="bg-white h-2 w-full mt-1 rounded-full overflow-hidden">
            <div
              style={{
                width: `${subTasks.length === 0 ? 0 : (completed / subTasks.length) * 100}%`
              }}
              className={`${getColor(completed / subTasks.length)} h-full rounded-full`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

interface SummaryProps {
  tasks: TaskType[];
}

const getDateFormat = (date: string | number = '') => {
  let dateStr = new Date(date).toDateString().split(' ');
  return `${dateStr[2]} ${dateStr[1]}, ${dateStr[3]}`;
};
const Summary = ({ tasks }: SummaryProps) => {
  const subTasks = useMemo(() => {
    let subs: SubTaskType[] = [];

    for (let task of tasks) {
      if (task.subTasks && task.subTasks.length > 0) {
        let _subs = task.subTasks.filter(
          (m) => m.status.toLowerCase() !== 'Awaiting Approval'.toLowerCase()
        );
        subs = [...subs, ..._subs];
      }
    }

    let completed = subs.filter((m) =>
      statusMap.Completed.map((m) => m.toLowerCase()).includes(m.status.toLowerCase())
    ).length;

    return { subs, completed };
  }, [tasks]);

  let value = useMemo(
    () => (subTasks.subs.length === 0 ? 0 : subTasks.completed / subTasks.subs.length),
    [subTasks]
  );
  let getEndDate = () => {
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

    let dateStr = new Date(max).toDateString().split(' ');
    return {
      date: max === 0 ? 'No set date yet' : `${dateStr[2]} ${dateStr[1]}, ${dateStr[3]}`,
      value: max
    };
  };

  const projectEndDate = useMemo(() => {
    if (value === 1) {
      let finalDate = 0;

      for (let task of tasks) {
        //  finalDate = Math.max(new Date(x.endDate).getTime(), finalDate);

        if (task?.subTasks && task.subTasks.length > 0) {
          for (let sub of task.subTasks) {
            if (sub?.status.toLowerCase() !== 'Awaiting Approval'.toLowerCase()) {
              finalDate = Math.max(new Date(sub.endDate).getTime(), finalDate);
            }
          }
        }
      }
      let diff = differenceInDays(new Date(finalDate), new Date(getEndDate().value));
      return {
        finalDate,
        diff: diff > 0 ? `+${diff} days` : diff === 0 ? undefined : `${diff} days`
      };
    }
  }, [tasks]);

  return (
    <div className=" flex-1 flex-col">
      <div className=" mt-5 flex items-center flex-col ">
        <div className=" w-32 h-32 font-semibold">
          <CircularProgressbar
            strokeWidth={10}
            text={`${Math.round(value * 100)}%`}
            value={value * 100}
            styles={buildStyles({
              rotation: 0.0,
              strokeLinecap: 'round',
              textSize: '24px',
              pathTransitionDuration: 10,
              pathColor: `#459A33`,
              textColor: '#437ADB',
              trailColor: '#d6d6d6',
              backgroundColor: '#3e98c7'
            })}
          />
        </div>
        <p className="text-center  mt-2">Total Completion</p>
      </div>
      <div className=" flex items-center gap-x-10 mt-2 flex-wrap">
        <div className="text-sm ">
          <p className="text-bash">Estimated completion Date:</p>
          <p className="text-fblack-1 mt-1.5 font-medium">{getEndDate().date}</p>
        </div>

        {value === 1 && (
          <div className="text-sm  ">
            <p className="text-bash">Completion Date:</p>
            <p className="text-fblack-1 mt-1.5 flex items-center font-medium">
              {getDateFormat(projectEndDate?.finalDate)}{' '}
              {projectEndDate?.diff && (
                <span
                  className={` ${
                    projectEndDate?.diff[0] === '-' ? ' text-bgreen-0 ' : ' text-bred'
                  } ml-2 text-xs font-semibold `}>
                  {projectEndDate?.diff}
                </span>
              )}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export { getDateFormat };
export default Tasks;
