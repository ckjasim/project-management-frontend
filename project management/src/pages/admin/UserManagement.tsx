import React, { useState } from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const UserManagement = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSubscription, setFilterSubscription] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const initialUsers = [
    { id: 1, name: 'Jasim Ahmed', subscription: 'Premium', dateJoined: '12/12/2024', status: 'active', blocked: false },
    { id: 2, name: 'Sarah Wilson', subscription: 'Basic', dateJoined: '15/12/2024', status: 'active', blocked: false },
    { id: 3, name: 'Mike Johnson', subscription: 'Premium', dateJoined: '18/12/2024', status: 'inactive', blocked: true },
    { id: 4, name: 'Emma Davis', subscription: 'Basic', dateJoined: '20/12/2024', status: 'active', blocked: false },
  ];

  const [users, setUsers] = useState(initialUsers);

  const handleBlock = (userId:number) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user.id === userId ? { ...user, blocked: !user.blocked } : user
      )
    );
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000);
  };

  // Filter and search logic
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.subscription.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter =
      filterSubscription === 'all' ||
      user.subscription.toLowerCase() === filterSubscription.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {showAlert && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            User status has been updated
          </AlertDescription>
        </Alert>
      )}

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

          {/* Filters Panel */}
          {showFilters && (
            <div className="mt-6 p-6 bg-gray-50 rounded-lg space-y-4">
              <div className="text-base font-medium">Subscription Type</div>
              <div className="flex flex-wrap gap-3">
                {['all', 'Premium', 'Basic'].map((type) => (
                  <Button
                    key={type}
                    variant={
                      filterSubscription === type ? 'default' : 'outline'
                    }
                    size="sm"
                    onClick={() => setFilterSubscription(type)}
                    className={
                      filterSubscription === type ? 'bg-blue-600' : ''
                    }
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
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
              placeholder="Search by name or subscription..."
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
              {/* Header */}
              <div className="hidden md:grid grid-cols-5 gap-8 px-6 py-4 bg-gray-50 rounded-t-lg font-semibold text-gray-600">
                <div>Name</div>
                <div>Subscription</div>
                <div>Date Joined</div>
                <div>Status</div>
                <div>Actions</div>
              </div>

              {/* Mobile and Desktop Rows */}
              {filteredUsers.length === 0 ? (
                <div className="p-12 text-center text-gray-500">
                  No users match your search criteria
                </div>
              ) : (
                filteredUsers.map((user) => (
                  <div
                    key={user.id}
                    className="flex flex-col md:grid md:grid-cols-5 gap-4 md:gap-8 px-6 py-6 border-b hover:bg-gray-50 transition-colors"
                  >
                    {/* Mobile Labels & Content */}
                    <div className="md:hidden grid grid-cols-2 gap-4">
                      <div className="font-medium text-gray-500">Name:</div>
                      <div>{user.name}</div>

                      <div className="font-medium text-gray-500">
                        Subscription:
                      </div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.subscription === 'Premium'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {user.subscription}
                        </span>
                      </div>

                      <div className="font-medium text-gray-500">
                        Date Joined:
                      </div>
                      <div>{user.dateJoined}</div>

                      <div className="font-medium text-gray-500">Status:</div>
                      <div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm ${
                            user.status === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {user.status.charAt(0).toUpperCase() +
                            user.status.slice(1)}
                        </span>
                      </div>
                    </div>

                    {/* Desktop View */}
                    <div className="hidden md:block font-medium">
                      {user.name}
                    </div>
                    <div className="hidden md:block">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.subscription === 'Premium'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {user.subscription}
                      </span>
                    </div>
                    <div className="hidden md:block text-gray-600">
                      {user.dateJoined}
                    </div>
                    <div className="hidden md:block">
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() +
                          user.status.slice(1)}
                      </span>
                    </div>

                    {/* Actions - Both Mobile & Desktop */}
                    <div className="flex items-center gap-4 justify-end md:justify-start">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => handleBlock(user.id)}
                        className={`${
                          user.blocked ? 'bg-green-600' : 'bg-red-600'
                        } hover:${user.blocked ? 'bg-green-700' : 'bg-red-700'}`}
                      >
                        {user.blocked ? 'Unblock' : 'Block'}
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
