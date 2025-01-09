"use client";
import { Home, Users2, Contact } from "lucide-react";
import { FloatingNav } from "@/components/ui/floating-navbar-landing";
export function LandingNavbar() {
  const navItems = [
    {
      name: "Home",
      link: "/admin/dashboard",
      icon: <Home className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "Contact",
      link: "/employee/chat",
      icon: <Contact className="h-4 w-4 text-neutral-500 dark:text-white" />,
    },
    {
      name: "About Us",
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

