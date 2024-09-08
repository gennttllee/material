import { useClickOutSideComponent } from 'components/projects/Team/Views/Components/OnScreen';
import ProjectOwner from 'components/projects/bids/projectowner/ProjectOwner';
import Button from 'components/shared/Button';
import SelectField from 'components/shared/SelectField';
import SuperModal from 'components/shared/SuperModal';
import { StoreContext } from 'context';
import { useFormik } from 'formik';
import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { setOptions } from 'react-chartjs-2/dist/utils';
import { TbCheck, TbChevronDown, TbPlus, TbSearch } from 'react-icons/tb';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import ProjectCard from '../Home/Components/ProjectCard';
import * as yup from 'yup';
import { ValidationError } from 'yup';
import { postForm } from 'apis/postForm';
import { display } from 'store/slices/contractorProfileSlice';
import { displayError, displaySuccess } from 'Utils';
import { updateCluster } from 'store/slices/clusterSlice';
import useProjects from 'Hooks/useProjects';

interface Props {
  closer: () => void;
}

const AddProjectModal = ({ closer }: Props) => {
  let { fetchProjects } = useProjects();

  let { data: _data } = useContext(StoreContext);
  const [showOptions, setShowOptions] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState<string>('');
  const optionsRef = useRef<any>();
  const inputRef = useRef<any>();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  useClickOutSideComponent(optionsRef, () => setShowOptions(false));
  let { data, loading: clusterLoading } = useAppSelector((m) => m.cluster);
  let navigate = useNavigate();
  let { id } = useParams();
  const current = useMemo(() => {
    return data.find((m) => m._id === id);
  }, [id, data]);
  const projects = useMemo(() => {
    return _data.filter((m) => !m?.clusterId);
  }, []);
  let dispatch = useAppDispatch();
  const filteredProjects = useMemo(() => {
    return projects.filter((m) => m.pseudoProjectName.toLowerCase().includes(search.toLowerCase()));
  }, [search]);

  const [errors, setErrors] = useState<any>();

  const handleProjectSelection = (str: string) => () => {
    if (selectedProjects.includes(str)) {
      setSelectedProjects(selectedProjects.filter((m) => m != str));
    } else {
      setSelectedProjects([...selectedProjects, str]);
    }
  };

  const allSelected = useMemo(() => {
    return projects.length === selectedProjects.length;
  }, [projects, selectedProjects]);

  const selectAll = () => {
    setSelectedProjects(!allSelected ? projects.map((m) => m._id) : []);
  };

  const validate = async () => {};

  const addProjectsToCluster = async () => {
    setLoading(true);
    let { e, response } = await postForm('post', 'clusters/add-project', {
      clusterId: current?._id,
      projects: selectedProjects.map((m) => ({ projectId: m }))
    });

    if (e) {
      displayError('Could not add projects to cluster');
    } else {
      let newCurrent = { ...current };
      let currentProjects = newCurrent?.projects || [];
      newCurrent.projects = [...currentProjects, ...selectedProjects];
      dispatch(updateCluster(newCurrent));
      displaySuccess('Projects added to cluster successfully');
      fetchProjects();
      closer();
    }

    setLoading(false);
  };

  return (
    <SuperModal classes=" bg-black bg-opacity-50 overflow-y-auto pb-10" closer={closer}>
      <div className=" flex flex-col items-center pt-20 h-full   justify-start  ">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" bg-white  rounded-md p-6 w-2/3  ">
          <div className="  flex items-center justify-between">
            <span className=" text-bblack-0 text-2xl font-semibold">Select Projects</span>
            <span onClick={closer} className=" text-bash p-2 cursor-pointer hover:underline">
              Close
            </span>
          </div>

          <div className=" mt-6 pt-6">
            <div className=" flex items-center justify-between">
              <span
                onClick={() => inputRef?.current?.focus()}
                className="items-center rounded-md p-2 hover:border-bblue hover:border bg-ashShade-0 flex">
                <TbSearch color="#9099A8" className="mr-4 " />
                <input
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                  }}
                  ref={inputRef}
                  type="text"
                  placeholder="Search"
                  className=" px-2 outline-none bg-ashShade-0"
                />
              </span>
              <span onClick={selectAll} className=" flex hover:cursor-pointer items-center">
                <span
                  className={` flex mr-2 items-center justify-center w-4 h-4 border ${
                    allSelected ? 'border-bblue bg-bblue' : ' border-ashShade-2 bg-white'
                  } rounded `}>
                  {allSelected && <TbCheck color="white" size={12} />}
                </span>
                Select all
              </span>
            </div>
            <div className=" my-4 max-h-[500px] grid grid-cols-3 gap-3 overflow-y-auto scrollbar">
              {filteredProjects.map((m) => (
                <span className=" rounded-md border">
                  <ProjectCard
                    {...m}
                    selected={selectedProjects.includes(m._id)}
                    onClick={handleProjectSelection(m._id)}
                    showCheckBox
                  />
                </span>
              ))}
            </div>
            {selectedProjects.length < 1 && (
              <p className=" text-sm text-bred">Please select a project</p>
            )}
          </div>
       

          <div className={` flex items-center  ${'justify-between'} `}>
            <span className=" flex items-center">
              <span className=" mr-2 font-semibold">{`${selectedProjects.length}/${projects.length}`}</span>
              <span className="  ">Selected</span>
            </span>
            <span className=" flex gap-x-4 items-center">
              <Button onClick={closer} type="secondary" text="Cancel" />
              <Button
                disabled={loading}
                isLoading={loading}
                onClick={addProjectsToCluster}
                type={selectedProjects.length < 1 ? 'muted' : 'primary'}
                text="Add Projects"
              />
            </span>
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default AddProjectModal;
