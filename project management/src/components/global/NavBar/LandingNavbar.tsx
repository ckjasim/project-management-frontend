"use client";
import React from "react";

import { IconHome, IconMessage, IconUser } from "@tabler/icons-react";
import { FloatingNav } from "@/components/ui/floating-navbar-landing";
export function LandingNavbar() {
  const navItems = [
    {
      name: "Home",
      link: "/admin/dashboard",
      icon: <IconHome className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/employee/chat",
      icon: <IconUser className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About Us",
      link: "/admin/employeeManagement",
      icon: (
        <IconMessage className="h-4 w-4 text-neutral-500 dark:text-white" />
      ),
    },
  ];
  return (
    <div className="relative  w-full">
      <FloatingNav navItems={navItems} />

    </div>
  );
}

