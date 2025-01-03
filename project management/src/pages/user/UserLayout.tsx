import { UserNavbar } from '@/components/global/NavBar/UserNavbar';
import { Outlet } from 'react-router-dom';

export const UserLayout = () => {
  

  
  return (
    <div className="flex flex-row h-screen relative">
      <UserNavbar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};