import React, { useEffect, useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';

import {        
  SquareDashedKanban,
  MessagesSquare,
  CalendarClock,
  FolderTree,
  LogOut,

  BellRing,                  
} from 'lucide-react';

import {  useNavigate } from 'react-router-dom';

import { cn } from '@/lib/utils';

import {
  checkPremiumApi,
  // postTasksApi,
  logoutApi,
  // patchTaskStatusApi,
} from '@/services/api/authApi';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Logo, LogoIcon } from './logo';





export function EmployeeNavbar() {
  const [open, setOpen] = useState(false);
  const navigate=useNavigate()
  const {userInfo}=useSelector((state:RootState)=>(state.Auth))

  const [isPremium, setIsPremium] = useState(false);
useEffect(() => {
    const checkPremium = async () => {
      const res = await checkPremiumApi();
      console.log(res, 'jkjkjkjkjk');
      if (res.premium === true) {
        setIsPremium(true);
      }
    };
    checkPremium();
  }, []);
  const logout = async () => {
    try {
      const res = await logoutApi();
      localStorage.removeItem('user')
      navigate('/auth/employeeLogin',{ replace: true })
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const links = [
    {
      label: 'Projects',
      href: '/employee/projects',
      icon: (
        <SquareDashedKanban className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    
    {
      label: 'Chat',
      href: '/employee/chat',
      icon: (
        <MessagesSquare className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    isPremium &&{
      label: 'Meeting',
      href: '/employee/meet',
      icon: (
        <CalendarClock className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    // {
    //   label: 'Files',
    //   href: '/employee/files',
    //   icon: (
    //     <FolderTree className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
    //   ),
    // },
    {
      label: 'Logout',
      onClick: logout, 
      icon: (
        <LogOut className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
  ];

  return (
    <div
      className={cn(
        ' p-3 flex flex-col md:flex-row bg-gray-50 dark:bg-neutral-800  overflow-hidden',
        'h-screen'// for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
          <SidebarLink
              link={{
                label: 'Notifications',
                href: '/employee/notification',
                icon:(
                  <BellRing className="text-yellow-100 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
                ),
              }}
            />
            <SidebarLink
              link={{
                label: `${userInfo?.name}`,
                href: '#',
                icon: (
                  <img
                    src=""
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}


