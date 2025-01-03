import React, { useMemo, useState } from 'react';
import {
  MoreVertical,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Info,
  Users,
  ChevronRight
} from 'lucide-react';
import { Project } from '@/types';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { deleteProjectApi } from '@/services/api/projectApi';

const getPriorityBadge = (priority: string) => {
  const priorityStyles = {
    high: {
      dot: 'bg-red-500 animate-pulse',
      text: 'text-red-500 bg-red-50',
      label: 'High Priority',
    },
    medium: {
      dot: 'bg-yellow-500',
      text: 'text-yellow-500 bg-yellow-50',
      label: 'Medium Priority',
    },
    low: {
      dot: 'bg-green-500',
      text: 'text-green-500 bg-green-50',
      label: 'Low Priority',
    },
  };

  const styles = priorityStyles[priority.toLowerCase() as keyof typeof priorityStyles] || priorityStyles.low;

  return (
    <div className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium space-x-1.5">
      <div className={`w-2 h-2 rounded-full ${styles.dot}`}></div>
      <span className={`${styles.text} px-2 py-0.5 rounded-full`}>
        {styles.label}
      </span>
    </div>
  );
};

export const ProjectCard: React.FC<{
  project: Project;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
  setShowEditProjectModal: React.Dispatch<React.SetStateAction<boolean>>;
  setCurrentProject: React.Dispatch<React.SetStateAction<Project | undefined>>;
}> = ({ project, setProjects, setShowEditProjectModal, setCurrentProject }) => {
  const navigate = useNavigate();
  const [showOptions, setShowOptions] = useState(false);
  const { userInfo } = useSelector((state: RootState) => state.Auth);

  const isOverdue = useMemo(() => {
    const today = new Date();
    const dueDate = new Date(project.dueDate);
    return dueDate < today && project.status !== 'completed';
  }, [project.dueDate, project.status]);

  const getStatusStyles = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return {
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
        badge: ' text-red-500 ',
        label: 'Overdue',
      };
    }

    const statusStyles = {
      completed: {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        badge: ' text-green-500 ',
        label: 'Completed',
      },
      planning: {
        icon: <Info className="w-4 h-4 text-blue-500" />,
        badge: ' text-blue-500',
        label: 'Planning',
      },
      'in-progress': {
        icon: <Clock className="w-4 h-4 text-yellow-500" />,
        badge: ' text-yellow-500 ',
        label: 'In Progress',
      },
      'on-hold': {
        icon: <Clock className="w-4 h-4 text-gray-500" />,
        badge: 'b text-gray-500 ',
        label: 'On Hold',
      },
    };

    return statusStyles[status.toLowerCase() as keyof typeof statusStyles] || statusStyles['on-hold'];
  };

  const handleDelete = async () => {
    try {
      const res = await deleteProjectApi(project._id);
      if (res) {
        setProjects((prev) => prev.filter((prj) => prj._id !== project._id));
      } else {
        console.error('Error deleting project:', res.message);
      }
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  const statusDisplay = getStatusStyles(project.status, isOverdue);

  const handleTask = (projectId: string) => {
    if (userInfo?.role === 'project manager') {
      navigate(`/user/taskManagement/${projectId}`);
    } else {
      navigate(`/employee/task/${projectId}`);
    }
  };

  return (
    <div className="w-full group" onClick={() => handleTask(project?._id)}>
      <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl border border-gray-100 hover:border-blue-100 relative">
        {/* Colored accent bar based on priority */}
        <div className={`h-1 w-full ${
          project.priority.toLowerCase() === 'high' ? 'bg-red-300' :
          project.priority.toLowerCase() === 'medium' ? 'bg-yellow-300' :
          'bg-green-300'
        }`} />
        
        <div className="p-6">
          {/* Header Section */}
          <div className="flex justify-between items-start mb-4">
            <div className="space-y-1 flex-1">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-teal-500 transition-colors">
                  {project.title}
                </h3>
                <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-500 transition-colors" />
              </div>
              {getPriorityBadge(project.priority)}
            </div>

            {/* Options Menu */}
            <div className="relative">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowOptions(!showOptions);
                }}
                className="p-1 rounded-full hover:bg-gray-100 transition-colors"
              >
                <MoreVertical className="w-5 h-5 text-gray-400" />
              </button>

              {showOptions && (
                <div className="absolute right-0 z-10 mt-2 w-48 rounded-lg bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setCurrentProject(project);
                        setShowOptions(false);
                        setShowEditProjectModal(true);
                      }}
                    >
                      <span className="flex-1 text-left">Edit Project</span>
                    </button>
                    <button
                      className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowOptions(false);
                        handleDelete();
                      }}
                    >
                      <span className="flex-1 text-left">Delete Project</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm mb-6 line-clamp-2">
            {project.description}
          </p>

          {/* Project Details */}
          <div className="space-y-4">
            {/* Status and Due Date */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-1">
                {statusDisplay.icon}
                <span className={` py-1 rounded-full text-xs font-medium ${statusDisplay.badge}`}>
                  {statusDisplay.label}
                </span>
              </div>
              
              <div className="flex items-center text-sm text-gray-500">
                <Calendar className="mr-2 w-4 h-4 text-gray-400" />
                <span>
                  {new Date(project.dueDate).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>
            </div>

            {/* Team Section */}
            <div className="flex items-center justify-between pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-1">
                <Users className="w-4 h-4 text-gray-400" />
                <span className="text-sm text-gray-500">Team Members</span>
              </div>
              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-white flex items-center justify-center text-xs font-medium text-teal-700 shadow-sm"
                  >
                    {String.fromCharCode(65 + i)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectCard;