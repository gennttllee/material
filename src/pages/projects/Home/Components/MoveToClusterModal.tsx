import React, { useMemo, useState } from 'react';
import SuperModal from 'components/shared/SuperModal';
import InputField from 'components/shared/InputField';
import { TbPlus } from 'react-icons/tb';
import Button from 'components/shared/Button';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { loadClusters, updateCluster } from 'store/slices/clusterSlice';
import useProjects from 'Hooks/useProjects';

interface MoveToClusterModalProps {
  projectId: string;
  closer: () => void;
}
type ClusterBuildingType = { name: string; numberOfUnits: number };

const MoveToClusterModal = ({ closer, projectId }: MoveToClusterModalProps) => {
  let dispatch = useAppDispatch();
  let clusters = useAppSelector((m) => m.cluster);
  const [loading, setLoading] = useState(false);
  const [cluster, setCluster] = useState<string>('');
  let { fetchProjects } = useProjects();
  const addProjectsToCluster = async () => {
    setLoading(true);
    let { e, response } = await postForm('post', 'clusters/add-project', {
      clusterId: cluster,
      projects: [{ projectId }]
    });

    if (e) {
      displayError('Could not add projects to cluster');
    } else {
      let current = clusters.data.find((m) => m._id === cluster);
      let newCurrent = { ...current };
      let currentProjects = newCurrent?.projects || [];
      newCurrent.projects = [...currentProjects, projectId];
      dispatch(updateCluster(newCurrent));
      displaySuccess('Projects added to cluster successfully');
      fetchProjects();
      closer();
    }

    setLoading(false);
  };

  return (
    <SuperModal closer={closer}>
      <div className=" w-full h-full flex items-start justify-center bg-black bg-opacity-40 overflow-y-auto">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6  mt-40  max-w-[560px]  rounded-md">
          <div className="flex items-center justify-between">
            <span className=" text-bblack-0 text-2xl font-semibold">Select Cluster</span>
            <span className=" text-bash hover:underline cursor-pointer" onClick={closer}>
              Close
            </span>
          </div>

          <div className="w-full my-6 max-h-[200px] gap-y-2 overflow-y-auto ">
            {clusters.data.map((m) => {
              let selected = useMemo(() => {
                return cluster === m._id;
              }, [cluster]);
              return (
                <div
                  onClick={() => {
                    setCluster(m._id);
                  }}
                  key={m._id}
                  className=" flex items-center  cursor-pointer">
                  <span
                    className={` mr-2 rounded-full flex items-center justify-center p-1 border-2  ${
                      selected ? ' border-bblue ' : ' border-bash '
                    }`}>
                    {
                      <span
                        className={` bg-bblue w-2 h-2 rounded-full ${
                          !selected ? 'invisible' : 'visible'
                        }`}></span>
                    }
                  </span>
                  <span>{m.clusterName}</span>
                </div>
              );
            })}
          </div>

          <div className="w-full flex  items-center justify-between">
            <span className=" flex items-center">
              <Button
                disabled={loading}
                onClick={closer}
                type="plain"
                text="Cancel"
                textStyle=" text-bblack-0"
              />
              <Button
                disabled={!cluster || loading}
                isLoading={loading}
                onClick={addProjectsToCluster}
                className=" ml-2"
                type={!cluster ? 'muted' : 'primary'}
                text="Add to Cluster"
              />
            </span>
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default MoveToClusterModal;
