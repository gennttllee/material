import Loader from 'components/shared/Loader';
import { StoreContext } from 'context';
import { FC, ReactNode, useContext } from 'react';
import useRole from '../../Hooks/useRole';

interface Props {
  children: ReactNode;
}

const ErrorBoundary: FC<Props> = ({ children }) => {
  const { isProfessional } = useRole();
  const { data, isLoading } = useContext(StoreContext);

  if (!data || !data[0]) return <Loader />;

  const TH = !isLoading && data.length > 0 ? children : isProfessional ? children : null;

  return <>{TH}</>;
};

export default ErrorBoundary;
