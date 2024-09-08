/* eslint-disable no-undef */
import { clearBids } from '../../../store/slices/bidslice';
import { clearContractors } from '../../../store/slices/contractorSlice';
import { useAppSelector, useAppDispatch } from '../../../store/hooks';
import React, { useEffect, useState, useCallback, useContext, useRef, useMemo } from 'react';
import axios from 'axios';

import { useLocation, useNavigate, Outlet, useParams } from 'react-router-dom';
import Menu from './Menu';
import { cleanError, displayError, displaySuccess } from 'Utils';
import { BiMenu } from 'react-icons/bi';
import ContractorProfile from '../../../components/shared/ContractorProfile';
import useWindowDimensions from 'components/shared/useWindowDimensions';
import { centered, flexer } from '../../../constants/globalStyles';
import { StoreContext } from 'context';
import useRole, { UserRoles } from 'Hooks/useRole';
import Loader from '../../../components/shared/Loader';
import { getBids, makeRequest } from '../Helper';
import AccountMenu from '../Home/Components/ActionMenu';
import { MESSAGING_REST, MESSAGING_SOCKETS } from 'apis/postForm';
// import { socket } from './Initialiser';
import {
  setUser,
  loadMessages,
  addMessage,
  reset,
  update,
  initialise,
  Group,
  loadGroups,
  addGroupOrTasks,
  clearMessages
} from 'store/slices/chatsSlice';
import useTeamMembers from 'Hooks/useTeamMembers';
import SubmitDrafts from 'components/projects/management/POW/Components/SubmitDrafts';
import useNotifications from 'Hooks/useNotifications';
import useProfessionals from 'Hooks/useProfessionals';
import SelectField from 'components/shared/SelectField';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { currencySchema } from 'validation/currency';
import { currencies } from '../../../constants';
import Button from 'components/shared/Button';
import useFetch from 'Hooks/useFetch';
import { updateProjectBrief } from 'apis/projectBrief';
import { Socket, io } from 'socket.io-client';
// import { socket } from './Initialiser';

let cbDummy = (x: boolean | MessageEvent) => {};

