import React, {  useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

import {

  logoutApi,
 
} from '@/services/api/api';
import { useToast } from '@/components/hooks/use-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { CalendarClock, FolderTree, Group, LayoutDashboard, LogOut, MessagesSquare, SquareDashedKanban, Users} from 'lucide-react';

export function UserNavbar() {
  const [open, setOpen] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const navigate=useNavigate()
  const{toast}=useToast()
  const {userInfo}=useSelector((state:RootState)=>(state.Auth))

  const logout = async () => {
    try {
      const res = await logoutApi();
      console.log(res, 'logout successfully');
      localStorage.removeItem('user')
      toast({
        title: "Logout Successful",
        description:"Successfully logged out!",
        variant: 'success',
      });
      navigate('/auth/userLogin')
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const links = [
    {
      label: 'Dashboard',
      href: '/user/dashboard',
      icon: (
        <LayoutDashboard className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Projects',
      href: '/user/projects',
      icon: (
        <SquareDashedKanban className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Teams',
      href: '/user/teams',
      icon: (
        <Group className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Chat',
      href: '/user/chat',
      icon: (
        <MessagesSquare className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Meeting',
      href: '/user/meeting',
      icon: (
        <CalendarClock  className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Files',
      href: '/user/files',
      icon: (
        <FolderTree className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Employees',
      href: '/user/employees',
      icon: (
        <Users className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
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
