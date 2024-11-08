// import React from 'react';
// import { Navigate } from 'react-router-dom';
// import { getUserRole } from '@/utils/jwt/jwt'; 
// import Cookies from 'js-cookie'; 

// interface AuthGuardProps {
//   children: React.ReactNode;
//   allowedRoles: string[]; 
// }

// const AuthGuard: React.FC<AuthGuardProps> = ({ children, allowedRoles }) => {
  
//   // const token = Cookies.get('jwt'); 
// console.log(token,'token sett')
 
//   const userRole = token ? getUserRole(token) : null;
// console.log(userRole,'userrole sett');

 
//   if (!token || !allowedRoles.includes(userRole as string)) {
//     return <Navigate to="/auth/userlogin" replace />;
//   }

//   return <>{children}</>; 
// };

// export default AuthGuard;