export const handleStatusUpdate = async (
  eventId: string,
  status: 'read' | 'delivered' | 'pending',
  cb: (b: boolean | MessageEvent) => any = cbDummy
) => {
  try {
    let token = localStorage.getItem('token');
    let response = await axios.patch(
      MESSAGING_REST + `/events/update/${eventId}`,
      {
        status: status
      },
      {
        headers: {
          Authorization: 'Bearer ' + token
        }
      }
    );
    cb(response.data.data);
    return true;
  } catch (e) {
    cb(false);
    return false;
  }
};
let socket = io(MESSAGING_SOCKETS);
const OneProjects = () => {
  const navigate = useNavigate();
  const [isConnected, setIsConnected] = useState(socket.connected);
  const { projectId } = useParams();
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();
  let { width } = useWindowDimensions();
  const [menu, setMenu] = useState(false);
  const { isProfessional } = useRole();
  const aRef = useRef<HTMLAnchorElement>(null);
  let profileModal = useAppSelector((s) => s.contractorModal);
  let user = useAppSelector((m) => m.user);
  const [synced, setSynced] = useState(false);
  const { selectedProjectIndex, handleContext, menuProjects, setContext, data, selectedProject } =
    useContext(StoreContext);
  // let token = useMemo(() => localStorage.getItem('token'), []);

  let token = localStorage.getItem('token');
  const setErrStatus = useState<number | null>(null)[1];
  const [collapsed, setCollapsed] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setLoader] = useState(false);
  const [isReady, setReady] = useState(false);
  const [status, setStatus] = useState(false);
  // const [groups, setGroups] = useState<string[]>([]);
  const { isOfType } = useRole();
  useTeamMembers();

  let team = useAppSelector((m) => m.team);
  let chats = useAppSelector((m) => m.chats);
  const groups = useMemo(() => {
    let tasks = Object.keys(chats.groups.tasks);
    let groups = Object.keys(chats.groups.groups);
    return [...tasks, ...groups];
  }, [chats]);

  const fetchGroups = async () => {
    if (projectId) {
      try {
        let response = await axios({
          method: 'get',
          url: MESSAGING_REST + '/group/list',
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        let curated = response.data.data.filter(
          (m: Group) => m.projectId === data[selectedProjectIndex]?._id
        ) as Group[];

        dispatch(loadGroups(curated));
      } catch (error: any) {
        displayError(cleanError(error));
      }
    }
  };
  const handleSocketChange = async () => {
    await sync(socket);
  };

  useEffect(() => {
    socket.emit('join-room', groups);
  }, [groups]);

  const initialiseDMS = () => {
    if (!team.loading) {
      let general = selectedProject?._id;

      let acc: { [key: string]: [] } = {};
      for (let person in team.data) {
        if (person !== general && person !== (user._id as string)) {
          acc[person] = [];
        }
      }
      dispatch(initialise({ DMS: acc, general }));
    }
  };
  const fetchMessages = async () => {
    try {
      let response = await axios.get(MESSAGING_REST + `/events/filter/${projectId}`, {
        headers: {
          authorization: 'Bearer ' + token
        }
      });
      dispatch(clearMessages());
      initialiseDMS();
      dispatch(loadMessages(response.data.data));
    } catch (e) {
      console.log(e);
    }
  };

  const { control, handleSubmit, getValues } = useForm<{
    currency: { code: string; label: string };
  }>({
    reValidateMode: 'onChange',
    defaultValues: { currency: { code: '', label: '' } },
    resolver: yupResolver(currencySchema)
  });

  const { load, isLoading: isCurrencyLoading } = useFetch({
    onSuccess: () => {
      toggleModal();
      setContext((prev) => ({
        ...prev,
        menuProjects: prev.menuProjects.map((one) =>
          one._id === selectedProject._id ? { ...one, currency: getValues('currency') } : one
        ),
        data: prev.data.map((one) =>
          one._id === selectedProject._id ? { ...one, currency: getValues('currency') } : one
        )
      }));
    }
  });

  useEffect(() => {
    if (selectedProject && !selectedProject.currency) {
      toggleModal();
    }
  }, [selectedProject]);

  const fetchProjects = useCallback(async () => {
    await makeRequest(setContext, setErrStatus);
  }, [setContext, setErrStatus]);

  const fetchBids = useCallback(async () => {
    await getBids(isProfessional, setContext, setErrStatus);
  }, [setContext, isProfessional, setErrStatus]);

  useEffect(() => {
    if (pathname.split('/').includes('bid')) {
      dispatch(clearBids());
      dispatch(clearContractors());
      if (!isProfessional) navigate('bid');
    }
    dispatch(setUser(user._id));
  }, [selectedProjectIndex]);

  useEffect(() => {
    if (!chats.currentUser) {
      dispatch(setUser(user._id));
    }
    if (!team.loading && team.data && data[selectedProjectIndex]?._id) {
      dispatch(reset());
      initialiseDMS();
      fetchGroups();
      fetchMessages();
    }
  }, [selectedProject, data, team.loading, team.data]);

  let sync = async (socket: Socket<any, any>, retries = 3) => {
    try {
      let response = await axios.post(
        MESSAGING_REST + '/users/sync',
        {
          socketId: socket.id
        },
        {
          headers: {
            Authorization: 'Bearer ' + token
          }
        }
      );

      socket.emit('join-room', projectId);
    } catch (error) {
      console.log(error);
      if (retries > 0) {
        await sync(socket, retries - 1);
      }
    }
  };

  useEffect(() => {
    handleSocketChange();
  }, [socket]);

  useEffect(() => {
    socket.on('connect', () => {
      sync(socket);
    });

    socket.on('message', async (data: any) => {
      if (data._doc.message.projectId === projectId) {
        dispatch(addMessage(data._doc));
        if (data._doc.message.origin !== user._id) {
          handleStatusUpdate(data._doc._id, 'delivered', (message) => {
            if (message) {
              dispatch(update(message));
            }
          });
        }
      }
    });

    socket.on('updateMessageStatus', (data: any) => {
      if (data.message.message.projectId === projectId) {
        dispatch(update(data.message));
      }
    });

    socket.on('group-invite', (data: Group) => {
      socket.emit('join-group', data?.taskId ?? data._id);
      dispatch(addGroupOrTasks(data));
    });
  }, [socket]);

  useEffect(() => {
    if (menuProjects[0]) {
      if (menuProjects[selectedProjectIndex]._id !== projectId) {
        const match = { index: 0, status: false };
        for (let i = 0; i < menuProjects.length; i++) {
          if (menuProjects[i]._id === projectId) {
            match.index = i;
            match.status = true;
          }
        }
        if (match.status) {
          handleContext('selectedProjectIndex', match.index);
          setReady(true);
        } else {
          displayError('Project not found');
          navigate('/projects');
        }
      } else {
        setReady(true);
      }
    } else {
      setLoader(true);
      if (!isProfessional) {
        fetchProjects().finally(() => setLoader(false));
      } else {
        fetchBids().finally(() => setLoader(false));
      }
    }
  }, [
    isProfessional,
    menuProjects,
    projectId,
    navigate,
    fetchBids,
    fetchProjects,
    selectedProjectIndex
  ]);

  const toggleModal = () => {
    // only Project Owners should be able to see the modal or toggle it
    if (showModal) {
      setShowModal(false);
    } else if (isOfType(UserRoles.ProjectOwner) || isOfType(UserRoles.PortfolioManager)) {
      // 1. check if the logged-in user is a team member of the project team
      const exists = selectedProject?.team?.find(
        (member) => String(member).includes(user._id) || member.id.includes(user._id)
      );
      if (exists) setShowModal((prev) => !prev);
    }
  };

  const submitHandler = handleSubmit((data) => {
    load(updateProjectBrief(selectedProject._id, data));
  });

  const CurrencyInputModal = () => (
    <div className={centered + 'fixed bg-[rgba(0,0,0,.5)] w-screen h-screen top-0 left-0 z-[1000]'}>
      <form onSubmit={submitHandler} className="p-6 rounded-md bg-white w-[500px] border shadow-md">
        <div className={flexer}>
          <p className="text-Medium text-xl text-black">Project Currency</p>
          <button className="text-bash text-sm" onClick={toggleModal}>
            Close
          </button>
        </div>
        <Controller
          name="currency"
          {...{ control }}
          render={({ field: { onChange, value } }) => (
            <SelectField
              showSearch
              value={value.code}
              data={currencies.map((one) => ({
                ...one,
                label: `${one.label}  (${one.value})`
              }))}
              onChange={(val) => {
                const currency = currencies.find((one) => one.value === val);
                if (currency) onChange({ code: currency.value, label: currency.label });
              }}
            />
          )}
        />
        <Button isLoading={isCurrencyLoading} className="mt-3 w-full" type="primary" text="Save" />
      </form>
    </div>
  );

  const hasProjects = !isProfessional || (data && data.length);
  let hasData = data && data.length;

  return !isReady || isLoading ? (
    <div className={centered}>
      <Loader />
    </div>
  ) : (
    <div className="w-full lg:w-screen overflow-x-auto shadow-lg flex h-screen justify-center sm:m-auto bg-projectBg">
      {showModal && <CurrencyInputModal />}
      {profileModal.display ? <ContractorProfile /> : null}
      {
        <>
          {hasData ? (
            <div
              className={`w-full h-full lg:relative duration-500 transition-transform  lg:block absolute top-0 left-0 bg-black bg-opacity-40 flex flex-col z-30 ${
                collapsed ? 'lg:w-[80px]' : 'lg:w-[262px]'
              }  ${!menu ? 'hidden' : width < 1024 ? 'z-50' : ''}`}>
              <div className={`w-full relative lg:w-full no-scrollbar  pt-10 h-full  bg-white`}>
                <Menu
                  collapsed={collapsed}
                  toggle={[menu, setMenu]}
                  collapseFn={() => setCollapsed(!collapsed)}
                  data={menuProjects[0] ? menuProjects : data}
                  selected={[
                    selectedProjectIndex,
                    (index: number) => {
                      handleContext('selectedProjectIndex', index);
                      navigate(`/projects/${menuProjects[index]._id}`);
                    }
                  ]}
                />
              </div>
            </div>
          ) : null}
          <a
            ref={aRef}
            href={`${
              isProfessional
                ? process.env.REACT_APP_AUTH_URL
                : process.env.REACT_APP_AUTH_URL + 'signin/'
            }?action=logout`}
            className="hidden">
            somelink
          </a>
          <div className="flex-1 flex flex-col overflow-auto lg:pt-7 !relative">
            <SubmitDrafts />
            <div className="w-full py-2 flex items-center bg-white lg:bg-inherit lg:justify-end justify-between px-5 lg:px-10  ">
              {hasProjects ? (
                <span
                  onClick={() => setMenu(!menu)}
                  className="cursor-pointer p-1 lg:hidden rounded-md ">
                  <BiMenu color="black" size={26} />
                </span>
              ) : null}
              <AccountMenu />
            </div>
            <div
              className={`flex-1 max-w-[calc(100%)]  overflow-y-auto w-full no-scrollbar ${
                hasProjects ? 'px-5 lg:px-10' : 'relative sm:px-5 left-0 lg:-left-8 2xl:-left-16'
              } 2xl:max-w-[1440px] mx-auto`}>
              <Outlet />
            </div>
          </div>
        </>
      }
    </div>
  );
};

export default OneProjects;
