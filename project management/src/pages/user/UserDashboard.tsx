import  { useEffect, useState } from 'react';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Users, Briefcase, Clock, ArrowUp,  DollarSign, AlertCircle } from 'lucide-react';
import { Card, CardContent } from "@/components/ui/card";
import { useNotificationService } from '@/services/notificationService';
import { getAllProjectApi, getTeamsApi } from '@/services/api/projectApi';
import { getEmployeesByOrganizationApi } from '@/services/api/authApi';
import { getAllTasksApi } from '@/services/api/taskApi';

interface Project {
  _id: string;
  title: string;
  status: string;
  startDate: string;
  dueDate: string;
}

interface Task {
  _id: string;
  title: string;
  status: string;
  assignedTo: any;
  team: string;
  dueDate: string;
}

interface Team {
  _id: string;
  name: string;
  members: string[];
}

interface ChartData {
  period: string;
  completedTasks: number;
  activeProjects: number;
}

interface ProjectStatus {
  name: string;
  value: number;
}

interface ProcessedTeam {
  id: string;
  name: string;
  role: string;
  completedTasks: number;
  status: string;
  members: number;
}

const UserDashboard = () => {
  useNotificationService()

  const [selectedPeriod, setSelectedPeriod] = useState<'Daily' | 'Weekly' | 'Monthly'>('Monthly');
  const [isLoading, setIsLoading] = useState(false);
  const [projectCount, setProjectCount] = useState(0);
  const [employeeCount, setEmployeeCount] = useState(0);
  const [teamCount, setTeamCount] = useState(0);
  const [projectData, setProjectData] = useState<ChartData[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [teams, setTeams] = useState<ProcessedTeam[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);

  const COLORS = ['#10B981', '#3B82F6', '#EF4444'];

  const calculateProjectStatus = (projects: Project[]): ProjectStatus[] => {
    const total = projects.length;
    const completed = projects.filter(p => p.status === 'completed').length;
    const planning = projects.filter(p => p.status === 'planning').length;
    const inProgress = total - completed - planning;

    return [
      { name: 'Completed', value: (completed/total) * 100 || 0 },
      { name: 'In Progress', value: (inProgress/total) * 100 || 0 },
      { name: 'Planning', value: (planning/total) * 100 || 0 }
    ];
  };

  const processProjectData = (projects: Project[], period: 'Daily' | 'Weekly' | 'Monthly'): ChartData[] => {
    const now = new Date();
    const data: ChartData[] = [];

    switch (period) {
      case 'Daily':
        // Last 7 days
        for (let i = 6; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - i);
          const dayStr = date.toLocaleDateString('en-US', { weekday: 'short' });
          
          const dayProjects = projects.filter(p => {
            const projectDate = new Date(p.startDate);
            return projectDate.toDateString() === date.toDateString();
          });

          data.push({
            period: dayStr,
            completedTasks: tasks.filter(t => 
              new Date(t.dueDate).toDateString() === date.toDateString() && 
              t.status === '675303a8f8a7ab5345cb0d0a'
            ).length,
            activeProjects: dayProjects.length
          });
        }
        break;

      case 'Weekly':
        // Last 12 weeks
        for (let i = 11; i >= 0; i--) {
          const date = new Date(now);
          date.setDate(date.getDate() - (i * 7));
          const weekStr = `Week ${Math.ceil((date.getDate()) / 7)}`;
          
          const weekProjects = projects.filter(p => {
            const projectDate = new Date(p.startDate);
            const diffTime = Math.abs(projectDate.getTime() - date.getTime());
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
            return diffDays <= 7;
          });

          data.push({
            period: weekStr,
            completedTasks: tasks.filter(t => {
              const taskDate = new Date(t.dueDate);
              const diffTime = Math.abs(taskDate.getTime() - date.getTime());
              const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
              return diffDays <= 7 && t.status === '675303a8f8a7ab5345cb0d0a';
            }).length,
            activeProjects: weekProjects.length
          });
        }
        break;

      case 'Monthly':
        // Last 12 months
        for (let i = 0; i < 12; i++) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthStr = date.toLocaleString('en-US', { month: 'short' });
          
          const monthProjects = projects.filter(p => {
            const projectDate = new Date(p.startDate);
            return projectDate.getMonth() === date.getMonth() &&
                   projectDate.getFullYear() === date.getFullYear();
          });

          data.push({
            period: monthStr,
            completedTasks: tasks.filter(t => {
              const taskDate = new Date(t.dueDate);
              return taskDate.getMonth() === date.getMonth() &&
                     taskDate.getFullYear() === date.getFullYear() &&
                     t.status === '675303a8f8a7ab5345cb0d0a';
            }).length,
            activeProjects: monthProjects.length
          });
        }
        break;
    }

    return data.reverse();
  };

  const processTeams = (teamsData: Team[]): ProcessedTeam[] => {
    return teamsData.map(team => ({
      id: team._id,
      name: team.name,
      role: 'Team',
      completedTasks: tasks.filter(task => 
        task.team === team._id && task.status === '675303a8f8a7ab5345cb0d0a'
      ).length,
      status: team.members.length > 5 ? 'active' : 'busy',
      members: team.members.length
    }));
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [empResponse, teamsRes, projectRes, tasksRes] = await Promise.all([
          getEmployeesByOrganizationApi(),
          getTeamsApi(),
          getAllProjectApi(),
          getAllTasksApi()
        ]);

        const projectsData = projectRes?.projects || [];
        const tasksData = tasksRes?.tasks || [];
        const teamsData = teamsRes?.teams || [];

        setEmployeeCount(empResponse?.data?.all.length || 0);
        setTeamCount(teamsData.length);
        setProjectCount(projectsData.length);
        setProjects(projectsData);
        setTasks(tasksData);
        setTeams(processTeams(teamsData));
        
        const periodData = processProjectData(projectsData, selectedPeriod);
        setProjectData(periodData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();

  }, []);

  useEffect(() => {
    if (projects.length) {
      const periodData = processProjectData(projects, selectedPeriod);
      setProjectData(periodData);
    }
  }, [selectedPeriod, projects]);



  const getRecentTasks = (tasks: any[]) => {
    return tasks.slice(0, 3).map(task => ({
      id: task._id,
      title: task.title,
      status: task.status === '675303a8f8a7ab5345cb0d0a' ? 'completed' : 
             task.status === '675303b4f8a7ab5345cb0d0c' ? 'in-progress' : 'pending',
      assignee: task.assignedTo,
      deadline: new Date(task.dueDate).toISOString().split('T')[0]
    }));
  };

  const pendingTasks = tasks.filter(task => task.status !== '675303a8f8a7ab5345cb0d0a').length;

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
      </div>
    ) ;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-50 to-teal-50 p-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="bg-white">
          <CardContent className="p-4">
            <div className="flex justify-between items-start">
              <div>
                <p className="text-gray-500 text-sm">Total Projects</p>
                <h3 className="text-2xl font-bold mt-1">{projectCount}</h3>
                <span className="text-green-500 text-sm flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" /> Active
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
                <p className="text-gray-500 text-sm">Active Employees</p>
                <h3 className="text-2xl font-bold mt-1">{employeeCount}</h3>
                <span className="text-green-500 text-sm flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" /> Active
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
                <p className="text-gray-500 text-sm">Total Teams</p>
                <h3 className="text-2xl font-bold mt-1">{teamCount}</h3>
                <span className="text-green-500 text-sm flex items-center mt-1">
                  <ArrowUp className="h-4 w-4 mr-1" /> Active
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
                <h3 className="text-2xl font-bold mt-1">{pendingTasks}</h3>
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

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        <Card className="lg:col-span-2 bg-white shadow-sm rounded-lg">
          <CardContent className="p-6">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-lg font-semibold">Project & Task Overview</h2>
              <div className="flex space-x-2">
                {['Daily', 'Weekly', 'Monthly'].map((period:any) => (
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
          <XAxis dataKey="period" />
          <YAxis yAxisId="left" />
          <YAxis yAxisId="right" orientation="right" />
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

        <Card className="bg-white">
          <CardContent className="p-6 flex flex-col items-center">
            <h2 className="text-lg font-semibold mb-4">Project Status</h2>
            <div className="h-64 w-full flex justify-center items-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={calculateProjectStatus(projects)}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {calculateProjectStatus(projects).map((_, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 w-full space-y-2">
              {calculateProjectStatus(projects).map((status, index) => (
                <div key={status.name} className="flex items-center justify-between w-full px-4">
                  <div className="flex items-center">
                    <div
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: COLORS[index] }}
                    />
                    <span className="text-sm text-gray-600">{status.name}</span>
                  </div>
                  <span className="text-sm font-medium text-gray-800">
                    {status.value.toFixed(1)}%
                  </span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tasks and Teams */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2 bg-white">
          <CardContent className="p-6">
            <h2 className="text-lg font-semibold mb-4">Recent Tasks</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Task</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Assignee ID</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Status</th>
                    <th className="text-left py-3 px-4 text-sm font-medium text-gray-500">Deadline</th>
                  </tr>
                </thead>
                <tbody>
                  {getRecentTasks(tasks).map((task) => (
                    <tr key={task.id} className="border-b">
                      <td className="py-3 px-4">{task.title}</td>
                      <td className="py-3 px-4">{task.assignee.name}</td>
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
                  <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-200">
  {team.name ? team.name.charAt(0).toUpperCase() : "T"}
</div>
                    <div>
                      <h3 className="font-medium">{team.name}</h3>
                      <p className="text-sm text-gray-500">{team.members} members</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{team.completedTasks} tasks completed</p>
                    <span
                      className={`text-xs ${team.status === 'active'
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