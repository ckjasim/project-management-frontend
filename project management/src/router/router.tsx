import { createBrowserRouter } from 'react-router-dom';

import AuthLayout from '@/pages/auth/AuthLayout';
import { UserLoginHero } from '@/pages/auth/userAuth/UserLoginHero';
import { UserSignUpHero } from '@/pages/auth/userAuth/UserSignUpHero';
import { EmployeeSignUpHero } from '@/pages/auth/employeeAuth/EmployeeSignUpHero';
import EmployeeLoginHero from '@/pages/auth/employeeAuth/EmployeeLoginHero';
import { AdminLoginHero } from '@/pages/auth/adminAuth/AdminLoginHero';

import { InputOTPForm } from '@/pages/auth/userAuth/otp';

import EmployeeLayout from '@/pages/Employee/EmployeeLayout';
import TeamProjectDashboard from '@/pages/Employee/TeamProjectDashboard';
import TaskManagement from '@/pages/Employee/Task';
import MessagesPage from '@/pages/chat/chat';

import { AdminLayout } from '@/pages/admin/AdminLayout';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';
import EmployeeManagement from '@/pages/admin/EmployeeManagement';

import { UserLayout } from '@/pages/user/UserLayout';
import UserDashboard from '@/pages/user/UserDashboard';
import ProjectDashboard from '@/pages/user/projectManagement';
import TaskDashboard from '@/pages/user/TaskDashboard';
import TeamDashboard from '@/pages/user/teamManagement';
import EmployeesPage from '@/pages/user/employeesList';
import { ProtectedRoute } from '@/services/authGuard/AuthGuard';
import TeamList from '@/pages/user/teamList';
import ErrorPage from '@/pages/error/errorPage';

const router = createBrowserRouter([
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      { path: 'userLogin', element: <UserLoginHero /> },
      { path: 'userSignup', element: <UserSignUpHero /> },
      { path: 'employeeSignup', element: <EmployeeSignUpHero /> },
      { path: 'employeeLogin', element: <EmployeeLoginHero /> },
      { path: 'adminLogin', element: <AdminLoginHero /> },
      { path: 'otp', element: <InputOTPForm /> },
    ],
  },
  {
    path: '/employee',
    element: (
      <ProtectedRoute role="employee">
        <EmployeeLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'projects', element: <TeamProjectDashboard /> },
      { path: 'task/:projectId', element: <TaskManagement /> },
      { path: 'chat', element: <MessagesPage /> },
    ],
  },
  {
    path: '/admin',
    element: (
      <ProtectedRoute role="admin">
        <AdminLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <AdminDashboard /> },
      { path: 'userManagement', element: <UserManagement /> },
      { path: 'employeeManagement', element: <EmployeeManagement /> },
    ],
  },
  {
    path: '/user',
    element: (
      <ProtectedRoute role="project manager">
        <UserLayout />
      </ProtectedRoute>
    ),
    children: [
      { path: 'dashboard', element: <UserDashboard /> },
      { path: 'projects', element: <ProjectDashboard /> },
      { path: 'taskManagement/:projectId', element: <TaskDashboard /> },
      { path: 'teams', element: <TeamDashboard /> },
      { path: 'teams/:id', element: <TeamList /> },
      { path: 'chat', element: <MessagesPage /> },
      { path: 'employees', element: <EmployeesPage /> },
    ],
  },
  {
    path: '/error',
    element: (
        <ErrorPage />
    ),
    
  },
  
]);

export default router;
