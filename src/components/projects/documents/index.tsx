import { Outlet } from 'react-router-dom';

const Index = () => (
  <div className="w-full max-w-[1200px] 3xl:max-w-[90%] h-full mx-auto ">
    <Outlet />
  </div>
);

export default Index;
