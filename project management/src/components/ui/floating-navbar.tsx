"use client";

import  { useState, useCallback } from "react";
import {
  motion,
  AnimatePresence,
  useScroll,
  useMotionValueEvent,
} from "framer-motion";
import { cn } from "@/lib/utils";
import { Link, useNavigate } from "react-router-dom";
import { logoutApi } from "@/services/api/authApi";

type NavItem = {
  name: string;
  link: string;
  icon?: JSX.Element;
};

export const FloatingNav = ({
  navItems,
  className,
}: {
  navItems: NavItem[];
  className?: string;
}) => {
  const { scrollYProgress } = useScroll();
  const [visible, setVisible] = useState(true);
  const navigate=useNavigate()
  const logout = async () => {
     try {
       await logoutApi();
       localStorage.removeItem('user')
       navigate('/auth/adminLogin',{ replace: true })
     } catch (error) {
       console.error('Logout failed:', error);
     }
   };
  // Memoized scroll handler for better performance
  const handleScroll = useCallback(() => {
    const current = scrollYProgress.get();
    const previous = scrollYProgress.getPrevious() ?? 0;
    const direction = current - previous;

    setVisible(current < 0.05 || direction < 0);
  }, [scrollYProgress]);

  // Attach the scroll event handler
  useMotionValueEvent(scrollYProgress, "change", handleScroll);

  return (
    <AnimatePresence mode="wait">
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -100 }}
          transition={{ duration: 0.2 }}
          className={cn(
            "flex max-w-fit fixed top-10 inset-x-0 mx-auto border border-transparent dark:border-white/[0.2] rounded-full dark:bg-black bg-white shadow-md z-[5000] pr-2 pl-8 py-2 items-center justify-center space-x-4",
            className
          )}
        >
          {navItems.map(({ name, link, icon }, idx) => (
            <Link
              key={`nav-item-${idx}`}
              to={link}
              className={cn(
                "relative flex items-center space-x-1 text-neutral-600 dark:text-neutral-50 hover:text-neutral-500 dark:hover:text-neutral-300"
              )}
            >
              <span className="block sm:hidden">{icon}</span>
              <span className="hidden sm:block text-sm">{name}</span>
            </Link>
          ))}
          <button  onClick={ logout}  className="border text-sm font-medium relative border-neutral-200 dark:border-white/[0.2] text-black dark:text-white px-4 py-2 rounded-full">
            <span>Logout</span>
            <span className="absolute inset-x-0 w-1/2 mx-auto -bottom-px bg-gradient-to-r from-transparent via-blue-500 to-transparent h-px" />
          </button>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
