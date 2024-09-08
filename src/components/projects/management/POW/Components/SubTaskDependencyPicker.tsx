import React, { useContext, useEffect, useMemo, useState } from 'react';
import { BsChevronDown } from 'react-icons/bs';
import { IoIosClose, IoMdAdd } from 'react-icons/io';
import { ProjectTask, SubTask } from '../../types';
import { flexer, hoverFade } from '../../../../../constants/globalStyles';
import { PMStoreContext } from '../../Context';
import { useParams } from 'react-router-dom';
import { AddPredecessorModal } from './AddPredecessorModal';
import Modal from 'components/shared/Modal';

export type DependecyItem = { label: string; value: ProjectTask };
export type Dependecy = { label: string; value: SubTask };

interface Props {
  onChange: (vl: string[]) => void;
  dependenciesToIgnore: string[];
  disabledOption?: string;
  initialValue?: string[];
}

const SubTaskDependencyPicker = ({
  onChange,
  initialValue,
  disabledOption,
  dependenciesToIgnore
}: Props) => {
  const container = React.useRef<HTMLDivElement>(null);
  const [dependencies, setDependencies] = useState<SubTask[]>([]);
  const { powId } = useParams() as { powId: string };
  const { tasks: data } = useContext(PMStoreContext);
  const [showModal, setModal] = useState(false);
  const [showAddPredecessorModal, setShowAddPredecessorModal] = useState<boolean>(false);

  useEffect(() => {
    if (initialValue) {
      const init: SubTask[] = [];

      for (let task of data[powId]) {
        for (let subT of task.subTasks) {
          /**
           * look up all subtask depenecies
           * because we only store subT (subtask's) ids
           */
          const exist = initialValue.find((one) => one === subT._id);
          if (exist) {
            init.push(subT);
          }
        }
      }

      setDependencies(init);
    }
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
    if (dependencies) onChange(dependencies.map((one) => one._id));
  }, [dependencies, onChange]);

  const activeDependencies = useMemo(() => dependencies.map((one) => one._id), [dependencies]);

  const toggleModal = () => {
    setModal((prev) => !prev);
  };

  const toggleAddPredecessorModal = () => {
    setShowAddPredecessorModal((prev) => !prev);
  };
  const openAddPredecessorModal = () => {
    setShowAddPredecessorModal(true);
  };
  const closeAddPredecessorModal = () => {
    setShowAddPredecessorModal(false);
  };

  const handleRemove = (id: string) => {
    setDependencies((prev) => prev.filter((one) => one._id !== id));
  };

  const handleAdd = (item: SubTask) => {
    // check if doesn't already exist
    const exists = dependencies.find((one) => one._id === item._id);
    // only add if it doesn;t exist
    if (!exists) setDependencies((prev) => [...prev, item]);
  };

  return (
    <div className="w-full picker flex my-3 relative flex-col " ref={container}>
      <label className="font-Medium text-bash text-sm">Predecessor</label>
      <div
        className={
          flexer +
          `p-2 picker relative overflow-hidden cursor-pointer border border-bash rounded-md mt-1`
        }>
        <div className="flex-1 picker flex items-center overflow-x-scroll">
          {dependencies && dependencies[0] ? (
            React.Children.toArray(
              dependencies.map((one) => (
                <div
                  className={
                    flexer +
                    'px-2 py-1 picker bg-gray-200 rounded-md mr-2 !min-w-fit max-w-[150px] overflow-hidden cursor-pointer' +
                    hoverFade
                  }
                  onClick={() => handleRemove(one._id)}>
                  <p className="text-black picker text-sm flex-1 truncate font-Medium capitalize">
                    {one.name}
                  </p>
                  <IoIosClose className="text-black picker text-lg" />
                </div>
              ))
            )
          ) : (
            <div
              className="flex justify-center items-center gap-2 bg-ashShade-0 p-2 w-full rounded-md picker cursor-pointer"
              onClick={toggleAddPredecessorModal}>
              <button
                className="text-blueShades-3 picker font-medium cursor-pointer font-satoshi text-base"
                onClick={openAddPredecessorModal}>
                Add predecessor
              </button>
              <IoMdAdd
                size={16}
                onClick={openAddPredecessorModal}
                className="text-blueShades-3 picker transform transition-all"
              />
            </div>
          )}
          <Modal
            visible={showAddPredecessorModal}
            toggle={toggleAddPredecessorModal}
            overlayClassName="opacity-50 backdrop-blur-0"
            className="backdrop-blur-0 drop-shadow-lg">
            <AddPredecessorModal onCloseModal={closeAddPredecessorModal} />
          </Modal>
        </div>
      </div>

      <div
        className={`${
          !showModal && 'hidden'
        } picker absolute w-full top-full left-0 z-20 rounded-md max-h-40 overflow-y-scroll shadow-lg p-3 bg-white`}>
        {
          // creating unique keys
          React.Children.toArray(
            data[powId] &&
              data[powId].map((task) => (
                <TaskGroup
                  {...{
                    task,
                    disabledOption,
                    dependenciesToIgnore,
                    handleAdd,
                    activeDependencies,
                    handleRemove
                  }}
                />
              ))
          )
        }
      </div>
    </div>
  );
};

