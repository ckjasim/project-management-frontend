import { UserNavbar } from '@/components/global/NavBar/UserNavbar';
import { Outlet } from 'react-router-dom';


// Notification Modal Component


export const UserLayout = () => {
  

  
  return (
    <div className="flex flex-row h-screen relative">
      <UserNavbar />
      <div className="flex-1 overflow-auto">
        
        
        <Outlet />
        
   
        {/* {showNotModal && (
          // <NotificationModal onClose={() => setShowNotModal(false)} />
        )} */}
      </div>
    </div>
  );
};