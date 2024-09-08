import { StoreContext } from 'context';
import React, { useContext } from 'react';
import { Brief } from 'types';
import ProjectCard from './Components/ProjectCard';
import Layout from './Layout';
import GridItems from './Layout/GridItems';

export default function AllProjects() {
  const { menuProjects } = useContext(StoreContext);


  return (
    <Layout path="all">
      <GridItems<Brief>
        label="all"
        showMore={false}
        paginationEnabled
        Card={ProjectCard}
        data={menuProjects}
      />
    </Layout>
  );
}
