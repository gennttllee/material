import { Row } from '@tanstack/react-table';
import { PMStoreContext } from 'components/projects/management/Context';
import { ProjectTask } from 'components/projects/management/types';
import randomColor from 'randomcolor';
import React, { useContext, useMemo } from 'react';
import { useParams } from 'react-router-dom';

const DependencyColumn = (row: Row<ProjectTask>) => (
  <div className={'p-[14px] flex items-center'}>
    {React.Children.toArray(
      row.original.dependencies[0] ? (
        row.original.dependencies.map(({ _id }) => <OneDependency _id={_id} />)
      ) : (
        <span
          className={`px-2 py-1 text-xs rounded-md font-Medium bg-gray-50 text-bash mx-2 truncate text-center`}
        >
          N/A
        </span>
      )
    )}
  </div>
);

const OneDependency = ({ _id }: { _id: string }) => {
  const { powId } = useParams() as any;
  const { tasks } = useContext(PMStoreContext);
  let index = 0;

  for (let i = 0; i < tasks[powId].length; i++) {
    if (tasks[powId][i]._id === _id) {
      index = i + 1;
    }
  }

  const bg_RC = useMemo(() => randomColor({ luminosity: 'dark', alpha: 0.1 }), []);

  return (
    <div className={`px-1 relative w-7 mx-2 truncate `}>
      <p className="text-base text-black font-Medium text-center">{index}</p>
      <div
        style={{ background: bg_RC }}
        className="absolute top-0 left-0 w-full h-full rounded-md opacity-50"
      />
    </div>
  );
};

export default DependencyColumn;
