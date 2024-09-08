import React, { useMemo } from 'react';
import { TbFolder, TbFolderFilled, TbHome } from 'react-icons/tb';
import { useNavigate } from 'react-router-dom';
import { ClusterType, ClusterTypes } from 'types';

interface ClusterCardProps {
  name: string;
  status: string;
  units: number;
}
const ClusterCard = ({ status, clusterName, types, _id }: ClusterType) => {
  let navigate = useNavigate();
  const allUnits = useMemo(() => {
    let arr: number[] = [];
    for (let x of types) {
      arr.push(x.numberOfUnits);
    }
    let total = arr.reduce((x, y) => x + y);
    return total;
  }, [types]);
  return (
    <div
      onClick={() => navigate(`/clusters/${_id}/projects`)}
      className="w-full rounded-md bg-white p-6 cursor-pointer">
      <div className=" bg-blueShades-4 rounded-full h-8 w-8 justify-center items-center flex">
        <TbFolderFilled size={16} color="#365EAF" />
      </div>
      <p className=" mt-2 text-bblack-0 text-xl font-semibold">{clusterName}</p>
      <div className=" flex items-center text-sm mt-2 ">
        <TbHome className=" mr-2" color="#9099A8" /> {`${allUnits} units`}
      </div>
      <div className=" mt-3">
        <span
          className={`py-1 px-2  text-xs rounded-full  ${
            status.toLowerCase() === 'completed'
              ? ' text-bgreen-0 bg-bgreen-1 '
              : ' text-bred bg-redShades-1'
          } `}>
          {status}
        </span>
      </div>
    </div>
  );
};

export default ClusterCard;
