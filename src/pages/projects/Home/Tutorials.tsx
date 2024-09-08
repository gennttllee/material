import React from 'react';
import TutorialCard, { GettingStartedProps } from './Components/TutorialCard';
import Layout from './Layout';
import whiteguy from '../../../assets/tutorials/Rectangle 17.svg';
import whiteguy_1 from '../../../assets/tutorials/Rectangle 17-1.svg';
import whiteguy_2 from '../../../assets/tutorials/Rectangle 17-2.svg';
import whiteguy_3 from '../../../assets/tutorials/Rectangle 17-3.svg';
import whiteguy_4 from '../../../assets/tutorials/Rectangle 17-4.svg';
import whiteguy_5 from '../../../assets/tutorials/Rectangle 17-5.svg';
import whiteguy_6 from '../../../assets/tutorials/Rectangle 17-6.svg';
import whiteguy_7 from '../../../assets/tutorials/Rectangle 17-7.svg';
import whiteguy_8 from '../../../assets/tutorials/Rectangle 17-8.svg';
import whiteguy_9 from '../../../assets/tutorials/Rectangle 17-9.svg';
import whiteguy_10 from '../../../assets/tutorials/Rectangle 17-10.svg';
import whiteguy_11 from '../../../assets/tutorials/Rectangle 17-11.svg';
import GridItems from './Layout/GridItems';

const GettingStartedData: GettingStartedProps[] = [
  {
    label: 'Getting Started',
    image: whiteguy
  },
  {
    label: 'Creating a project',
    image: whiteguy_1
  },
  {
    label: 'Vetting  contractors',
    image: whiteguy_2
  },
  {
    label: 'Selecting bid winner',
    image: whiteguy_11
  },
  {
    label: 'Getting Started',
    image: whiteguy_3
  },
  {
    label: 'Creating a project',
    image: whiteguy_4
  },
  {
    label: 'Vetting  contractors',
    image: whiteguy_5
  },
  {
    label: 'Selecting bid winner',
    image: whiteguy_6
  },
  {
    label: 'Getting Started',
    image: whiteguy_7
  },
  {
    label: 'Creating a project',
    image: whiteguy_8
  },
  {
    label: 'Vetting  contractors',
    image: whiteguy_9
  },
  {
    label: 'Selecting bid winner',
    image: whiteguy_10
  }
];

export default function Tutorials() {
  return <></>;
  // const Children = (
  //   <GridItems<GettingStartedProps>
  //     data={GettingStartedData}
  //     Card={TutorialCard}
  //     gridClassName="!gap-6"
  //     label="tutorials"
  //     showMore={false}
  //   />
  // );

  // return <Layout path="tutorials" {...{ Children }} />;
}
