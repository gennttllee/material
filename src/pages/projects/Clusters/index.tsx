import React, { useEffect, useMemo, useState } from 'react';
import Layout from '../Home/Layout';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { Outlet, useLocation, useNavigate, useParams } from 'react-router-dom';
import { TbEdit } from 'react-icons/tb';
import ClusterMenuItem, { clusterMenuItemsList } from './ClusterMenuItem';
import Button from 'components/shared/Button';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import { postForm } from 'apis/postForm';
import { displayError, displaySuccess } from 'Utils';
import useClusters from 'Hooks/useClusters';
import { LoaderX } from 'components/shared/Loader';
import { updateCluster } from 'store/slices/clusterSlice';
import ClusterDeleteModal from './ClusterDeleteModal';
import BuildingTypes from './BuildingTypes';
import useRole from 'Hooks/useRole';

const Index = () => {
  let dispatch = useAppDispatch();
  let { getClusters, refreshproject } = useClusters(true);
  let { data, loading: clusterLoading } = useAppSelector((m) => m.cluster);
  let navigate = useNavigate();
  let { isProfessional, canDeleteCluster } = useRole();
  let { id } = useParams();
  const current = useMemo(() => {
    return data.find((m) => m._id === id);
  }, [id, data]);
  useEffect(() => {
    if (data.length === 0) {
      getClusters();
      refreshproject();
    }
  }, []);
  const [active, setActive] = useState('projects');
  const location = useLocation();
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(current?.clusterName);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    let loc = location.pathname.split('/');
    setActive(loc[loc.length - 1]);
  }, []);

  const handleNameUpdate = async () => {
    setLoading(true);
    let { e, response } = await postForm('patch', 'clusters/update', {
      clusterId: current?._id,
      clusterName: name
    });
    if (e) {
      displayError(e?.message);
    } else {
      dispatch(updateCluster(response.data.data));
      displaySuccess('Cluster Name modified Successfully');
      setIsEditing(false);
    }

    setLoading(false);
  };
  const handleNav = (path: string, name: string) => () => {
    setActive(path);
    navigate(path);
  };
  return (
    <Layout path="all">
      {showDeleteModal && (
        <ClusterDeleteModal cluster={current} closer={() => setShowDeleteModal(false)} />
      )}
      {clusterLoading === true ? (
        <div className="w-full flex bg-white mt-10 rounded-md items-center justify-center p-10">
          <LoaderX color="blue" />
        </div>
      ) : (
        <div className="w-full h-full flex flex-col ">
          <div className="  flex">
            <span
              onClick={() => navigate(-1)}
              className=" cursor-pointer hover:underline mt-3  flex items-center">
              <FaArrowLeftLong className=" mr-2" />
              Back
            </span>
          </div>

          <div className=" flex-1 flex mt-7 gap-x-4">
            <div className=" flex flex-col  ">
              {isEditing ? (
                <div className="w-full">
                  <input
                    defaultValue={current?.clusterName}
                    className="text-2xl p-2 rounded-md   font-semibold mr-2"
                    value={name}
                    type="text"
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                  />
                  <div className="flex mt-2 items-center   w-full gap-x-2">
                    <Button
                      type="danger"
                      text="Cancel"
                      onClick={() => {
                        setName(current?.clusterName);
                        setIsEditing(false);
                      }}
                    />
                    <Button isLoading={loading} text="Save" onClick={() => handleNameUpdate()} />
                  </div>
                </div>
              ) : (
                <p className=" text-2xl flex items-start font-semibold mr-2">
                  {current?.clusterName}{' '}
                  <span
                    className=" hover:bg-ashShade-0 p-2 ml-2 flex justify-center items-center rounded-full "
                    onClick={() => setIsEditing(true)}>
                    <TbEdit className=" " color="#9099A8" />
                  </span>
                </p>
              )}
              <div className=" mt-10 flex-col flex gap-y-2">
                {clusterMenuItemsList.map((m,i) => (
                  <ClusterMenuItem
                    {...m}
                    setter={handleNav(m.path||"", m.name)}
                    active={m.path === active}
                    key={i}
                  />
                ))}
              </div>
              <div className="mt-10">
                {canDeleteCluster && (
                  <Button
                    onClick={() => setShowDeleteModal(true)}
                    type="danger"
                    text={'Delete Cluster'}
                  />
                )}
              </div>
            </div>
            <div className="w-full h-full">
              <Outlet />
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default Index;
