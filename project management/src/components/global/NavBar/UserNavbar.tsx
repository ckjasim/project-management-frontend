import React, { useEffect, useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
  IconArrowLeft,
  IconBrandTabler,
  IconCalendarUser,
  IconMessageChatbot,
  IconFolders,
  IconDeviceProjector,
} from '@tabler/icons-react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Modal from '@/components/global/Modal/Modal';
import {
  postTasksApi,
  logoutApi,
  patchTaskStatusApi,
} from '@/services/api/api';
import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';

const TodoSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  summary: Yup.string().required('Summary is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date().required('Due date is required'),
});

export function UserNavbar() {
  const [open, setOpen] = useState(false);
  const navigate=useNavigate()

  const logout = async () => {
    try {
      console.log('dddddddddddddddd')
      const res = await logoutApi();
      console.log(res, 'logout successfully');

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
        <IconBrandTabler className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Projects',
      href: '/user/projects',
      icon: (
        <IconDeviceProjector className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Chat',
      href: '/user/chat',
      icon: (
        <IconMessageChatbot className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Meeting',
      href: '/user/meeting',
      icon: (
        <IconCalendarUser className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Files',
      href: '/user/files',
      icon: (
        <IconFolders className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Logout',
      onClick: logout, 
      href: '/auth/userLogin',
      icon: (
        <IconArrowLeft className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
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
                label: 'jasim ck',
                href: '#',
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
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
