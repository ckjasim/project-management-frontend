import { createBrowserRouter } from "react-router-dom";
import AuthLayout from "@/pages/auth/AuthLayout";
import { UserLoginHero } from "@/pages/auth/userAuth/UserLoginHero";
import { UserSignUpHero } from "@/pages/auth/userAuth/UserSignUpHero";
import { EmployeeSignUpHero } from "@/pages/auth/employeeAuth/EmployeeSignUpHero";
import { EmployeeLoginHero } from "@/pages/auth/employeeAuth/EmployeeLoginHero";
import { AdminLoginHero } from "@/pages/auth/adminAuth/AdminLoginHero";
import TaskLayout from "@/pages/Employee/EmployeeLayout";
import EmployeeLayout from "@/pages/Employee/EmployeeLayout";

import { InputOTPForm } from "@/pages/auth/userAuth/otp";
import { SidebarDemo } from "@/pages/Employee/Task";
import { EmployeeOtpForm } from "@/pages/auth/employeeAuth/employeeOtp";

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
            element: <SidebarDemo/>,
          },
          
        ],
      },
    ],
  },
]);

export default router;
