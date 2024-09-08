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

interface AddClusterModalProps {
  closer: () => void;
}
type ClusterBuildingType = { name: string; numberOfUnits: number };

const AddClusterModal = ({ closer }: AddClusterModalProps) => {
  let dispatch = useAppDispatch();
  let { data: _clusters } = useAppSelector((m) => m.cluster);
  const [loading, setLoading] = useState(false);
  let { id } = useParams();
  //   let optionRef = useRef<any>();
  const current = useMemo(() => {
    return _clusters.find((m) => m._id === id);
  }, [id, _clusters]);
  const [data, setData] = useState<ClusterBuildingType[]>([
    {
      numberOfUnits: 0,
      name: 'Building Type A'
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

  return (
    <SuperModal closer={closer}>
      <div className=" w-full h-full flex items-start justify-center bg-black bg-opacity-40 overflow-y-auto pb-10 ">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 w-1/2 mt-40 h- max-w-[560px]  rounded-md">
          <div className="flex items-center justify-between">
            <span className=" text-bblack-0 text-2xl font-semibold">Add a Building Type</span>
            <span className=" text-bash hover:underline cursor-pointer" onClick={closer}>
              Close
            </span>
          </div>

          <div className=" mt-6 flex-col space-y-10">
            {data.map((m, i) => {
              return (
                <BuildingTypeInput
                  error={errors.types[i]}
                  key={i}
                  value={m}
                  onChange={onChange(i)}
                />
              );
            })}
          </div>
          <div className="w-full flex items-center justify-between">
            <span
              onClick={() => {
                setData([...data, { name: 'Building Type X', numberOfUnits: 0 }]);
              }}
              className="  hover:underline rounded-md hover:cursor-pointer items-center flex ">
              <TbPlus className="mr-4" /> Add Building Type
            </span>
            <span className=" flex items-center">
              <Button
                disabled={loading}
                onClick={closer}
                type="plain"
                text="Cancel"
                textStyle=" text-bblack-0"
              />
              <Button
                disabled={!ready || loading}
                isLoading={loading}
                onClick={addBuildingType}
                className=" ml-2"
                type={!ready ? 'muted' : 'primary'}
                text="Add Building type"
              />
            </span>
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default AddClusterModal;
