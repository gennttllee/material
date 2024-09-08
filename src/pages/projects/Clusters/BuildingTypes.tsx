import Button from 'components/shared/Button';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { IoOptionsOutline } from 'react-icons/io5';
import { TbChevronDown, TbFolderPlus, TbPlus } from 'react-icons/tb';
import BuildingTypeCard from './BuildingTypeCard';
import { ClusterTypes, ClusterType } from 'types';
import { StoreContext } from 'context';
import ProjectCard from '../Home/Components/ProjectCard';
import SelectField from 'components/shared/SelectField';
import { useParams } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import useClusters from 'Hooks/useClusters';
import { IconType } from 'react-icons';
import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import AddProjectModal from './AddProject';
import AddBuildingTypeModal from './AddBuildingTypeModal';
import { convertToSentence } from 'components/shared/utils';
import useRole from 'Hooks/useRole';
const intialFilters = {
  status: '',
  buildingType: ''
};
const BuildingTypes = () => {
  let { getClusters } = useClusters(true);
  let { data: _clusters, loading: clusterLoading } = useAppSelector((m) => m.cluster);
  const [options, setOptions] = useState(false);
  const [projectModal, setProjectModal] = useState(false);
  const user = useAppSelector((m) => m.user);
  const { canDeleteCluster } = useRole();
  let { id } = useParams();
  let optionRef = useRef<any>();
  const current = useMemo(() => {
    return _clusters.find((m) => m._id === id);
  }, [id, _clusters]);
  let { data } = useContext(StoreContext);
  const [showFilters, setShowFilters] = useState(false);
  const [addTypeModal, setAddTypeModal] = useState(false);
  const _data = useMemo(() => {
    return data.filter((m) => m.clusterId === current?._id);
  }, [data]);
  const [filters, setFilters] = useState(intialFilters);
  useEffect(() => {
    if (data.length === 0 || _clusters.length === 0) {
      getClusters();
    }
  }, []);
  const handleFilter = (field: keyof typeof filters, value: string) => {
    setFilters({ ...filters, [field]: value });
  };

  useClickOutSideComponent(optionRef, () => setOptions(false));
  let buildingTypes = useMemo(() => {
    let acc: { [key: string]: boolean } = {};
    const _types: { [key: string]: boolean } = {};
    for (let x of _data) {
      if (x?.projectType === 'residential') {
        _types[`${x.numberOfBedrooms} Bedroom${x.numberOfBedrooms != 1 ? 's' : ''}`] = true;
      } else {
        _types[x?.commercialType] = true;
      }

      // if (x?.commercialType) _types[x?.commercialType] = true;
    }
    return Object.keys(_types).filter((m) => m !== undefined);
  }, [_data]);

  let statuses = useMemo(() => {
    let acc: { [key: string]: boolean } = {};
    let allTypes = _data.map((m) => m?.status);
    allTypes.forEach((m) => {
      if (m && !acc[m]) {
        acc[m] = true;
      }
    });
    return Object.keys(acc);
  }, [_data]);

  const filtered = useMemo(() => {
    let _filtered = _data.filter((m) => {
      let typeString =
        m.projectType === 'residential'
          ? `${m.numberOfBedrooms} Bedroom${m.numberOfBedrooms != 1 ? 's' : ''}`
          : m?.commercialType;
      return (
        typeString?.toLowerCase()?.includes(filters.buildingType.toLowerCase()) &&
        m?.status?.includes(filters.status)
      );
    });

    let belongsToProjects = _filtered.filter((m) => {
      let isIncluded = m.team.find((m) => m.id === user?._id);
      return Boolean(isIncluded);
    });


    return canDeleteCluster ? _filtered : belongsToProjects;
  }, [_data, filters]);

  return (
    <div className="w-full h-full pb-4 overflow-y-auto">
      {projectModal && <AddProjectModal closer={() => setProjectModal(false)} />}
      {addTypeModal && <AddBuildingTypeModal closer={() => setAddTypeModal(false)} />}
      <div className=" w-full flex items-center justify-between">
        <span
          onClick={() => {
            setShowFilters(!showFilters);
            // setFilters(intialFilters);
          }}
          className=" cursor-pointer bg-white px-2 py-1 flex items-center rounded-md">
          <IoOptionsOutline className=" mr-2 rotate-90" />
          Filter
        </span>
        {canDeleteCluster && (
          <Button
            onClick={() => setOptions(true)}
            className=" border-bblue"
            textStyle=" text-bblue"
            RightIcon={<TbChevronDown color="#437ADB" className=" ml-4" />}
            type="plain"
            text="Add New"
          />
        )}
        {options && (
          <div
            ref={optionRef}
            className=" p-2 bg-white rounded-md  shadow-bnkle absolute z-10 right-0 top-28 flex flex-col">
            <Option
              text="Create Building Type"
              onClick={() => {
                setAddTypeModal(true);
              }}
              icon={TbFolderPlus}
            />
            <Option
              text="Add Existing Project"
              onClick={() => {
                setProjectModal(true);
              }}
              icon={TbPlus}
            />
          </div>
        )}
      </div>
      {showFilters && (
        <div className=" flex items-center mt-5 gap-x-6 bg-white p-4 rounded-md">
          <SelectField
            onClear={() => {
              setFilters({ ...filters, status: '' });
            }}
            showClearButton
            value={filters.status}
            labelClassName=" text-bblack-0 text-sm "
            label="Status"
            data={statuses.map((m) => ({
              label: convertToSentence(m),
              value: m
            }))}
            onChange={(e) => {
              handleFilter('status', e);
            }}
          />
          <SelectField
            onClear={() => {
              setFilters({ ...filters, buildingType: '' });
            }}
            showClearButton
            labelClassName=" text-bblack-0 text-sm "
            value={filters.buildingType}
            label="Building Type"
            data={buildingTypes.map((m) => ({ label: convertToSentence(m), value: m }))}
            onChange={(e) => {
              handleFilter('buildingType', e);
            }}
          />
        </div>
      )}
      <div className=" flex flex-col gap-y-4 mt-10">
        {canDeleteCluster && current?.types.map((m: ClusterTypes) => <BuildingTypeCard {...m} />)}
      </div>
      <div className=" grid grid-cols-3 gap-4 mt-10 ">
        {filtered.map((m) => (
          <ProjectCard key={m._id} {...m} />
        ))}
      </div>
    </div>
  );
};

interface Props {
  text: string;
  onClick: () => void;
  icon?: IconType;
}
const Option = ({ text, onClick, icon }: Props) => {
  const [hovered, setHovered] = useState(false);
  return (
    <span
      onMouseOver={() => {
        setHovered(true);
      }}
      onMouseLeave={() => {
        setHovered(false);
      }}
      onClick={() => onClick()}
      className=" cursor-pointer  rounded-md hover:bg-lightblue  items-center flex text-bash hover:text-bblue p-2">
      {icon &&
        React.createElement(icon, {
          className: ' mr-2',
          color: hovered ? '#437ADB' : '#9099A8'
        })}
      {text}
    </span>
  );
};

export { Option };
export default BuildingTypes;
