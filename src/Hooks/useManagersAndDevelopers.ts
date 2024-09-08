import { StoreContext } from 'context';
import { postForm } from 'apis/postForm';
import { useAppDispatch, useAppSelector } from 'store/hooks';
import React, { useContext, useEffect, useMemo } from 'react';
import { loadProjectManagers } from 'store/slices/projectManagerSlice';
import { loadDevelopers } from 'store/slices/developerSlice';
import useRole, { UserRoles } from './useRole';

const getDevelopersAndProfessionals = async ({
  isDeveloperLoggedIn,
  companyName
}: {
  isDeveloperLoggedIn: boolean;
  companyName?: string;
}) => {
  const managers = await postForm(
    'get',
    isDeveloperLoggedIn // a developer only get projectManagers from his companyName
      ? `users/filter/managers-by-company?companyName=${companyName}`
      : 'users/filter/all/projectManager',
    {},
    'iam'
  );
  const developers = await postForm('get', 'professionals/developer/filter/all', {}, 'iam');

  return {
    managers: managers?.response?.data?.data || [],
    developers: developers.response?.data?.data || []
  };
};

  
const useManagerAndProfessionals = () => {
  const { isOfType } = useRole();
  const dispatch = useAppDispatch();
  const { data } = useContext(StoreContext);
  const  user  = useAppSelector((state) => state.user);
  const developers = useAppSelector((m) => m.developers);
  const managers = useAppSelector((m) => m.projectManagers);
  const isDeveloperLoggedIn = useMemo(() => isOfType(UserRoles.Developer), []);

  const loadDevelopersAndProfessionals = async () => {
    dispatch(loadProjectManagers({ loading: true, data: managers.data }));
    dispatch(loadDevelopers({ loading: true, data: developers.data }));
    const { managers: _managers, developers: _developers } = await getDevelopersAndProfessionals({
      isDeveloperLoggedIn,
      companyName: user.companyName
    });
    dispatch(loadProjectManagers({ loading: false, data: _managers }));
    dispatch(loadDevelopers({ loading: false, data: _developers }));
  };

  useEffect(() => {
    loadDevelopersAndProfessionals();
  }, [data, user]);

  return {};
};


export default useManagerAndProfessionals;
