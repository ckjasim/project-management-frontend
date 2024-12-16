import { UserNavbar } from '@/components/global/NavBar/UserNavbar';
import { Outlet } from 'react-router-dom';
import { Bell, } from 'lucide-react';
import {  useState } from 'react';
import { NotificationModal } from '@/components/global/Modal/NotificationModal';

// Notification Modal Component


export const UserLayout = () => {
  const [showNotModal, setShowNotModal] = useState(false);
  
  const toggleNotification = () => {
    setShowNotModal(!showNotModal);
  }
  
  return (
    <div className="flex flex-row h-screen relative">
      <UserNavbar />
      <div className="flex-1 overflow-auto">
        <div className="fixed top-4 right-0 z-50">
          <div className="w-12 h-18 bg-gray-200 rounded-l-full shadow-lg flex items-center">
            <button 
              className="p-2 ml-1 hover:bg-gray-300 rounded-full" 
              onClick={toggleNotification}
            >
              <Bell size={20} />
            </button>
          </div>
        </div>
        
        <Outlet />
        
   
        {showNotModal && (
          <NotificationModal onClose={() => setShowNotModal(false)} />
        )}
      </div>
    </div>
  );
};