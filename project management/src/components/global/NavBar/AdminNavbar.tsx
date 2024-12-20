"use client";


import { Home, Users2, User } from "lucide-react";

import { FloatingNav } from "@/components/ui/floating-navbar";
export function AdminNavbar() {
  const navItems = [
    {
      name: "Dashboard",
      link: "/admin/dashboard",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "User",
      link: "/admin/userManagement",
      icon: <User className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Employee",
      link: "/admin/employeeManagement",
      icon: (
        <Users2 className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (

    <div className="relative  w-full">
      <FloatingNav navItems={navItems} />
    </div>
  );
}

