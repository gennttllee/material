import { displayError, displaySuccess } from 'Utils';
import { postForm } from 'apis/postForm';
import Button from 'components/shared/Button';
import SuperModal from 'components/shared/SuperModal';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from 'store/hooks';
import { removeCluster } from 'store/slices/clusterSlice';
import { ClusterType } from 'types';

const ClusterDeleteModal = ({ closer, cluster }: { closer: () => void; cluster?: ClusterType }) => {
  const [loading, setLoading] = useState(false);
  let navigate = useNavigate();
  let dispatch = useAppDispatch();
  const deleteCluster = async () => {
    setLoading(true);
    let { e, response } = await postForm(`delete`, `clusters/delete?clusterId=${cluster?._id}`);
    if (response) {
      navigate('/projects/all');
      displaySuccess('Cluster deleted successfully');
      dispatch(removeCluster(cluster?._id));
    } else {
      displayError('Could not delete cluster');
    }
    setLoading(false);
  };
  return (
    <SuperModal closer={closer}>
      <div className=" w-full h-full flex items-start justify-center bg-black bg-opacity-40 overflow-y-auto pb-10 ">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 w-1/2 mt-40 h- max-w-[560px]  rounded-md">
          <div className="flex items-center justify-between">
            <span className=" text-bblack-0 text-2xl font-semibold">Delete Cluster</span>
            <span className=" text-bash hover:underline cursor-pointer" onClick={closer}>
              Close
            </span>
          </div>
          <p className=" text-center text-lg my-10">
            {`Are you sure you want to delete the cluster with the name \n"${cluster?.clusterName}" ?`}
          </p>
          <div className="flex items-center justify-end gap-x-4 ">
            <Button
              disabled={loading}
              onClick={closer}
              type="plain"
              text="Cancel"
              textStyle=" text-bblack-0"
            />
            <Button
              disabled={loading}
              isLoading={loading}
              onClick={deleteCluster}
              className=" ml-2"
              type={loading ? 'muted' : 'danger'}
              text="Delete Cluster"
            />
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default ClusterDeleteModal;
