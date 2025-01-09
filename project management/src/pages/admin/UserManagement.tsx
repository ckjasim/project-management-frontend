import { useEffect, useState } from 'react';

import { getAllUsersApi, userManageApi } from '@/services/api/authApi';
import { useToast } from '@/components/hooks/use-toast';
import ManagementTable from '@/components/table/table';

type User = {
  _id: string;
  name: string;
  email: string;
  organization?: any;
  createdAt: string;
  isBlock: boolean;
  dateJoined?: string;
};
const UserManagement = () => {
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsersApi();
        const usersData = res.users.map((user: any) => ({
          ...user,
          createdAt: new Date(user.createdAt).toLocaleDateString('en-GB'),
        }));
        setUsers(usersData);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const handleBlock = async (userId: string, email: string) => {
    try {
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlock: !user.isBlock } : user
        )
      );

      const res = await userManageApi(email);
      if (res?.status === 200) {
        toast({
          title: 'User status has been updated',
          variant: 'success',
        });
      }
    } catch (error) {
      console.error('Error updating user status:', error);
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlock: !user.isBlock } : user
        )
      );
    }
  };

  const columns = [
    { key: 'name', label: 'Name' },
    { 
      key: 'organization', 
      label: 'Organization',
      render: (user: any) => user.organization?.name 
    },
    { 
      key: 'subscription', 
      label: 'Subscription',
      render: (user: any) => user.organization?.subscriptionTier 
    },
    { key: 'createdAt', label: 'Date Joined' },
    { 
      key: 'status', 
      label: 'Status',
      render: (user: any) => (
        <span className={`px-3 py-1 rounded-full text-sm ${
          user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
        }`}>
          {user.isBlock ? 'Blocked' : 'Active'}
        </span>
      )
    }
  ];

  const organizations = Array.from(
    new Set(users.map(user => user.organization))
  ).filter(Boolean);

  return (
    <ManagementTable
      title="User Management"
      data={users}
      columns={columns}
      onBlock={handleBlock}
      organizations={organizations}
      filterKey="organization"
      searchPlaceholder="Search by name or organization..."
    />
  );
};

export default UserManagement