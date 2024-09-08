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
import { displayError, displayInfo, displaySuccess } from 'Utils';
import { updateCluster } from 'store/slices/clusterSlice';
import useProjects from 'Hooks/useProjects';
import CreatePow, { BidData } from './CreatePow';
import useRole, { UserRoles } from 'Hooks/useRole';
import { uploadMultipleFiles } from 'Hooks/useProjectImages';
import { isRoleProfessional } from 'helpers';


interface Props {
  closer: () => void;
  userAction?: any;
}
const nameMap = {
  projectManager: 'Project Manager',
  projectOwner: 'Project Owner',
  guest: 'Guest',
  contractor: 'Contractor',
  consultant: 'Consultant',
  developer: 'Developer',
  portfolioManager: 'Portfolio Manager',
  bookKeeper: 'Book Keeper'
};
let options = Object.keys(nameMap);

type MapKey = keyof typeof nameMap;
const AddClusterMemberModal = ({ closer, userAction }: Props) => {
  let { fetchProjects } = useProjects();
  const [type, setType] = useState<keyof typeof nameMap | undefined>('guest');
  let { data: _data } = useContext(StoreContext);
  const [showOptions, setShowOptions] = useState(false);
  const [showProjects, setShowProjects] = useState(false);
  const [email, setEmail] = useState<string>('');
  const [search, setSearch] = useState<string>('');
  let { isAProfessional } = useRole();
  const [bidData, setBidData] = useState<BidData | undefined>();
  const optionsRef = useRef<any>();
  const inputRef = useRef<any>();
  const [selectedProjects, setSelectedProjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  useClickOutSideComponent(optionsRef, () => setShowOptions(false));
  let { data, loading: clusterLoading } = useAppSelector((m) => m.cluster);
  let dispatch = useAppDispatch();
  let navigate = useNavigate();
  let { id } = useParams();
  const current = useMemo(() => {
    return data.find((m) => m._id === id);
  }, [id, data]);
  const projects = useMemo(() => {
    let method: string = userAction?.action;

    let _projects = _data.filter((m) => m.clusterId === current?._id);
    if (!method) return _projects;

    return _projects.filter((m) => {
      let isInteam = m.team.find((m) => m.id === userAction.user?._id);
      return method === 'add' ? (isInteam ? false : true) : isInteam ? true : false;
    });
  }, []);

  const filteredProjects = useMemo(() => {
    return projects.filter((m) => m.pseudoProjectName.toLowerCase().includes(search.toLowerCase()));
  }, [projects, search]);
  const [pow, setPow] = useState({
    name: '',
    description: '',
    type,
    docs: []
  });
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

  const validate = async () => {
    let e: any;
    let schema = yup.object({
      email: yup.string().email().required('Please enter a valid email')
    });

    try {
      await schema.validate({ email, selectedProjects, pow: pow.name ? pow : undefined });
    } catch (error: any) {
      e = { [error.path]: error.message };
      setErrors(e);
    }

    if (!e) {
      setErrors({});
    }

    return { error: e };
  };

  useEffect(() => {
    validate();
  }, [selectedProjects, email, pow]);

  const buttonReady = useMemo(() => {
    const checkActive = errors?.email || selectedProjects.length < 1;

    return checkActive ? 'muted' : userAction?.action === 'delete' ? 'danger' : 'primary';
  }, [type, bidData, errors, selectedProjects, userAction]);

  const addEmailtoCLuster = async () => {
    setLoading(true);
    let bidData: BidData = {
      name: 'Construction',
      files: [
        new File(
          [
            `standard file created to  fastTrack Bids by usebnkle.com. On  Cluster ${current?.clusterName} for user with email${email} for projectIds [${selectedProjects.toString()}]`
          ],
          'usebnkle.txt',
          { type: 'text/plain' }
        )
      ],
      description: 'Created by fast track, bypassing bid management'
    };
    let isProf = isAProfessional(type as UserRoles);
    let data: any = {
      email,
      role: type,
      clusterId: current?._id,
      projects: selectedProjects.map((m) => ({ projectId: m })),
      pow: isProf ? bidData : undefined
    };

    if (data.pow) {
      displayInfo('Uploading Files');
      let docs = await uploadMultipleFiles(data.pow.files, selectedProjects[0], 'bids');
      if (docs.length > 0) {
        delete data?.pow?.files;
        data.pow?.files;
        data.pow.docs = docs;
        data.pow.type = type;
      } else {
        displayError('Could not upload documents');
        return;
      }
    }

    let { e, response } = await postForm('post', 'clusters/add-team', data);
    if (response) {
      displaySuccess('team member added successfully');
      dispatch(updateCluster(response.data.data));
      fetchProjects();
      closer();
    } else {
      displayError(e?.message || "'Could not add member to cluster projects'");
    }
    setLoading(false);
  };

  const deleteFromProject = async () => {
    setLoading(true);
    let { e, response } = await postForm('patch', 'clusters/remove-cluster-team', {
      userId: userAction?.user?._id,
      clusterId: current?._id,
      projects: selectedProjects.map((m) => ({ projectId: m }))
    });

    if (response) {
      displaySuccess('team member removed successfully');
      dispatch(updateCluster(response.data.data));
      fetchProjects();
      closer();
    } else {
      displayError('Could not remove member from cluster projects');
    }
    setLoading(false);
  };
  const handleSubmission = () => {
    userAction?.action === 'delete' ? deleteFromProject() : addEmailtoCLuster();
  };
  useEffect(() => {
    if (userAction) {
      setType(userAction?.user?.rolename);
      setEmail(userAction?.user?.email);
    }
  }, []);

  const title = useMemo(() => {
    let method = userAction?.action;
    return method === 'delete' ? 'Remove from Projects' : 'Add to Multiple Projects';
  }, [userAction]);

  return (
    <SuperModal classes=" bg-black bg-opacity-50 !overflow-y-auto pb-10 " closer={closer}>
      <div className=" flex flex-col items-center pt-20 h-full   justify-start  ">
        <div
          onClick={(e) => {
            e.stopPropagation();
          }}
          className=" bg-white  rounded-md p-6 w-2/3  ">
          <div className="  flex items-center justify-between">
            <span className=" text-bblack-0 text-2xl font-semibold">{`${title}`}</span>
            <span onClick={closer} className=" cursor-pointer  text-bash p-2 hover:underline">
              Close
            </span>
          </div>

          <div className="flex pl-4 relative pr-2.5 py-2.5 items-center w-full mt-8 border rounded-md">
            <input
              className="flex-1 outline-none"
              type="email"
              name=""
              placeholder="Enter email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
              }}
              id=""
            />
            <span
              onClick={() => {
                setShowOptions(true);
              }}
              className="  cursor-pointer bg-ashShade-0 text-bblack-0 rounded-md px-2.5 py-1 flex items-center">
              {type ? nameMap[type] : 'Select Role'}
              <TbChevronDown className=" ml-2" />
            </span>
            {showOptions && (
              <div
                ref={optionsRef}
                className=" shadow-bnkle z-20 bg-white scrollbar-thin absolute rounded-md p-2 top-14 max-h-64 overflow-y-auto flex flex-col right-0">
                {options.map((m) => (
                  <span
                    className={` ${
                      type === m ? 'bg-lightblue' : ''
                    } p-2 cursor-pointer flex items-center rounded-md hover:bg-ashShade-0`}
                    onClick={() => {
                      setType(m as any);
                      setShowOptions(false);
                    }}>
                    <TbCheck color="#437ADB" className={`mr-2 ${type === m ? '' : 'invisible'}`} />

                    {nameMap[m as MapKey]}
                  </span>
                ))}
              </div>
            )}
          </div>
          {errors?.email && <p className=" text-sm text-bred ">{errors?.email}</p>}
          {showProjects && (
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
          )}

          <div
            className={` flex items-center  ${showProjects ? 'justify-between' : 'justify-end'} `}>
            {!showProjects ? (
              <span
                onClick={() => {
                  setShowProjects(true);
                }}
                className=" p-2 flex cursor-pointer font-semibold  items-center text-bblue ">
                <TbPlus strokeWidth={3} color="#437ADB" className=" mr-2" />
                Select Projects
              </span>
            ) : (
              <>
                <span className=" flex items-center">
                  <span className=" mr-2 font-semibold">{`${selectedProjects.length}/${projects.length}`}</span>
                  <span className="  ">Selected</span>
                </span>
                <span className=" flex gap-x-4 items-center">
                  <Button onClick={closer} type="secondary" text="Cancel" />
                  <Button
                    isLoading={loading}
                    onClick={handleSubmission}
                    type={buttonReady}
                    text={userAction?.action === 'delete' ? 'Remove from Projects' : 'Add Projects'}
                  />
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </SuperModal>
  );
};

export default AddClusterMemberModal;
