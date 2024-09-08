import { Prototype } from 'types';
import useFetch from 'Hooks/useFetch';
import { StoreContext } from 'context';
import React, { useContext, useMemo, useEffect, useState } from 'react';
import { getAllPrototypes } from 'apis/prototypes';
import { useNavigate } from 'react-router-dom';
import { useAppSelector } from 'store/hooks';
import useRole, { UserRoles } from 'Hooks/useRole';
import { postForm } from 'apis/postForm';
import { TbUsers } from 'react-icons/tb';
import { IconType } from 'react-icons';
import { TbBuilding, TbTemplate } from 'react-icons/tb';
type canSeeSnapshot = 'developer' | 'portfolioManager' | 'projectManager';

export const _canSeeSnapshot = ['developer', 'portfolioManager', 'projectManager'];

const Snapshot = () => {
  const { prototypes, handleContext } = useContext(StoreContext);
  const { load } = useFetch<Prototype[]>({
    initialData: [],
    onSuccess: (prototypes) => handleContext('prototypes', prototypes)
  });
  const navigation = useNavigate();
  const { isOfType } = useRole();
  const { data } = useContext(StoreContext);
  const user = useAppSelector((m) => m.user);
  const developers = useAppSelector((m) => m.developers);
  const professionals = useAppSelector((m) => m.professionals);
  const projectManagers = useAppSelector((m) => m.projectManagers);

  useEffect(() => {
    load(getAllPrototypes());
  }, []);

  const allCards = {
    projectManagers: {
      name: 'Project Managers',
      // as Developers should only see projectManagers that belong to the same company (CompanyName)
      amount: isOfType(UserRoles.Developer)
        ? projectManagers.data.filter((one) => one.companyName === user.companyName).length
        : projectManagers.data.length,
      onClick: () => navigation('/projects/home/projectManagers'),
      Icon: TbUsers
    },
    professionals: {
      name: 'Professionals',
      amount: professionals.data.length,
      onClick: () => navigation('/projects/home/professionals'),
      Icon: TbUsers
    },
    developers: {
      name: 'Developers',
      amount: developers.data.length,
      onClick: () => navigation('/projects/home/developers'),
      Icon: TbUsers
    },

    prototypes: {
      Icon: TbTemplate,
      name: 'Prototypes',
      amount: prototypes.length,
      onClick: () => navigation('/projects/prototypes')
    },
    projects: {
      name: 'Projects',
      amount: data.length,
      Icon: TbBuilding,
      onClick: () => navigation('/projects/all')
    }
  };

  const ListByRole = {
    [UserRoles.Developer]: [allCards.projectManagers, allCards.prototypes, allCards.projects],
    [UserRoles.PortfolioManager]: [...Object.values(allCards)],
    [UserRoles.ProjectManager]: [allCards.prototypes, allCards.projects]
  };

  const snaps = useMemo(() => {
    return ListByRole[user.role as canSeeSnapshot];
  }, [data, prototypes, professionals]);

  return (
    <div className="w-full h-full">
      <p className=" font-semibold text-2xl sm:text-3xl mt-16">
        Welcome {user.name || user.lastName}
      </p>
      <p className=" text-bash mt-12 font-medium">Quick actions</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 mt-5 gap-5 w-full">
        {snaps.map((m, i) => (
          <Snap {...m} key={i} />
        ))}
      </div>
    </div>
  );
};

interface SnapProps {
  name: string;
  amount: number;
  onClick?: () => void;
  Icon: IconType;
}

const Snap = ({ name, amount, onClick, Icon }: SnapProps) => {
  return (
    <div
      onClick={() => {
        if (onClick && amount > 0) onClick();
      }}
      className="bg-white p-5 rounded-md hover:bg-opacity-50 cursor-pointer ">
      <div className="w-12 h-12 flex items-center justify-center rounded-full bg-ashShade-4">
        <Icon size={30} />
      </div>
      <p className="mt-9 font-medium">{name}</p>
      <p className="mt-2 font-semibold text-3xl">{amount}</p>
    </div>
  );
};

const getProfessionalType = async (type: string) => {
  const res = await postForm('get', `professionals/${type}/filter/all`, {}, 'iam');
  return res;
};

const getAllProfessionals = async (setter: (x: any[]) => void) => {
  const promises = [getProfessionalType('consultant'), getProfessionalType('contractor')];
  const res = await Promise.all(promises);

  let results: any[] = [];
  for (let i of res) {
    if (i.response) {
      results = [...results, ...i.response.data.data];
    }
  }
  setter(results);
};

export { getAllProfessionals };

export default Snapshot;
