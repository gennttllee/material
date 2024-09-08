import { useState, useEffect } from 'react';

import BidDocuments from './BidDocuments';

import { useAppSelector } from '../../../../../store/hooks';
import { useNavigate } from 'react-router-dom';

interface Docs {
  bidDocuments: any;
  additionalDocs: any;
}
const Index = () => {
  let navigate = useNavigate();
  let bid = useAppSelector((m) => m.bid);
  const init = () => {
    if (!bid?._id) {
      navigate('/projects/bid');
    } else {
      separateDocs();
    }
  };
  useEffect(() => {
    init();
  }, []);
  useEffect(() => {
    init();
  }, [bid]);
  const [separated, setSeparated] = useState<Docs>({
    bidDocuments: [],
    additionalDocs: []
  });
  const separateDocs = () => {
    let additionalDocs: any[] = [],
      bidDocuments: any[] = [];
    additionalDocs = bid.bidDocuments.filter((m: any) => m?.meta?.isAdditional === true);
    bidDocuments = bid.bidDocuments.filter((m: any) => !m?.meta?.isAdditional);
    setSeparated({ additionalDocs, bidDocuments });
  };

  return (
    <>
      <BidDocuments docs={separated.bidDocuments} />
      <BidDocuments docs={separated.additionalDocs} isAdditional />
    </>
  );
};

export default Index;
