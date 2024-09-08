import React, { useEffect, useMemo, useState } from 'react';
import { useContext } from 'react';
import { BsChevronUp } from 'react-icons/bs';
import { IoIosClose } from 'react-icons/io';
import { ProjectTask } from '../../types';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import { PMStoreContext } from '../../Context';
import { useParams } from 'react-router-dom';

interface Props {
  onChange: (vl: string[]) => void;
  initialValue?: ProjectTask[];
  dependenciesToIgnore: string[];
}

const TaskDependencyPicker = ({ onChange, initialValue, dependenciesToIgnore }: Props) => {
  const { powId } = useParams() as { powId: string };
  const container = React.useRef<HTMLDivElement>(null);
  const { tasks: data, activeTask } = useContext(PMStoreContext);
  const [dependencies, setDependencies] = useState<ProjectTask[]>([]);
  const [showModal, setModal] = useState(false);

  useEffect(() => {
    if (initialValue) setDependencies(initialValue);
  }, [initialValue]);

  useEffect(() => {
    // clicke event that's incharge of
    // closing the modal
    document.addEventListener('click', (e: any) => {
      if (
        e.target &&
        (e.target.contains(container.current) || !e.target.classList.contains('picker'))
      ) {
        setModal(false);
      }
    });

    return () => {
      // clear the event
      document.removeEventListener('click', () => {
        setModal(false);
      });
    };
  }, []);

  useEffect(() => {
    if (dependencies || initialValue) {
      onChange(dependencies.map((one) => one._id));
    }
  }, [dependencies, onChange, initialValue]);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const handleRemove = (task: ProjectTask) => {
    setDependencies((prev) => prev.filter((one) => one._id !== task._id));
  };

  const handleAdd = (item: ProjectTask) => {
    // check if doesn't already exist
    const exists = dependencies.find((one) => one._id === item._id);
    // only add if it doesn;t exist
    if (!exists) setDependencies((prev) => [...prev, item]);
  };

  const tasks = useMemo(() => {
    return (() => {
      /**
       * this prevents a task from using itself
       * as a dependecy
       */
      return data[powId]
        ? activeTask && data[powId][0]
          ? data[powId].filter((one) => one._id !== activeTask._id)
          : data[powId]
        : [];
    })().filter((one) => {
      // check if a subtask should be ignored and remove it
      return !dependenciesToIgnore.includes(one._id);
    });
  }, [data, powId]);

  return (
    <div className="w-full picker flex my-3 relative flex-col " ref={container}>
      <label className="font-Medium text-bash text-sm">Predecessor</label>
      <div
        className={flexer + `p-2 cursor-pointer border border-bash rounded-md mt-1`}
        onClick={toggleModal}
      >
        <div className="flex-1 picker flex items-center overflow-x-scroll">
          {dependencies && dependencies[0] ? (
            React.Children.toArray(
              dependencies.map((one) => (
                <div
                  className={
                    flexer +
                    'px-2 py-1 picker bg-gray-200 rounded-md mr-2 max-w-[150px] overflow-hidden cursor-pointer' +
                    hoverFade
                  }
                  onClick={() => handleRemove(one)}
                >
                  <p className="picker text-black text-sm flex-1 truncate font-Medium capitalize">
                    {one.name}
                  </p>
                  <IoIosClose className="text-black text-lg picker" />
                </div>
              ))
            )
          ) : (
            <label className="text-bash picker font-Medium p-1 text-sm">Select a predecessor</label>
          )}
        </div>
        <BsChevronUp
          className={`text-bash ml-auto picker transform transition-all ${
            !showModal && 'rotate-180'
          }`}
        />
      </div>

      <div
        className={`${
          !showModal && 'hidden'
        } absolute picker w-full top-full left-0 z-20 rounded-md max-h-40 overflow-y-scroll shadow-lg p-3 bg-white`}
      >
        {
          // creating unique keys
          React.Children.toArray(
            tasks[0] ? (
              tasks.map((one, index) => (
                <p
                  className={`px-5 picker capitalize py-1 rounded-md w-full cursor-pointer text-bash hover:bg-blue-100 hover:text-bblue ${
                    index ? null : 'mt-1'
                  } `}
                  onClick={() => handleAdd(one)}
                >
                  {one.name}
                </p>
              ))
            ) : (
              <p className="px-5 picker capitalize py-1 rounded-md w-full cursor-pointer text-bash">
                No choices available
              </p>
            )
          )
        }
      </div>
    </div>
  );
};

export default TaskDependencyPicker;
