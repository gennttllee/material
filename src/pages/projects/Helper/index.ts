import { displayError, displaySuccess } from 'Utils';
import { postForm } from '../../../apis/postForm';
import { ContextState } from '../../../context';
import { ProfessionalBrief } from '../../../types';

const makeRequest = async (setContext: any, setErrStatus: any = undefined) => {
  setContext((prev: any) => ({
    ...prev,
    isLoading: true
  }));
  let res: any = await postForm('get', 'projects/briefs');
  if (res.e) {
    if (typeof res.e === 'object') {
      if (setErrStatus) {
        setErrStatus((_: number) => res.e.status);
      }
    }
    setContext((prev: ContextState) => ({
      ...prev,
      isLoading: false
    }));
  } else {
    setContext((prev: ContextState) => ({
      ...prev,
      isLoading: false,
      menuProjects: res.response.data.data,
      data: res?.response && res?.response?.data?.data ? res.response.data.data.reverse() : [],
      selectedProjectIndex: 0
    }));
  }
};

const getBids = async (isProfessional: boolean, setContext: any, setErrStatus: any) => {
  let res = await postForm('get', 'bids/all?filterByPro=true');
  if (res.e) {
    if (typeof res.e === 'object') {
      setErrStatus(res.e.status);
    } else {
      displayError(res.e);
    }
    setContext((prev: ContextState) => ({ ...prev, isLoading: false }));
  } else {
    /** filter bids by project's id  */
    let projects: ProfessionalBrief[] = [];
    for (const one of res.response.data.data) {
      let _id = one?.projectId?._id;
      // *  find if a projects already exists
      const exists = projects.find((project) => project._id === _id);
      /**
       * Assign bid to corresponding projects
       * to a value named
       * ? {literalBids} of type Bid[]
       * */
      if (!exists) {
        projects.push({ ...one.projectId, literalBids: [one] });
      } else {
        projects = projects.map((project) => {
          if (project._id !== _id) return project;
          return {
            ...project,
            literalBids: project.literalBids ? [...project.literalBids, one] : []
          };
        });
      }
    }
    //
    setContext((prev: ContextState) => ({
      ...prev,
      menuProjects: projects,
      data: isProfessional ? projects : res.response.data.data,
      selectedProjectIndex: projects.length - 1,
      isLoading: false
    }));
    //
    displaySuccess(res?.response?.data?.message);
  }
};

const getProjectBids = async (isProfessional: boolean, setContext: any, setErrStatus: any) => {
  let res = await postForm('get', 'bids/project/?filterByPro=true');
  if (res.e) {
    if (typeof res.e === 'object') {
      setErrStatus(res.e.status);
    } else {
      displayError(res.e);
    }
    setContext((prev: ContextState) => ({ ...prev, isLoading: false }));
  } else {
    /** filter bids by project's id  */
    let projects: ProfessionalBrief[] = [];
    for (const one of res.response.data.data) {
      const { _id } = one.projectId;
      // *  find if a projects already exists
      const exists = projects.find((project) => project._id === _id);
      /**
       * Assign bid to corresponding projects
       * to a value named
       * ? {literalBids} of type Bid[]
       * */
      if (!exists) {
        projects.push({ ...one.projectId, literalBids: [one] });
      } else {
        projects = projects.map((project) => {
          if (project._id !== _id) return project;
          return {
            ...project,
            literalBids: project.literalBids ? [...project.literalBids, one] : []
          };
        });
      }
    }
    //
    setContext((prev: ContextState) => ({
      ...prev,
      menuProjects: projects,
      data: isProfessional ? projects : res.response.data.data,
      selectedProjectIndex: projects.length - 1,
      isLoading: false
    }));
    //
    displaySuccess(res?.response?.data?.message);
  }
};

export { makeRequest, getBids };
