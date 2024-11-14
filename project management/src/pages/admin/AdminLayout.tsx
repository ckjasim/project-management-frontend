import { AdminNavbar } from '@/components/global/NavBar/AdminNavbar';
import { SideNavbar } from '@/components/global/NavBar/UserNavbar';
import { Outlet } from 'react-router-dom';

export const AdminLayout = () => {
  return (
  <div className='relative  w-full '>

      <AdminNavbar/>
      <div className='mt-28'></div>
        <Outlet />
      </div>
   
  );
};


