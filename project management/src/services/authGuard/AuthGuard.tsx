import { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";



export function ProtectedRoute({ role, children }: { role: string; children: JSX.Element }) {
  const { userInfo } = useSelector((state: RootState) => state.Auth);

  if (!userInfo) {
    // Redirect to login if user is not authenticated
    return <Navigate to="/auth/userLogin" />;
  }

  if (userInfo.role !== role) {
    console.log(userInfo.role,role)
    // Redirect to appropriate dashboard if role doesn't match
    return <Navigate to={`/auth/userLogin`} />;
  }

  return children;
}
