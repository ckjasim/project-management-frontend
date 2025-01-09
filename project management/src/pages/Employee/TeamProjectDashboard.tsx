import React, { useState, useEffect } from 'react';
import { Loader2, FolderPlus } from 'lucide-react';

import {
  getProjectByTeamApi,
} from '@/services/api/projectApi';
import { ProjectCard } from '@/components/project/projectCard';
import { Project } from '@/types';
import { useNotificationService } from '@/services/notificationService';

const getProjectStatus = (
  dueDate: string
): 'completed' | 'overdue' | 'active' => {
  const today = new Date();
  const due = new Date(dueDate);
  if (due < today) return 'overdue';
  return 'active';
};

const TeamProjectDashboard: React.FC = () => {
  useNotificationService();
  const [projects, setProjects] = useState<Project[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        console.log('hjhjh');
        setIsLoading(true);
        const res = await getProjectByTeamApi();
        console.log(res);
        const formattedProjects = res.projects.map((project: Project) => ({
          ...project,
          expiry: getProjectStatus(project.dueDate),
        }));
        setProjects(formattedProjects);
      } catch (error) {
        console.error('Error fetching projects:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Team's Projects
            </h1>
            <p className="text-gray-500 mt-1">
              Manage and track your team's projects
            </p>
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        ) : projects.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard
                key={project._id}
                project={project}
                setProjects={setProjects}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <FolderPlus className="w-16 h-16 text-gray-300 mx-auto mb-6" />
            <p className="text-xl text-gray-500">No projects found</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TeamProjectDashboard;
