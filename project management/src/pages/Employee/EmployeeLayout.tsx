import { EmployeeNavbar } from '@/components/global/NavBar/EmployeeNavbar';
import { Outlet } from 'react-router-dom';

const EmployeeLayout = () => {
  return (
    <div className="flex flex-row h-screen">
      <EmployeeNavbar />
      <div className="flex-1 overflow-auto">
        <Outlet />
      </div>
    </div>
  );
};

export default EmployeeLayout;
