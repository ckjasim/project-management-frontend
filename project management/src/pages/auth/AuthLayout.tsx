import { LandingNavbar } from '@/components/global/NavBar/LandingNavbar';
import { Outlet } from 'react-router-dom';

const AuthLayout = () => {
  return (
    <div className="relative  w-full ">
      <LandingNavbar />
      {/* <div className="mt-28 bg-gradient-to-br from-slate-50 to-gray-100 p-4"></div> */}
      <Outlet />
    </div>
  );
};

export default AuthLayout;
