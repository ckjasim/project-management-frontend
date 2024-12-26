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

import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import {
  postTasksApi,
  logoutApi,
  patchTaskStatusApi,
} from '@/services/api/api';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';



export function EmployeeNavbar() {
  const [open, setOpen] = useState(false);
  const navigate=useNavigate()
  const {userInfo}=useSelector((state:RootState)=>(state.Auth))


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
    {
      label: 'Meeting',
      href: '/employee/meet',
      icon: (
        <CalendarClock className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Files',
      href: '/employee/files',
      icon: (
        <FolderTree className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
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
        'rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'h-screen' // for your use case, use `h-screen` instead of `h-[60vh]`
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
                href: '/user/notification',
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

export const Logo = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-5 bg-lime-200 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-lime-200 dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};
