import React, { useMemo, useState } from 'react';
import SuperModal from 'components/shared/SuperModal';
import InputField from 'components/shared/InputField';
import { TbPlus } from 'react-icons/tb';
import Button from 'components/shared/Button';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { loadClusters, updateCluster } from 'store/slices/clusterSlice';
import { BuildingTypeInput } from '../Home/Components/AddClusterModal';
import { useParams } from 'react-router-dom';
import { FaCircleExclamation } from 'react-icons/fa6';
import { AiOutlineClose } from 'react-icons/ai';

interface DeleteBuildingTypeModalProps {
  closer: () => void;
  details: {
    _id: string;
    name: string;
    numberOfUnits: number;
  };
}
type ClusterBuildingType = { name: string; numberOfUnits: number };

const DeleteBuildingTypeModal = ({ closer, details }: DeleteBuildingTypeModalProps) => {
  let dispatch = useAppDispatch();
  let { data: _clusters } = useAppSelector((m) => m.cluster);
  const [loading, setLoading] = useState(false);
  let { id } = useParams();

  const current = useMemo(() => {
    return _clusters.find((m) => m._id === id);
  }, [id, _clusters]);
  const [data, setData] = useState<ClusterBuildingType[]>([
    {
      numberOfUnits: details.numberOfUnits,
      name: details.name
    }
  ]);

  const errors = useMemo(() => {
    let _types = data.map((m) => {
      let titleError = '';
      let numberOfUnitsError = '';
      if (!m.name) titleError = 'Please enter building Type';
      if (!m.numberOfUnits || m.numberOfUnits === 0)
        numberOfUnitsError = 'Please enter number of Units';
      return { name: titleError, numberOfUnits: numberOfUnitsError };
    });
    return {
      types: _types
    };
  }, [data]);

  const onChange = (idx: number) => (val: ClusterBuildingType) => {
    let _data = [...data];
    _data[idx] = val;
    setData(_data);
  };
  const checkforErrors = () => {
    let _title = false;
    let _list = false;
    if (errors.types) {
      errors.types.forEach((element) => {
        if (element.name || element.numberOfUnits) _list = true;
      });
    }
    return _title || _list;
  };

  const ready = useMemo(() => {
    return !checkforErrors();
  }, [errors]);

  const addBuildingType = async () => {
    setLoading(true);
    if (!ready) return;
    let { e, response } = await postForm('patch', 'clusters/add-building-type', {
      clusterId: current?._id,
      types: data
    });
    if (response) {
      dispatch(updateCluster(response.data.data));
      displaySuccess('Building type created');
      closer();
    } else displayError(e?.message || e?.response?.message);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!loading) {
      setLoading(true);
      let { e, response } = await postForm('patch', `clusters/delete-type?typeId=${details._id}`);
      if (e) {
        displayError('Cannot delete cluster type');
      } else {
        displaySuccess('Cluster Building Type deleted successfully');
        dispatch(updateCluster(response.data.data));
        closer();
      }
      setLoading(false);
    }
  };

  return (
    <SuperModal closer={closer}>
      <div className=" w-full h-full flex items-start justify-center bg-black bg-opacity-40 overflow-y-auto pb-10 ">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6  mt-40 h- max-w-[560px]  rounded-md">
          <div className="flex items-center justify-between">
            <span className=" text-bblack-0 text-2xl font-semibold flex items-center">
              <FaCircleExclamation color="#B63434" className=" mr-3" /> Delete Building Type
            </span>
            <span
              className=" p-2 hover:bg-ashShade-0 rounded-full hover:underline cursor-pointer"
              onClick={closer}>
              <AiOutlineClose color="#9099A8" />
            </span>
          </div>

          <p className=" my-7 text-center">
            Are you sure you want to delete this building type? <br /> You cannot undo this.
          </p>
          <div className="w-full flex items-center gap-x-4 justify-between">
            <Button
              className=" flex-1"
              disabled={loading}
              onClick={closer}
              type="plain"
              text="Cancel"
              textStyle=" text-bblack-0"
            />
            <Button
              disabled={loading}
              isLoading={loading}
              onClick={handleDelete}
              className=" flex-1"
              type={'danger'}
              text="Delete"
            />
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default DeleteBuildingTypeModal;
