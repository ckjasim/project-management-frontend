import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/pages/auth/AuthLayout";
import { UserLoginHero } from "@/pages/auth/userAuth/UserLoginHero";
import { UserSignUpHero } from "@/pages/auth/userAuth/UserSignUpHero";
import { EmployeeSignUpHero } from "@/pages/auth/employeeAuth/EmployeeSignUpHero";
import  EmployeeLoginHero  from "@/pages/auth/employeeAuth/EmployeeLoginHero";
import { AdminLoginHero } from "@/pages/auth/adminAuth/AdminLoginHero";
import TaskLayout from "@/pages/Employee/EmployeeLayout";
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

const router = createBrowserRouter([
  // {
  //   path: "/",
  //   element: <Navigate replace={true} to={"/auth/userlogin"} />, 
  // },
  {
    element: <AuthLayout />, 
    children: [
      {
        path: "auth",  
        children: [
          {
            path: "userlogin",
            element: <UserLoginHero />,
          },
          {
            path: "userSignup",
            element: <UserSignUpHero />,
          },
          {
            path: "employeesignup",
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
            path: "task",
            element: <TaskManagement/>,
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
          
          
        ],
      },
    ],
  },
]);

export default router;
