import React, { useMemo, useState } from 'react';
import {
  MoreVertical,
  Calendar,
  CheckCircle,
  AlertCircle,
  Clock,
  Info,
} from 'lucide-react';
import { deleteProjectApi, editProjectApi } from '@/services/api/api';
import { Project, ProjectFormValues } from '@/types';
import { useNavigate } from 'react-router-dom';

const getPriorityBadge = (priority: string) => {
  const priorityStyles = {
    high: {
      dot: 'bg-red-500 animate-pulse',
      text: 'text-red-600',
      label: 'High Priority',
    },
    medium: {
      dot: 'bg-yellow-500',
      text: 'text-yellow-600',
      label: 'Medium Priority',
    },
    low: {
      dot: 'bg-green-500',
      text: 'text-green-600',
      label: 'Low Priority',
    },
  };

  const styles =
    priorityStyles[priority.toLowerCase() as keyof typeof priorityStyles] ||
    priorityStyles.low;

  return (
    <div className="flex items-center space-x-2">
      <div className={`w-3 h-3 rounded-full ${styles.dot}`}></div>
      <span className={`text-sm font-medium ${styles.text}`}>
        {styles.label}
      </span>
    </div>
  );
};

export const ProjectCard: React.FC<{
  project: Project;
  setProjects: React.Dispatch<React.SetStateAction<Project[]>>;
}> = ({ project, setProjects }) => {

  const navigate= useNavigate()
  const [showOptions, setShowOptions] = useState(false);

  const isOverdue = useMemo(() => {
    const today = new Date();
    const dueDate = new Date(project.dueDate);
    return dueDate < today && project.status !== 'completed';
  }, [project.dueDate, project.status]);

  const getStatusStyles = (status: string, isOverdue: boolean) => {
    if (isOverdue) {
      return {
        icon: <AlertCircle className="w-4 h-4 text-red-500" />,
        badge: 'bg-red-500/20 text-red-800',
        label: 'Overdue',
      };
    }

    const statusStyles = {
      completed: {
        icon: <CheckCircle className="w-4 h-4 text-green-500" />,
        badge: 'bg-green-500/20 text-green-800',
        label: 'Completed',
      },
      planning: {
        icon: <Info className="w-4 h-4 text-blue-500" />,
        badge: 'bg-blue-500/20 text-blue-800',
        label: 'Planning',
      },
      'in-progress': {
        icon: <Clock className="w-4 h-4 text-yellow-500" />,
        badge: 'bg-yellow-500/20 text-yellow-800',
        label: 'In Progress',
      },
      'on-hold': {
        icon: <Clock className="w-4 h-4 text-gray-500" />,
        badge: 'bg-gray-500/20 text-gray-800',
        label: 'On Hold',
      },
    };

    return (
      statusStyles[status.toLowerCase() as keyof typeof statusStyles] ||
      statusStyles['on-hold']
    );
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

  // const handleEditProjectSubmit = async (
  //   values: ProjectFormValues,
  //   { setSubmitting }: any
  // ) => {
  //   try {
  //     const res = await editProjectApi(editProject?._id, values);
  //     console.log(editProject?._id, 'llllllllllllllllllsss');
  //     console.log(res.editedProject, 'ddddddddddddddddddddfdfdfdfdfd');
  //     setProjects((prev) =>
  //       prev.map((project) =>
  //         project._id === editProject?._id
  //           ? {
  //               ...project,
  //               ...res.editedProject,
  //               status: getProjectStatus(res.editedProject.dueDate),
  //             }
  //           : project
  //       )
  //     );
  //     setEditProject(null);
  //     setShowEditProjectModal(false);
  //   } catch (error) {
  //     console.error('Error editing project:', error);
  //   } finally {
  //     setSubmitting(false);
  //   }
  // };

  const statusDisplay = getStatusStyles(project.status, isOverdue);

  const handleTask=(projectId:string)=>{
    navigate(`/user/taskManagement/${projectId}`)
  }

  return (
    <div className="w-full" onClick={() => handleTask(project?._id)}>
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg hover:border-gray-300 group">
        <div className="p-6">
          {/* Project Header */}
          <div className="flex justify-between items-start mb-4">
            <div className="flex-1 min-w-0 space-y-2">
              <h3 className="text-xl font-semibold text-gray-900 truncate">
                {project.title}
              </h3>

              {getPriorityBadge(project.priority)}
            </div>

            <div className="relative">
              <button
                onClick={() => setShowOptions(!showOptions)}
                className="text-gray-400 hover:text-gray-600 focus:outline-none"
              >
                <MoreVertical className="w-5 h-5" />
              </button>

              {showOptions && (
                <div className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                  <div className="py-1">
                    <button
                      className="text-gray-700 block px-4 py-2 text-sm hover:bg-gray-100 w-full text-left"
                      onClick={() => {
                        /* Edit logic */
                      }}
                    >
                      Edit Project
                    </button>
                    <button
                      className="text-red-600 block px-4 py-2 text-sm hover:bg-red-50 w-full text-left"
                      onClick={handleDelete}
                    >
                      Delete Project
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Project Description */}
          <p className="text-gray-500 text-sm mb-4 line-clamp-2">
            {project.description}
          </p>

          {/* Project Details */}
          <div className="space-y-3 border-t border-gray-200 pt-4">
            {/* Due Date */}
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

            {/* Status and Team */}
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                {statusDisplay.icon}
                <span
                  className={`
                    px-3 py-1 rounded-full text-xs font-medium
                    ${statusDisplay.badge}
                  `}
                >
                  {statusDisplay.label}
                </span>
              </div>

              <div className="flex -space-x-2">
                {[...Array(3)].map((_, i) => (
                  <div
                    key={i}
                    className="
                      w-8 h-8 rounded-full 
                      bg-gray-200 border-2 border-white 
                      flex items-center justify-center 
                      text-xs font-medium text-gray-600
                      shadow-sm
                    "
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
