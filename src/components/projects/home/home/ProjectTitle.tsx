import React, { useContext, useMemo } from 'react';
import Title from './Title';
import Modal from '../../../shared/Modal';
import useRole from '../../../../Hooks/useRole';
import TitleComponent from './TitleComponent';
import useFetch from '../../../../Hooks/useFetch';
import { StoreContext } from '../../../../context';
import ProjectTitleForm, { ProjectTitleFormToggler } from './ProjectTitleForm';

interface Prop {
  className?: string;
}

const ProjectTitle = ({ className }: Prop) => {
  const { isProfessional } = useRole();
  const { selectedProject } = useContext(StoreContext);

  const location = useMemo(
    () =>
      `${
        selectedProject?.projectLocation?.country
          ? selectedProject?.projectLocation?.country + ', '
          : ''
      } 
      ${selectedProject?.projectLocation?.state}
      ${
        selectedProject?.projectLocation?.city ? ', ' + selectedProject?.projectLocation?.city : ''
      }`,
    [selectedProject]
  );

  return (
    <div
      className={
        'w-full flex-col  flex lg:flex-row rounded-lg mt-10  px-5 sm:px-12 py-8 ' + className
      }>
      <Title title="Project Title" description={selectedProject.pseudoProjectName} />
      <div className="flex-1 mt-8 sm:mt-0">
        {!isProfessional && <ProjectTitleFormToggler />}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <TitleComponent label="Location" value={location} />
          <TitleComponent label="Project Type" value={selectedProject?.projectType} />
          <TitleComponent
            label="Building Type"
            value={
              selectedProject.projectType === 'residential'
                ? selectedProject?.residentialType
                : selectedProject?.commercialType
            }
          />
          <TitleComponent label="Number of Units" value={selectedProject?.numberOfUnits} />
        </div>
      </div>
    </div>
  );
};

export default ProjectTitle;
