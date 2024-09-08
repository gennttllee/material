import { Row } from '@tanstack/react-table';
import { PMStoreContext } from 'components/projects/management/Context';
import { ProjectTask, TaskStatus } from 'components/projects/management/types';
import React, { useContext, useMemo } from 'react';
import { BsCheckCircle, BsCheckCircleFill, BsCircle } from 'react-icons/bs';

const SerialNumberColumn = (row: Row<ProjectTask>) => {
  const { draftsToSubmit, setContext } = useContext(PMStoreContext);
  const isDraftSelected = useMemo(() => {
    if (row.original.status !== TaskStatus.draft) return false;
    return draftsToSubmit.find((one) => one._id === row.original._id) ? true : false;
  }, [draftsToSubmit, row.original.status]);

  const handleDraftSubmit = () => {
    setContext((prev) => {
      // 1. check if the task already exists
      const exists = prev.draftsToSubmit.find((one) => one._id === row.original._id);
      // 2. define new drafts
      const newDrafts = exists
        ? prev.draftsToSubmit.filter((one) => one._id !== row.original._id) // remove task
        : [...prev.draftsToSubmit, row.original]; // add task
      return {
        ...prev,
        draftsToSubmit: newDrafts
      };
    });
  };

  return (
    <div className="px-2 py-4 group flex items-center">
      <button onClick={handleDraftSubmit} className="mx-2">
        {isDraftSelected ? (
          <BsCheckCircleFill className="text-bgreen-0 text-sm" />
        ) : row.original.status === TaskStatus.draft ? (
          <>
            <BsCheckCircle className="text-bash text-sm hidden group-hover:block" />
            <BsCircle className="text-bash text-sm group-hover:hidden" />
          </>
        ) : null}
      </button>
      <p className="text-center text-bash">{row.index + 1}</p>
    </div>
  );
};

export default SerialNumberColumn;
