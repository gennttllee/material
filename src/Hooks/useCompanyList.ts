import React from 'react';
import { useAppSelector } from 'store/hooks';

const useCompanyList = () => {
  let developers = useAppSelector((m) => m.developers);

  let companyList = React.useMemo(() => {
    let companies = developers.data
      .map((m) => m.companyName)
      .filter((m) => m)
      .map((m) => {
        return { value: m, label: m };
      });
    return [{ label: 'General', value: 'General' }, ...companies] || [];
  }, [developers.data]);

  return companyList;
};

export default useCompanyList;
