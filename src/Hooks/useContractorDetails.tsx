import { useCallback, useEffect, useState } from 'react';
import { postForm } from '../apis/contratorApi';
// import axios from "axios";

const useContractorDetails = (id: string, type: string) => {
  const controller = new AbortController();
  const [details, setDetails] = useState<any>({});
  const [image, setImage] = useState('');
  const [loading, setLoading] = useState(false);
  const fetchContractor = async () => {
    setLoading((_) => true);
    let { response } = await postForm(
      'get',
      `professionals/${type}/filter/id/${id}`,
      controller,
      {},
      'iam'
    );
    if (response) {
      setDetails((_: any) => response.data.data[0]);
      setImage((_: any) => response.data.data[0]?.businessInformation?.logo);
    }
    setLoading((_) => false);
  };

  let fetchDetails = useCallback(() => {
    fetchContractor();
    // eslint-disable-next-line
  }, [id, type]);
  useEffect(() => {
    fetchDetails();
    return () => {
      controller.abort();
    };
    // eslint-disable-next-line
  }, [id, type]);

  // useEffect(() => {
  //   fetchContractor();
  //   // eslint-disable-next-line
  //   return controller.abort();
  // }, [id, type]);

  return { details, image, loading };
};

export default useContractorDetails;
