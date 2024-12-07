import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/pages/auth/AuthLayout";
import { UserLoginHero } from "@/pages/auth/userAuth/UserLoginHero";
import { UserSignUpHero } from "@/pages/auth/userAuth/UserSignUpHero";
import { EmployeeSignUpHero } from "@/pages/auth/employeeAuth/EmployeeSignUpHero";
import  EmployeeLoginHero  from "@/pages/auth/employeeAuth/EmployeeLoginHero";
import { AdminLoginHero } from "@/pages/auth/adminAuth/AdminLoginHero";
import EmployeeLayout from "@/pages/Employee/EmployeeLayout";


import { InputOTPForm } from "@/pages/auth/userAuth/otp";

import { EmployeeOtpForm } from "@/pages/auth/employeeAuth/employeeOtp";
import { AdminLayout } from "@/pages/admin/AdminLayout";
import { TaskManagement } from "@/pages/Employee/Task";
import UserManagement from "@/pages/admin/UserManagement";
import AdminDashboard from "@/pages/admin/AdminDashboard";
import EmployeeManagement from "@/pages/admin/EmployeeManagement";
import { UserLayout } from "@/pages/user/UserLayout";
import UserDashboard from "@/pages/user/UserDashboard";
import ProjectDashboard from "@/pages/user/projectManagement";
import MessagesPage from "@/pages/chat/chat";
import EmployeesPage from "@/pages/user/employeesList";;
import TeamDashboard from "@/pages/user/teamManagement";
import TaskDashboard from "@/pages/user/TaskDashboard";
import TeamProjectDashboard from "@/pages/Employee/TeamProjectDashboard";

const router = createBrowserRouter([
  {
    element: <AuthLayout />, 
    children: [
      {
        path: "auth",  
        children: [
          {
            path: "userLogin",
            element: <UserLoginHero />,
          },
          {
            path: "userSignup",
            element: <UserSignUpHero />,
          },
          {
            path: "employeeSignup",
            element: <EmployeeSignUpHero />,
          },
          {
            path: "employeeLogin",
            element: <EmployeeLoginHero />,
          },
          {
            path: "adminLogin",
            element: <AdminLoginHero />,
          },
          {
            path: "otp",
            element: <InputOTPForm />,
          },
         
          {
            path: "employeeOtp",
            element: <EmployeeOtpForm />,
          },
        ],
      },
    ],
  },
  {
    element: <EmployeeLayout />, 
    children: [
      {
        path: "employee",  
        children: [
          {
            path: "projects",
            element: <TeamProjectDashboard/>,
          },
          {
            path: "task/:projectId",
            element: <TaskManagement/>,
          },
          {
            path: "chat",
            element: <MessagesPage/>,
          },
          
        ],
      },
    ],
  },
  {
    element: <AdminLayout />, 
    children: [
      {
        path: "admin",  
        children: [
          {
            path: "dashboard",
            element: <AdminDashboard/>,
          },
          {
            path: "userManagement",
            element: <UserManagement/>,
          },
          
          {
            path: "employeeManagement",
            element: <EmployeeManagement/>,
          },
          
        ],
      },
    ],
  },
  {
    element: <UserLayout />, 
    children: [
      {
        path: "user",  
        children: [
          {
            path: "dashboard",
            element: <UserDashboard/>,
          },
          {
            path: "projects",
            element: <ProjectDashboard/>,
          },
          {
            path: "taskManagement/:projectId",
            element: <TaskDashboard/>,
          },
          {
            path: "teams",
            element: <TeamDashboard/>,
          },
          {
            path: "chat",
            element: <MessagesPage/>,
          },
          {
            path: "employees",
            element: <EmployeesPage/>,
          },
          
          
        ],
      },
    ],
  },
]);

export default router;
