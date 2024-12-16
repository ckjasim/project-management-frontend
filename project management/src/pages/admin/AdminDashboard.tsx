
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

import { Card, CardContent } from "@/components/ui/card";

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
    { id: 1, name: 'dfdf', message: 'Hi ddddd! How are You', avatar: '/api/placeholder/32/32' },
    { id: 2, name: 'dfdfd', message: 'Do you dd that dd?', avatar: '/api/placeholder/32/32' },
    { id: 3, name: 'dfdfgg', message: 'ddddddddddd', avatar: '/api/placeholder/32/32' },
    { id: 4, name: 'ggg Cggghu', message: 'Awesomdddd', avatar: '/api/placeholder/32/32' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
     

      <div className="p-6 flex gap-6">
        {/* Main Content */}
        <div className="flex-1">
          {/* Stats Cards */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none">
                      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold">08</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">user traffic</p>
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData.slice(-7)}>
                      <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-blue-600 mt-2">10+ more from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <svg className="w-6 h-6 text-blue-600" viewBox="0 0 24 24" fill="none">
                      <path d="M19 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold">10</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">new users</p>
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData.slice(-7)}>
                      <Line type="monotone" dataKey="users" stroke="#2563EB" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-blue-600 mt-2">10+ more from last week</p>
              </CardContent>
            </Card>

            <Card className="bg-white">
              <CardContent className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <div className="p-2 bg-red-100 rounded-lg">
                    <svg className="w-6 h-6 text-red-600" viewBox="0 0 24 24" fill="none">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2" />
                      <circle cx="9" cy="7" r="4" stroke="currentColor" strokeWidth="2" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" stroke="currentColor" strokeWidth="2" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" stroke="currentColor" strokeWidth="2" />
                    </svg>
                  </div>
                  <span className="text-2xl font-bold">10</span>
                </div>
                <p className="text-gray-600 text-sm mb-2">subscribed users</p>
                <div className="h-12">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData.slice(-7)}>
                      <Line type="monotone" dataKey="users" stroke="#DC2626" strokeWidth={2} dot={false} />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
                <p className="text-sm text-green-600 mt-2">08+ more from last week</p>
              </CardContent>
            </Card>
          </div>

         
          <Card className="bg-white">
            <CardContent className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">user subscription</h2>
                <div className="flex space-x-4">
                  <button className="text-gray-500">Daily</button>
                  <button className="text-gray-500">Weekly</button>
                  <button className="text-blue-500 border-b-2 border-blue-500">Monthly</button>
                </div>
              </div>
              <div className="h-64">
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

 
        <div className="w-80">
          <Card className="bg-white">
            <CardContent className="p-4">
              <h2 className="text-lg font-semibold mb-4">Reviews</h2>
              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="flex items-center space-x-3">
                    <img
                      src={review.avatar}
                      alt={review.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <div>
                      <h3 className="font-medium">{review.name}</h3>
                      <p className="text-sm text-gray-500">{review.message}</p>
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

export default AdminDashboard;