const TaskGroup = ({
  dependenciesToIgnore,
  activeDependencies,
  disabledOption,
  handleRemove,
  handleAdd,
  task
}: {
  handleAdd: (vl: SubTask) => void;
  handleRemove: (id: string) => void;
  dependenciesToIgnore: string[];
  activeDependencies: string[];
  disabledOption?: string;
  task: ProjectTask;
}) => {
  const [showSubTasks, setShowSubtasks] = useState(true);
  const toggleSubTasks = () => {
    setShowSubtasks((prev) => !prev);
  };
  const subTasks = useMemo(() => {
    return task.subTasks
      .filter((one) => one._id !== disabledOption)
      .filter((one) => {
        // check if a subtask should be ignored and remove it
        return !dependenciesToIgnore.includes(one._id);
      });
  }, [task.subTasks]);

  return (
    <>
      <div className={flexer + 'picker'} onClick={toggleSubTasks}>
        <p className="px-4 picker capitalize py-2 rounded-md w-full text-blac font-Medium">
          {task.name}
        </p>
        <BsChevronDown
          className={`transform picker ${
            showSubTasks ? '' : 'rotate-180'
          } text-sm text-bash ${hoverFade}`}
        />
      </div>
      <div
        className={`w-full ${
          !showSubTasks ? 'zero-height  overflow-hidden' : 'auto-height  overflow-y-scroll'
        } `}>
        {React.Children.toArray(
          subTasks[0] ? (
            subTasks.map((subtask, index) => (
              <SubtaskListItem
                {...{ subtask, activeDependencies, handleAdd, handleRemove, index }}
              />
            ))
          ) : (
            <p className="px-4 picker capitalize py-2 rounded-md w-full cursor-pointer text-bash">
              No choices available
            </p>
          )
        )}
      </div>
    </>
  );
};

const SubtaskListItem = ({
  index,
  subtask,
  handleAdd,
  handleRemove,
  activeDependencies
}: {
  index: number;
  subtask: SubTask;
  activeDependencies: string[];
  handleAdd: (vl: SubTask) => void;
  handleRemove: (id: string) => void;
}) => {
  const isActive = useMemo(
    () => !!activeDependencies.find((one) => one === subtask._id),
    [activeDependencies]
  );
  return (
    <button
      type="button"
      className={`picker w-full px-4 rounded-lg border border-white ${
        isActive && 'bg-gray-100 text-gray-900'
      } ${flexer} hover:bg-blue-100 hover:text-bblue hover:font-Medium text-bash`}
      onClick={() => {
        if (isActive) handleRemove(subtask._id);
        else handleAdd(subtask);
      }}>
      <p
        className={` flex-1 picker text-left capitalize py-2 rounded-md w-full cursor-pointer  ${
          index ? null : 'mt-1'
        } `}>
        {subtask.name}
      </p>
      {isActive ? <p className="text-black font-semibold text-sm">Remove</p> : null}
    </button>
  );
};

export default SubTaskDependencyPicker;
