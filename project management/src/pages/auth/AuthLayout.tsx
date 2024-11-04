
import { UserNavbar } from '@/components/global/NavBar/LandingNavbar'
import { Outlet } from 'react-router-dom'

const AuthLayout = () => {
  return (
    <div className='relative  w-full '>
    <UserNavbar/>
    <div className='mt-28'></div>

    <Outlet/>
    </div>
  )
}

export default AuthLayout
