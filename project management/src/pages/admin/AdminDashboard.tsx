'use client'

import {  XAxis, YAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useEffect, useState } from 'react';
import { getAllOrganizationApi, getAllUsersApi } from '@/services/api/authApi';

interface Organization {
  _id: string;
  name: string;
  email: string;
  isActive: boolean;
  subscriptionTier: 'basic' | 'premium';
  billingInfo?: {
    renewalDate: string;
  };
  createdAt: string;
  updatedAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  isBlock: boolean;
  organization: Organization;
  createdAt: string;
  updatedAt: string;
}

interface StatsCardProps {
  icon: React.ReactNode;
  title: string;
  value: string;
  change: string;
  data?: any[];
  color: string;
}

const AdminDashboard = () => {
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [timeframe, setTimeframe] = useState('monthly');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [usersRes, orgRes] = await Promise.all([
          getAllUsersApi(),
          getAllOrganizationApi(),
        ]);
        setUsers(usersRes.users || []);
        setOrganizations(orgRes.users || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  const processUserGrowthData = () => {
    const usersByDate = users.reduce((acc:any, user) => {
      const date = new Date(user.createdAt);
      const key = timeframe === 'monthly' 
        ? `${date.getFullYear()}-${date.getMonth() + 1}`
        : timeframe === 'weekly'
        ? `Week ${Math.ceil((date.getDate() + date.getDay()) / 7)}`
        : date.getFullYear().toString();
      
      acc[key] = (acc[key] || 0) + 1;
      return acc;
    }, {});

    return Object.entries(usersByDate).map(([period, count]) => ({
      period,
      users: count
    })).sort((a, b) => a.period.localeCompare(b.period));
  };

  const userGrowthData = processUserGrowthData();

  const subscriptionStats = {
    premium: organizations.filter(org => org.subscriptionTier === 'premium').length,
    basic: organizations.filter(org => org.subscriptionTier === 'basic').length
  };

  const pieData = [
    { name: 'Premium', value: subscriptionStats.premium },
    { name: 'Basic', value: subscriptionStats.basic }
  ];

  const COLORS = ['#2563EB', '#93C5FD'];
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    ) ;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-gray-50 shadow-sm">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatsCard
            icon={<UserIcon />}
            title="Total Users"
            value={users.length.toString()}
            change={`${users.filter(u => !u.isBlock).length} active users`}
            color="#2563EB"
          />
          <StatsCard
            icon={<BuildingIcon />}
            title="Organizations"
            value={organizations.length.toString()}
            change={`${organizations.filter(o => o.isActive).length} active orgs`}
            color="#2563EB"
          />
          <StatsCard
            icon={<CrownIcon />}
            title="Premium Subscriptions"
            value={subscriptionStats.premium.toString()}
            change={`${((subscriptionStats.premium / organizations.length) * 100).toFixed(1)}% of total`}
            color="#DC2626"
          />
          <StatsCard
            icon={<ChartIcon />}
            title="User Growth Rate"
            value={`${((users.length / (users.length + 10)) * 100).toFixed(1)}%`}
            change="Month over month"
            color="#059669"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle>User Growth</CardTitle>
                <Tabs value={timeframe} onValueChange={setTimeframe}>
                  <TabsList>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                    <TabsTrigger value="yearly">Yearly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={userGrowthData}>
                    <XAxis dataKey="period" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="users" fill="#2563EB" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Subscription Distribution</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={pieData}
                      innerRadius={60}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {pieData.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
              <div className="flex justify-center gap-4">
                {pieData.map((entry, index) => (
                  <div key={entry.name} className="flex items-center">
                    <div className="w-3 h-3 rounded-full mr-2" style={{ backgroundColor: COLORS[index] }} />
                    <span className="text-sm">{entry.name}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Organizations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {organizations.slice(0, 5).map(org => (
                  <div key={org._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                    <div>
                      <h3 className="font-medium">{org.name}</h3>
                      <p className="text-sm text-gray-500">{org.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      org.subscriptionTier === 'premium' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {org.subscriptionTier}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Recent Users</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {users.slice(0, 5).map(user => (
                  <div key={user._id} className="flex items-center justify-between p-4 bg-white rounded-lg shadow-sm border">
                    <div>
                      <h3 className="font-medium">{user.name}</h3>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm ${
                      user.isBlock 
                        ? 'bg-red-100 text-red-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {user.isBlock ? 'Blocked' : 'Active'}
                    </span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
};

// StatsCard component remains the same
const StatsCard: React.FC<StatsCardProps> = ({ icon, title, value, change, color }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex items-center justify-between mb-2">
        <div className="p-2 bg-blue-50 rounded-lg">
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <h3 className="text-sm text-gray-500 font-medium">{title}</h3>
      <p className="text-sm mt-2" style={{ color }}>{change}</p>
    </CardContent>
  </Card>
);

// Icons
const UserIcon = () => (
  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const BuildingIcon = () => (
  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

const CrownIcon = () => (
  <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4l-8 6v10h16V10l-8-6zm0 0v3" />
  </svg>
);

const ChartIcon = () => (
  <svg className="w-6 h-6 text-green-600" viewBox="0 0 24 24" fill="none" stroke="currentColor">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
  </svg>
);

export default AdminDashboard;