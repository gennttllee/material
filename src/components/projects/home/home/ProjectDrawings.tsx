import React, { memo, useState, useEffect, useContext, useCallback } from 'react';
import Title from './Title';
import { drawings } from './constant';
import ProjectDrawing from './ProjectDrawing';
import { postForm } from '../../../../apis/postForm';
import { StoreContext } from '../../../../context';
import { LoaderX } from '../../../shared/Loader';

interface Prop {
  className?: string;
}
const findData = (str: string, x: any[]) => {
  let res = x.filter((m) => m['alias'] === str);
  return res[0];
};

const ProjectDrawings = ({ className }: Prop) => {
  const {
    activeProject: { _id: projectId }
  } = useContext(StoreContext);
  const [data, setData] = useState<any>([]);
  const [fetching, setFetching] = useState(false);

  const makeCall = useCallback(async () => {
    setFetching(true);
    let { response } = await postForm('get', `files/sort/project/${projectId}?type=all`);

    if (response) {
      setData(response?.data?.data);
    }
    setFetching(false);
  }, [projectId]);

  useEffect(() => {
    makeCall();
    //eslint-disable-next-line
  }, [projectId]);

  return (
    <div
      className={
        'w-full  flex flex-col lg:flex-row rounded-lg mt-10 bg-white p-12 py-8 ' + className
      }
    >
      <Title title="Project Drawings" description="Project type is residential" />
      {fetching ? (
        <LoaderX />
      ) : (
        <div className="flex-1 flex flex-wrap mt-4 sm:mt-0">
          {drawings.map((m, i) => (
            <ProjectDrawing
              key={i}
              data={findData(m, data)}
              label={m}
              project={projectId}
              reload={makeCall}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default memo(ProjectDrawings);
