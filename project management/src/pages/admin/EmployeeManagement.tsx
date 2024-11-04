import React, { useState } from 'react';
import { Search, Filter, MoreVertical } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';

const EmployeeManagement = () => {
  const [showAlert, setShowAlert] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const initialUsers = [
    { id: 1, name: 'Jasim Ahmed', dateJoined: '12/12/2024', status: 'active', blocked: false },
    { id: 2, name: 'Sarah Wilson', dateJoined: '15/12/2024', status: 'active', blocked: false },
    { id: 3, name: 'Mike Johnson', dateJoined: '18/12/2024', status: 'inactive', blocked: true },
    { id: 4, name: 'Emma Davis', dateJoined: '20/12/2024', status: 'active', blocked: false },
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
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || user.status.toLowerCase() === filterStatus.toLowerCase();
    return matchesSearch && matchesFilter;
  });

  return (
    <div className="p-6 md:p-8 max-w-7xl mx-auto">
      {showAlert && (
        <Alert className="mb-6 bg-red-50 border-red-200">
          <AlertDescription className="text-red-800">
            Employee status has been updated
          </AlertDescription>
        </Alert>
      )}

      <Card className="rounded-lg shadow-md">
        <CardHeader className="border-b border-gray-200 p-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 py-5">
            <CardTitle className="text-2xl md:text-3xl font-semibold">
              Employee Management
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
              <div className="text-base font-medium">Status</div>
              <div className="flex flex-wrap gap-3">
                {['all', 'active', 'inactive'].map((status) => (
                  <Button
                    key={status}
                    variant={filterStatus === status ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setFilterStatus(status)}
                    className={filterStatus === status ? 'bg-blue-600' : ''}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </Button>
                ))}
              </div>
            </div>
          )}

          <div className="mt-6 relative">
            <Search
              className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={22}
            />
            <input
              type="text"
              placeholder="Search by name..."
              className="w-full pl-12 pr-5 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </CardHeader>

        <CardContent className="p-0 md:p-8">
          <div className="overflow-x-auto">
            <div className="min-w-full">
              {/* Header */}
              <div className="hidden md:grid grid-cols-4 gap-8 px-6 py-4 bg-gray-50 rounded-t-lg font-semibold text-gray-600">
                <div>Name</div>
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
                    className="flex flex-col md:grid md:grid-cols-4 gap-4 md:gap-8 px-6 py-6 border-b hover:bg-gray-50 transition-colors"
                  >
                    <div className="font-medium text-gray-500 md:hidden">Name:</div>
                    <div>{user.name}</div>

                    <div className="font-medium text-gray-500 md:hidden">Date Joined:</div>
                    <div>{user.dateJoined}</div>

                    <div className="font-medium text-gray-500 md:hidden">Status:</div>
                    <div>
                      <span
                        className={`px-3 py-1 rounded-full text-sm ${
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                      </span>
                    </div>

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

export default EmployeeManagement;
