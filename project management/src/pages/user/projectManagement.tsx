import React from 'react';
import { PlusCircle, MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const ProjectDashboard = () => {
  const projects = [
    {
      id: 1,
      icon: "🎨",
      title: "Premium Support",
      description: "Pink is obviously a better color. Everyone born confident and everything taken away.",
      participants: 23,
      dueDate: "07.08.22",
      status: "completed",
      avatars: ["👨‍💼", "👩‍💼", "👨‍💻", "👩‍💻"]
    },
    {
      id: 2,
      icon: "⚡",
      title: "Design Tools",
      description: "Constantly growing. We're constantly making mistakes from which we learn and improve",
      participants: 10,
      dueDate: "02.08.22",
      status: "overdue",
      avatars: ["👨‍🎨", "👩‍🎨", "👨‍💻"]
    },
    {
      id: 3,
      icon: "💼",
      title: "Developer First",
      description: "For standing out. But the time is now to be okay to be the greatest you.",
      participants: 30,
      dueDate: "20.08.22",
      status: "active",
      avatars: ["👨‍💻", "👩‍💻", "👨‍💼", "👩‍💼"]
    }
  ];

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-2xl font-bold text-gray-800">Projects</h1>
        <button className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors">
          <PlusCircle className="w-4 h-4" />
          Create New Project
        </button>
      </div>

      {/* Project Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <Card className="border-2 border-dashed border-gray-300 hover:border-blue-500 transition-colors cursor-pointer">
          <CardContent className="h-full flex items-center justify-center p-6">
            <div className="text-center">
              <h3 className="text-lg font-medium text-gray-600 mb-2">New project</h3>
              <p className="text-gray-400 text-sm">Click to create a new project</p>
            </div>
          </CardContent>
        </Card>

        
        {projects.map((project) => (
          <Card key={project.id} className="hover:shadow-lg transition-shadow duration-300">
            <CardContent className="p-6">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{project.icon}</span>
                  <div>
                    <h3 className="font-semibold text-gray-800">{project.title}</h3>
                    <div className="flex -space-x-2 mt-2">
                      {project.avatars.map((avatar, index) => (
                        <div
                          key={index}
                          className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-sm border-2 border-white"
                        >
                          {avatar}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <button className="text-gray-500 hover:text-gray-700">
                  <MoreVertical className="w-5 h-5" />
                </button>
              </div>

              <p className="text-gray-600 text-sm mb-4 line-clamp-2">
                {project.description}
              </p>

              <div className="flex justify-between items-center text-sm">
                <div className="flex items-center gap-2">
                  <span className="text-gray-600">{project.participants} Participants</span>
                </div>
                <div className="flex items-center gap-2">
                  {project.status === 'completed' && (
                    <span className="text-green-500 text-xs font-medium">Completed</span>
                  )}
                  {project.status === 'overdue' && (
                    <span className="text-red-500 text-xs font-medium">Due date over</span>
                  )}
                  <span className="text-gray-500">{project.dueDate}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        {/* New Project Card */}
        
      </div>
    </div>
  );
};

export default ProjectDashboard;