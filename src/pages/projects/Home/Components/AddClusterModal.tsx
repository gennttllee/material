import React, { useMemo, useState } from 'react';
import SuperModal from 'components/shared/SuperModal';
import InputField from 'components/shared/InputField';
import { TbPlus } from 'react-icons/tb';
import Button from 'components/shared/Button';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { loadClusters } from 'store/slices/clusterSlice';

interface AddClusterModalProps {
  closer: () => void;
}
type ClusterBuildingType = { name: string; numberOfUnits: number };

const AddClusterModal = ({ closer }: AddClusterModalProps) => {
  let dispatch = useAppDispatch();
  let clusters = useAppSelector((m) => m.cluster);
  const [loading, setLoading] = useState(false);
  const [title, setTitle] = useState<string>('');
  const [data, setData] = useState<ClusterBuildingType[]>([
    {
      numberOfUnits: 0,
      name: 'Building Type A'
    }
  ]);

  const errors = useMemo(() => {
    let _data = title ? '' : 'Please enter cluster name';
    let _types = data.map((m) => {
      let titleError = '';
      let numberOfUnitsError = '';
      if (!m.name) titleError = 'Please enter building Type';
      if (!m.numberOfUnits || m.numberOfUnits === 0)
        numberOfUnitsError = 'Please enter number of Units';
      return { name: titleError, numberOfUnits: numberOfUnitsError };
    });
    return {
      title: _data,
      types: _types
    };
  }, [title, data]);

  const onChange = (idx: number) => (val: ClusterBuildingType) => {
    let _data = [...data];
    _data[idx] = val;
    setData(_data);
  };
  const checkforErrors = () => {
    let _title = false;
    let _list = false;
    if (errors.title) return true;
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

  const createCluster = async () => {
    setLoading(true);
    if (!ready) return;
    let { e, response } = await postForm('post', 'clusters/create', {
      clusterName: title,
      types: data
    });
    if (response) {
      dispatch(loadClusters({ loading: false, data: [...clusters.data, response.data.data] }));
      displaySuccess('Cluster created Successfully');
      closer();
    } else displayError(e?.message || e?.response?.message);
    setLoading(false);
  };

  return (
    <SuperModal closer={closer}>
      <div className=" w-full h-full flex items-start justify-center bg-black bg-opacity-40 overflow-y-auto">
        <div
          onClick={(e) => e.stopPropagation()}
          className="bg-white p-6 w-1/2 mt-40 h- max-w-[560px]  rounded-md">
          <div className="flex items-center justify-between">
            <span className=" text-bblack-0 text-2xl font-semibold">Create a Cluster</span>
            <span className=" text-bash hover:underline cursor-pointer" onClick={closer}>
              Close
            </span>
          </div>
          <InputField
            error={errors.title}
            label="Cluster Name"
            value={title}
            placeholder="Enter cluster name"
            onChange={(e) => {
              setTitle(e.target.value);
            }}
            className="text-xl"
          />
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
                onClick={createCluster}
                className=" ml-2"
                type={!ready ? 'muted' : 'primary'}
                text="Create Cluster"
              />
            </span>
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

const BuildingTypeInput = ({
  onChange,
  value,
  error,
  classes
}: {
  onChange: (x: ClusterBuildingType) => void;
  value: ClusterBuildingType;
  error?: { name: string; numberOfUnits: string };
  classes?: string;
}) => {
  console.log(error);
  return (
    <div className={classes}>
      <InputField
        error={error?.name}
        onChange={(e) => {
          onChange({ ...value, name: e.target.value });
        }}
        label="Building Type"
        className=" text-xl outline-none "
        type="text"
        value={value.name}
        placeholder="Building Type X"
      />
      <InputField
        placeholder="10"
        error={error?.numberOfUnits}
        onChange={(e) => {
          onChange({ ...value, numberOfUnits: parseInt(e.target.value || '0') });
        }}
        value={value.numberOfUnits.toString()}
        type="number"
        label="Number of Units"
      />
    </div>
  );
};
export { BuildingTypeInput };
export default AddClusterModal;
