import { SideNavbar } from '@/components/global/NavBar/SideNavbar';
import { Outlet } from 'react-router-dom';

export const UserLayout = () => {
  return (
    <div className="flex flex-row h-screen">
      <SideNavbar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};


