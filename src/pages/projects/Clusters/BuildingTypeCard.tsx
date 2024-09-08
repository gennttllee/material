import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import Button from 'components/shared/Button';
import React, { useMemo, useRef, useState } from 'react';
import { FaEllipsis, FaEllipsisVertical } from 'react-icons/fa6';
import { TbEdit, TbHome, TbPlus, TbTrash } from 'react-icons/tb';
import { IoOptionsOutline } from 'react-icons/io5';
import { ClusterTypes } from 'types';
import { LoaderX } from 'components/shared/Loader';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { loadClusters, updateCluster } from 'store/slices/clusterSlice';
import { BuildingTypeInput } from '../Home/Components/AddClusterModal';
import { useNavigate, useParams } from 'react-router-dom';
import EditBuildingTypeModal from './EditBuildingTypeModal';
import DeleteBuildingTypeModal from './DeleteBuildingTypeModal';
import { number } from 'yup';

const BuildingTypeCard = ({ name, numberOfUnits, _id, status }: ClusterTypes) => {
  const [options, setOptions] = useState(false);
  let dispatch = useAppDispatch();
  let optionRef = useRef<any>();
  useClickOutSideComponent(optionRef, () => {
    setOptions(false);
  });
  const [loading, setLoading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [editing, setEditing] = useState(false);
  const [details, setDetails] = useState({ name, numberOfUnits });
  let { data, loading: clusterLoading } = useAppSelector((m) => m.cluster);
  let navigate = useNavigate();
  let { id } = useParams();
  const current = useMemo(() => {
    return data.find((m) => m._id === id);
  }, [id, data]);

  return (
    <>
      {editing && (
        <EditBuildingTypeModal
          details={{ name, numberOfUnits, _id }}
          closer={() => setEditing(false)}
        />
      )}
      {deleting && (
        <DeleteBuildingTypeModal
          details={{ _id, name, numberOfUnits }}
          closer={() => {
            setDeleting(false);
          }}
        />
      )}
      <div
        className={`w-full ${
          status !== 'Not created' ? ' hidden' : ''
        } p-6 relative rounded-md items-center flex justify-between bg-white`}>
        <div>
          {
            <>
              <p className=" text-2xl text-bblack-0 font-semibold">{name}</p>
              <div className="flex mt-2 items-center">
                <TbHome color="#9099A8" className=" mr-2" />
                <span className=" text-bash">{`${numberOfUnits} Units`}</span>
              </div>
            </>
          }
        </div>
        <div className=" flex items-center">
          <Button
            onClick={() => {
              dispatch(loadClusters({ currentType: { _id, status, name, numberOfUnits } }));
              navigate('/projectform');
            }}
            textStyle=" ml-2"
            LeftIcon={<TbPlus />}
            text="Project Brief"
          />
          <span
            onClick={() => setOptions(!options)}
            className="p-2 ml-2 hover:bg-ashShade-0 rounded-full">
            <FaEllipsisVertical color="#9099A8" />
          </span>
        </div>
        {options && (
          <span
            ref={optionRef}
            className="absolute z-10 flex flex-col mt-4 gap-y-2 shadow-bnkle top-20 p-2 w-40 right-20 bg-white rounded-md">
            <span
              onClick={() => {
                if (!loading) {
                  setEditing(true);
                  setOptions(false);
                }
              }}
              className=" cursor-pointer rounded-md flex hover:bg-ashShade-0 items-center text-bash py-2 px-1">
              <TbEdit className="mr-2" color="#77828D" /> Edit
            </span>
            <span
              onClick={() => {
                setDeleting(true);
              }}
              className=" cursor-pointer rounded-md flex hover:bg-redShades-1 items-center text-bred py-2 px-1">
              <TbTrash className="mr-2" color="#B63434" /> Delete{' '}
              {/* {deleting && <LoaderX className=" ml-2" color="red" />} */}
            </span>
          </span>
        )}
      </div>
    </>
  );
};

export default BuildingTypeCard;
