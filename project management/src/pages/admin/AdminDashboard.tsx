'use client'

import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

const AdminDashboard = () => {
  const monthlyData = [
    { month: 'May', users: 50 },
    { month: 'Jun', users: 150 },
    { month: 'Jul', users: 200 },
    { month: 'Aug', users: 350 },
    { month: 'Sep', users: 200 },
    { month: 'Oct', users: 180 },
    { month: 'Nov', users: 220 },
    { month: 'Dec', users: 150 },
    { month: 'Jan', users: 280 },
    { month: 'Feb', users: 320 },
    { month: 'Mar', users: 200 },
    { month: 'Apr', users: 100 },
  ];

  const reviews = [
    { id: 1, name: 'John Doe', message: 'Great service!', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 2, name: 'Jane Smith', message: 'Very helpful team.', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 3, name: 'Bob Johnson', message: 'Excellent product!', avatar: '/placeholder.svg?height=32&width=32' },
    { id: 4, name: 'Alice Brown', message: 'Highly recommended!', avatar: '/placeholder.svg?height=32&width=32' },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        </div>
      </header>

      <div className="p-4 sm:p-6 lg:p-8 flex flex-col lg:flex-row gap-6">
        {/* Main Content */}
        <div className="flex-1 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatsCard
              icon={<UserIcon />}
              title="User Traffic"
              value="08"
              change="10+ more from last week"
              data={monthlyData.slice(-7)}
              color="#2563EB"
            />
            <StatsCard
              icon={<NewUserIcon />}
              title="New Users"
              value="10"
              change="10+ more from last week"
              data={monthlyData.slice(-7)}
              color="#2563EB"
            />
            <StatsCard
              icon={<SubscribedUserIcon />}
              title="Subscribed Users"
              value="10"
              change="08+ more from last week"
              data={monthlyData.slice(-7)}
              color="#DC2626"
            />
          </div>

          {/* User Subscription Chart */}
          <Card>
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
                <h2 className="text-xl font-semibold mb-2 sm:mb-0">User Subscription</h2>
                <Tabs defaultValue="monthly">
                  <TabsList>
                    <TabsTrigger value="daily">Daily</TabsTrigger>
                    <TabsTrigger value="weekly">Weekly</TabsTrigger>
                    <TabsTrigger value="monthly">Monthly</TabsTrigger>
                  </TabsList>
                </Tabs>
              </div>
              <div className="h-64 sm:h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={monthlyData}>
                    <XAxis dataKey="month" axisLine={false} tickLine={false} />
                    <YAxis axisLine={false} tickLine={false} />
                    <Tooltip />
                    <Line 
                      type="monotone" 
                      dataKey="users" 
                      stroke="#2563EB" 
                      strokeWidth={2}
                      dot={{ fill: '#2563EB', strokeWidth: 2 }}
                      fill="url(#colorUv)"
                    />
                    <defs>
                      <linearGradient id="colorUv" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#2563EB" stopOpacity={0.1}/>
                        <stop offset="95%" stopColor="#2563EB" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Reviews Section */}
        <div className="w-full lg:w-80">
          <Card>
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage src={review.avatar} alt={review.name} />
                      <AvatarFallback>{review.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">{review.name}</h3>
                      <p className="text-sm text-muted-foreground">{review.message}</p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

const StatsCard = ({ icon, title, value, change, data, color }) => (
  <Card>
    <CardContent className="p-4">
      <div className="flex justify-between items-start mb-2">
        <div className="p-2 bg-blue-100 rounded-lg">
          {icon}
        </div>
        <span className="text-2xl font-bold">{value}</span>
      </div>
      <p className="text-muted-foreground text-sm mb-2">{title}</p>
      <div className="h-12">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <Line type="monotone" dataKey="users" stroke={color} strokeWidth={2} dot={false} />
          </LineChart>
        </ResponsiveContainer>
      </div>
      <p className="text-sm text-blue-600 mt-2">{change}</p>
    </CardContent>
  </Card>
);

const UserIcon = () => (
  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none">
    <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const NewUserIcon = () => (
  <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none">
    <path d="M19 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
  </svg>
);

const SubscribedUserIcon = () => (
  <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
    <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
  </svg>
);

export default AdminDashboard;

