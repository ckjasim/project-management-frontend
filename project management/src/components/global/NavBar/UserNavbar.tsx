import { useEffect, useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {  useNavigate } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { checkPremiumApi, logoutApi } from '@/services/api/authApi';
import { useToast } from '@/components/hooks/use-toast';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import {
  BellRing,
  CalendarClock,
  Group,
  LayoutDashboard,
  LogOut,
  MessagesSquare,
  Sparkles,
  SquareDashedKanban,
  Users,
} from 'lucide-react';
import { Logo, LogoIcon } from './logo';

export function UserNavbar() {
  const [open, setOpen] = useState(false);
  const [isPremium, setIsPremium] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { userInfo } = useSelector((state: RootState) => state.Auth);

useEffect(() => {
    const checkPremium = async () => {
      const res = await checkPremiumApi();
      console.log(res, 'jkjkjkjkjk');
      if (res.premium === true) {
        setIsPremium(true);
      }
    };
    checkPremium();
  }, []);
  const logout = async () => {
    try {
      const res = await logoutApi();
      console.log(res, 'logout successfully');
      localStorage.removeItem('user');
      toast({
        title: 'Logout Successful',
        description: 'Successfully logged out!',
        variant: 'success',
      });
      navigate('/auth/userLogin', { replace: true });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const links = [
    {
      label: 'Dashboard',
      href: '/user/dashboard',
      icon: (
        <LayoutDashboard className="text-yellow-100 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Projects',
      href: '/user/projects',
      icon: (
        <SquareDashedKanban className="text-yellow-100 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Teams',
      href: '/user/teams',
      icon: (
        <Group className="text-yellow-100 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Chat',
      href: '/user/chat',
      icon: (
        <MessagesSquare className="text-yellow-100 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    isPremium &&{
      label: 'Meeting',
      href: '/user/meet',
      icon: (
        <CalendarClock className="text-yellow-100 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Employees',
      href: '/user/employees',
      icon: (
        <Users className="text-yellow-100 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Logout',
      onClick: logout,
      icon: (
        <LogOut className="text-yellow-100 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
  ];


  return (
    <div
      className={cn(
        ' p-3 flex flex-col md:flex-row bg-gradient-to-br from-zinc-50 to-zinc-50 dark:bg-neutral-800  overflow-hidden',
        'h-screen'
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}

            <div className="mt-8 flex flex-col gap-2">
  {links
    .filter((link): link is any => typeof link !== "boolean") // Filter out boolean values
    .map((link, idx) => (
      <SidebarLink key={idx} link={link} />
    ))}
</div>

          </div>
          <div>
            <SidebarLink
              link={{
                label: 'Notifications',
                href: '/user/notification',
                icon: (
                  <BellRing className="text-yellow-100 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
                ),
              }}
            />
            {(isPremium ===false && <SidebarLink
              link={{
                label: 'Upgrade to Premium',
                href: '/user/premium',
                icon: (
                  <div
                    className="p-2 bg-gradient-to-r from-amber-200 to-yellow-400 hover:from-amber-300 hover:to-yellow-500 text-black font-medium flex items-center justify-center rounded-lg"
                  >
                    <Sparkles className="h-4 w-4" />
                  </div>
                ),
              }}
            /> )}
          <SidebarLink
  link={{
    label: `${userInfo?.name || 'User'}`,
    href: '#',
    icon: (
      <div className="h-7 w-7 flex-shrink-0 rounded-full bg-teal-500 text-white flex items-center justify-center">
        {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
      </div>
    ),
  }}
/>

          </div>
        </SidebarBody>
      </Sidebar>
    </div>
  );
}



