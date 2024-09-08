import { Outlet } from 'react-router-dom';

const Index = () => {
  return (
    <div className="w-full flex flex-col h-full max-w-[1100px] m-auto ">
      <Outlet />
    </div>
  );
};

export default Index;
