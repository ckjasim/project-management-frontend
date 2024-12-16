import React, { useEffect, useState } from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { getAllUsersApi, userManageApi } from '@/services/api/api';
import { useToast } from '@/components/hooks/use-toast';


type User = {
  _id: string;
  name: string;
  email: string;
  organization: any;
  subscription: string;
  isBlock: boolean;
  createdAt: string;
  updatedAt: string;
};

const UserManagement = () => {

const {toast}=useToast()
  const [searchTerm, setSearchTerm] = useState('');
  const [filterOrg, setFilterOrg] = useState('all');
  const [showFilters, setShowFilters] = useState(false);
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const res = await getAllUsersApi();
        const users = res.users.map((user: User) => ({
          ...user,
          createdAt: new Date(user.createdAt).toLocaleDateString('en-GB'),
        }));
        setUsers(users);
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
      
      if (res && res.status === 200) {
        console.log('User status updated:', res.data);
      } else {
        console.error('Error updating user status on backend.');
      }
  
      toast({
        title: ' Employee status has been updated',
        // description: 'invitaion send to employee email',
        variant: 'success',
      });
    } catch (error) {
      console.error('Error updating user status:', error);
      
      
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === userId ? { ...user, isBlock: !user.isBlock } : user
        )
      );
      


    }
  };
  

  // Filter and search logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterOrg === 'all' || user.organization?.name?.toLowerCase() === filterOrg.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto h-screen">
   

      <Card className="rounded-lg shadow-md">
        <CardHeader className="border-b border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5">
            <CardTitle className="text-2xl md:text-3xl font-semibold">
              User Management
            </CardTitle>
            <Button
              variant="outline"
              className="flex items-center gap-2 w-full md:w-auto"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter size={18} />
              Filter
            </Button>
          </div>

          {showFilters && (
  <div className="mt-6 p-6 bg-gray-50 rounded-lg space-y-4">
    <div className="text-base font-medium">Organization</div>
    <div className="flex flex-wrap gap-3">
      {[
        { organization: { _id: 'all', name: 'all' } }, 
        ...users,
      ].map((org) => (
        <Button
          key={org.organization._id}
          variant={filterOrg === org.organization.name ? 'default' : 'outline'}
          size="sm"
          onClick={() => setFilterOrg(org.organization.name)}
          className={filterOrg === org.organization.name ? 'bg-blue-600' : ''}
        >
          {org.organization.name.charAt(0).toUpperCase() + org.organization.name.slice(1)}
        </Button>
      ))}
    </div>
  </div>
)}


          <div className="flex-1 max-w-xl mx-8">
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search by name or organization..."
                className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-lg border-none focus:ring-2 focus:ring-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </CardHeader>

        <CardContent className="p-0 md:p-8">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              <div className="hidden md:grid grid-cols-6 gap-8 px-6 py-4 bg-gray-50 rounded-t-lg font-semibold text-gray-600">
                <div>Name</div>
                <div>Organization</div>
                <div>Subscription</div>
                <div>Date Joined</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No users match your search criteria
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user._id}
                    className="flex flex-col md:grid md:grid-cols-6 gap-4 md:gap-8 px-6 py-6 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="md:hidden grid grid-cols-2 gap-4">
                      <div className="font-medium text-gray-500">Name:</div>
                      <div>{user.name}</div>
                      <div className="font-medium text-gray-500">Organization:</div>
                      <div>{user.organization?.name}</div>
                      <div className="font-medium text-gray-500">Subscription:</div>
                      <div>{user.organization?.subscriptionTier}</div>
                      <div className="font-medium text-gray-500">Date Joined:</div>
                      <div>{user.createdAt}</div>
                      <div className="font-medium text-gray-500">Status:</div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                          }`}
                        >
                          {user.isBlock ? 'Blocked' : 'Active'}
                        </span>
                      </div>
                    </div>

                    <div className="hidden md:block font-medium">{user.name}</div>
                    <div className="hidden md:block">{user?.organization?.name}</div>
                    <div className="hidden md:block">{user.organization?.subscriptionTier}</div>
                    <div className="hidden md:block text-gray-600">{user.createdAt}</div>
                    <div className="hidden md:block">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.isBlock ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {user.isBlock ? 'Blocked' : 'Active'}
                      </span>
                    </div>

                    <div className="flex items-center gap-4 justify-end md:justify-start">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBlock(user._id,user.email)}
                        className={`${user.isBlock ? 'bg-green-600' : 'bg-red-600'} hover:${
                          user.isBlock ? 'bg-green-700' : 'bg-red-700'
                        }`}
                      >
                        {user.isBlock ? 'Unblock' : 'Block'}
                      </Button>
                      <Button variant="ghost" size="icon" className="h-10 w-10">
                        <MoreVertical size={18} />
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagement;
