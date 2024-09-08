import React, { useContext, useEffect } from 'react';
import PrototypeCard from './Components/PrototypeCard';
import Layout from './Layout';
import GridItems from './Layout/GridItems';
import useFetch from 'Hooks/useFetch';
import { Prototype } from 'types';
import { getAllPrototypes } from 'apis/prototypes';
import { StoreContext } from 'context';

export default function Prototypes() {
  const { prototypes, handleContext } = useContext(StoreContext);
  const { isLoading } = useFetch<Prototype[]>({
    initialData: [],
    onLoadRequest: getAllPrototypes(),
    onSuccess: (prototypes) => handleContext('prototypes', prototypes)
  });

  return (
    <Layout path="prototypes">
      <GridItems<Prototype>
        showMore={false}
        data={prototypes}
        label="prototypes"
        {...{ isLoading }}
        Card={PrototypeCard}
        gridClassName="xl:!grid-cols-3"
      />
    </Layout>
  );
}
