import NavBar from '@/components/global/NavBar/NavBar'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div>
    <NavBar/>
    <Outlet/>
    </div>
  )
}

export default AuthLayout
