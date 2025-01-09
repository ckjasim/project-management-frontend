import  {  useState } from 'react';
import { LineChart, Line,   XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, Clock,  ArrowUp, ArrowDown,  DollarSign,  AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useNotificationService } from '@/services/notificationService';

const UserDashboard = () => {

  useNotificationService()

  const [selectedPeriod, setSelectedPeriod] = useState('Monthly');
  const projectData = [
    { month: 'May', completedTasks: 120, activeProjects: 4 },
    { month: 'Jun', completedTasks: 150, activeProjects: 6 },
    { month: 'Jul', completedTasks: 170, activeProjects: 8 },
    { month: 'Aug', completedTasks: 200, activeProjects: 7 },
    { month: 'Sep', completedTasks: 180, activeProjects: 5 },
    { month: 'Oct', completedTasks: 160, activeProjects: 6 },
    { month: 'Nov', completedTasks: 190, activeProjects: 7 },
    { month: 'Dec', completedTasks: 180, activeProjects: 6 }
  ];

  const projectStatus = [
    { name: 'Completed', value: 45 },
    { name: 'In Progress', value: 30 },
    { name: 'Pending', value: 25 }
  ];

  const COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  const recentTasks = [
    { id: 1, title: 'Website Redesign', status: 'completed', assignee: 'John Doe', deadline: '2024-11-10' },
    { id: 2, title: 'Mobile App Update', status: 'in-progress', assignee: 'Sarah Smith', deadline: '2024-11-15' },
    { id: 3, title: 'Database Migration', status: 'pending', assignee: 'Mike Johnson', deadline: '2024-11-20' }
  ];

  const teams = [
    { id: 1, name: 'Development Team', role: 'Engineering', completedTasks: 120, status: 'active' },
    { id: 2, name: 'Design Team', role: 'Creative', completedTasks: 80, status: 'active' },
    { id: 3, name: 'Marketing Team', role: 'Business Development', completedTasks: 45, status: 'busy' },
  ];
  
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-teal-50 p-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {/* Quick Stats Cards */}
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Projects</p>
                <h3 className="text-2xl font-bold mt-1">145</h3>
                <span className="text-green-500 text-sm flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" /> 12.5%
                </span>
              </div>
              <div className="p-2 bg-blue-100 rounded-lg">
                <Briefcase className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Active Users</p>
                <h3 className="text-2xl font-bold mt-1">2,890</h3>
                <span className="text-green-500 text-sm flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" /> 8.1%
                </span>
              </div>
              <div className="p-2 bg-green-100 rounded-lg">
                <Users className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Revenue</p>
                <h3 className="text-2xl font-bold mt-1">$48.2K</h3>
                <span className="text-red-500 text-sm flex items-center mt-1">
                  <ArrowDown className="h-4 w-4 mr-1" /> 3.2%
                </span>
              </div>
              <div className="p-2 bg-purple-100 rounded-lg">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Pending Tasks</p>
                <h3 className="text-2xl font-bold mt-1">32</h3>
                <span className="text-yellow-500 text-sm flex items-center mt-1">
                  <Clock className="h-4 w-4 mr-1" /> Due Soon
                </span>
              </div>
              <div className="p-2 bg-yellow-100 rounded-lg">
                <AlertCircle className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
  {/* Main Charts Section */}
  <Card className="lg:col-span-2 bg-white shadow-sm rounded-lg">
    <CardContent className="p-6">
      <div className="flex justify-between items-center mb-12"> {/* Reduced margin-bottom */}
        <h2 className="text-lg font-semibold">Project & Task Overview</h2>
        <div className="flex space-x-2">
          {['Daily', 'Weekly', 'Monthly'].map((period) => (
            <button
              key={period}
              onClick={() => setSelectedPeriod(period)}
              className={`px-3 py-1 rounded ${
                selectedPeriod === period ? 'bg-blue-100 text-blue-600' : 'text-gray-500'
              }`}
            >
              {period}
            </button>
          ))}
        </div>
      </div>
      <div className="h-80"> 
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={projectData}>
            <XAxis dataKey="month" />
            <YAxis yAxisId="left" label={{ value: 'Completed Tasks', angle: -90, position: 'insideLeft' }} />
            <YAxis yAxisId="right" orientation="right" label={{ value: 'Active Projects', angle: 90, position: 'insideRight' }} />
            <Tooltip />
            <Line
              yAxisId="left"
              type="monotone"
              dataKey="completedTasks"
              stroke="#34D399"
              strokeWidth={2}
              name="Completed Tasks"
            />
            <Line
              yAxisId="right"
              type="monotone"
              dataKey="activeProjects"
              stroke="#6366F1"
              strokeWidth={2}
              name="Active Projects"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </CardContent>
  </Card>

  <Card className="bg-white w-full">
    <CardContent className="p-6 flex flex-col items-center">
      <h2 className="text-lg font-semibold mb-4 text-center">Project Status</h2>
      <div className="h-64 w-full flex justify-center items-center"> {/* Adjusted height for the pie chart */}
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={projectStatus}
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
            >
              {projectStatus.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="mt-4 w-full space-y-2"> {/* Reduced margin-top */}
        {projectStatus.map((status, index) => (
          <div key={status.name} className="flex items-center justify-between w-full px-4">
            <div className="flex items-center">
              <div
                className="w-3 h-3 rounded-full mr-2"
                style={{ backgroundColor: COLORS[index] }}
              />
              <span className="text-sm text-gray-600">{status.name}</span>
            </div>
            <span className="text-sm font-medium text-gray-800">{status.value}%</span>
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
</div>


      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Tasks */}
        <Card className="lg:col-span-2 bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Task</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Assignee</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {recentTasks.map((task) => (
                    <tr key={task.id} className="border-b">
                      <td className="py-3 px-4">{task.title}</td>
                      <td className="py-3 px-4">{task.assignee}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-1 rounded-full text-xs ${
                            task.status === 'completed'
                              ? 'bg-green-100 text-green-800'
                              : task.status === 'in-progress'
                              ? 'bg-blue-100 text-blue-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {task.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-500">{task.deadline}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        
        <Card className="bg-white">
  <CardContent className="p-6">
    <h2 className="text-lg font-semibold mb-4">Teams</h2>
    <div className="space-y-4">
      {teams.map((team) => (
        <div key={team.id} className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <img
              src="/api/placeholder/32/32"
              alt={team.name}
              className="w-8 h-8 rounded-full" 
            />
            <div>
              <h3 className="font-medium">{team.name}</h3>
              <p className="text-sm text-gray-500">{team.role}</p> 
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium">{team.completedTasks} tasks completed</p>
            <span
              className={`text-xs ${
                team.status === 'active'
                  ? 'text-green-500'
                  : 'text-yellow-500'
              }`}
            >
              {team.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  </CardContent>
</Card>

      </div>
    </div>
  );
};

export default UserDashboard;