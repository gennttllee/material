import { Outlet } from 'react-router-dom';
import { useAppSelector } from '../../../../store/hooks';
import ProfilePage from './profiles';

const Index = () => {
  const modal = useAppSelector((state) => state.profilepage);
  return <div className="w-full">{!modal ? <Outlet /> : <ProfilePage />}</div>;
};

export default Index;
