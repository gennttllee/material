import useFetch from 'Hooks/useFetch';
import useRole from 'Hooks/useRole';
import { activateTasks } from 'apis/tasks';
import { PMStoreContext } from 'components/projects/management/Context';
import { ProjectTask, TaskStatus } from 'components/projects/management/types';
import Button from 'components/shared/Button';
import { flexer, hoverFade } from 'constants/globalStyles';
import { useContext, useState } from 'react';
import { IoClose } from 'react-icons/io5';
import { useParams } from 'react-router-dom';

const SubmitDrafts = () => {
  const [hasSelectedAll, setSelectAll] = useState<{
    status: boolean;
    previousDrafts: ProjectTask[];
  }>({ status: false, previousDrafts: [] });
  const { isProfessional } = useRole();
  const { powId } = useParams() as { [key: string]: string };
  const { draftsToSubmit, setContext } = useContext(PMStoreContext);

  const { isLoading, load } = useFetch();

  if (!draftsToSubmit[0] || !isProfessional) return <></>;

  const handleSelectAll = () => {
    setSelectAll((prev) => ({
      status: !prev.status,
      previousDrafts: !prev.status ? draftsToSubmit : []
    }));

    setContext((prev) => ({
      ...prev,
      draftsToSubmit: hasSelectedAll.status
        ? hasSelectedAll.previousDrafts
        : prev.tasks[powId].filter((one) => one.status === TaskStatus.draft)
    }));
  };

  const handleClose = () => {
    setSelectAll({
      status: false,
      previousDrafts: []
    });

    setContext((prev) => ({
      ...prev,
      draftsToSubmit: []
    }));
  };

  const handleSubmission = () => {
    load(
      activateTasks({
        // creates an arrary of taskId
        taskInputs: draftsToSubmit.map((one) => ({ taskId: one._id }))
      })
    ).then(() => {
      // changes all the
      setContext((prev) => {
        const newTasks = [...prev.tasks[powId]].map((task) => {
          // check if a task was in drafts
          const isDraft = prev.draftsToSubmit.find((one) => one._id === task._id);
          // if the task is found, changes its status
          if (isDraft) return { ...task, status: TaskStatus.awaitingApproval };
          else return task;
        });
        return {
          ...prev,
          tasks: { ...prev.tasks, [powId]: newTasks },
          draftsToSubmit: []
        };
      });
      // unselect everything
      setSelectAll({ status: false, previousDrafts: [] });
    });
  };

  return (
    <>
      {/* Spacer */}
      <div className={'absolute z-50 bottom-0 left-0 w-full p-5 bg-ashShade-10' + flexer}>
        <div className={flexer + 'gap-4'}>
          <button onClick={handleClose}>
            <IoClose className={'text-bash' + hoverFade} />
          </button>
          <p className="text-base font-Demibold text-white">
            {draftsToSubmit.length} item selected
          </p>
        </div>
        <div className={flexer + 'gap-4'}>
          <Button
            text={hasSelectedAll.status ? 'Unselect all' : 'Select all'}
            className="border-none hover:!bg-transparent"
            textStyle="text-white underline"
            onClick={handleSelectAll}
            type="transparent"
          />
          <Button
            type="secondary"
            isLoading={isLoading}
            onClick={handleSubmission}
            className="border-white group"
            textStyle="text-white group-hover:!text-black"
            text="Submit Drafts"
          />
        </div>
      </div>
    </>
  );
};

export default SubmitDrafts;
