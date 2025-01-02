import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select1";
import {
  postTasksApi,
  getTasksByTeamApi,
  getTeamsByProject,
  getTeamMembersByTeamIdApi,
  addCommentApi,
} from '@/services/api/api';
import Container from '@/components/global/Container/Container';
import Items from '@/components/global/Items/Item';
import {
  ArrowLeftIcon,
  Check,
  CircleDashed,
  ClipboardList,
  Eye,
  Plus,
  Search,
  SortAsc,
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskModal from '@/components/global/Modal/AddTaskModal';
import TaskDetailModal from '@/components/global/Modal/taskDetailsModal';
import { ContainerType, ITeam, TaskType } from '@/types';



const CONTAINER_IDS = {
  PENDING: 'pending',
  PROGRESSING: 'progressing',
  COMPLETED: 'completed',
  REVIEW: 'review',
} as const;

const TaskDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const navigate = useNavigate();

  // Core state
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [containers, setContainers] = useState<ContainerType[]>([
    { id: CONTAINER_IDS.PENDING, title: 'Pending', items: [] },
    { id: CONTAINER_IDS.PROGRESSING, title: 'Progressing', items: [] },
    { id: CONTAINER_IDS.COMPLETED, title: 'Done', items: [] },
    { id: CONTAINER_IDS.REVIEW, title: 'Review', items: [] },
  ]);

  // Team related state
  const [teams, setTeams] = useState<ITeam[]>([]);
  const [selectedTeam, setSelectedTeam] = useState<ITeam>();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  // UI state 
  const [showDetail, setShowDetail] = useState(false);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentContainerId, setCurrentContainerId] = useState<string>(CONTAINER_IDS.PENDING);
  const [files, setFiles] = useState<File[]>([]);

  // Search, sort, and filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'dueDate' | 'priority' | 'title'>('dueDate');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filteredContainers, setFilteredContainers] = useState<ContainerType[]>([]);

  // Icons for container types
  const containerIcons = {
    [CONTAINER_IDS.PENDING]: <ClipboardList className="text-blue-500" />,
    [CONTAINER_IDS.PROGRESSING]: <CircleDashed className="text-yellow-500" />,
    [CONTAINER_IDS.COMPLETED]: <Check className="text-green-500" />,
    [CONTAINER_IDS.REVIEW]: <Eye className="text-purple-500" />,
  };

  // Initial data fetching
  useEffect(() => {
    const fetchTeams = async () => {
      if (!projectId) return;
      const res = await getTeamsByProject(projectId);
      const teams = res?.teams?.map((team: any) => ({
        id: team?._id,
        name: team?.name,
      }));
      setTeams(teams);
      if (teams.length > 0) {
        setSelectedTeam({ name: teams[0]?.name, id: teams[0].id });
      }
    };

    fetchTeams();
  }, [projectId]);

  // Fetch tasks when team changes
  useEffect(() => {
    const fetchTasks = async () => {
      if (!selectedTeam?.id || !projectId) return;
      
      setLoading(true);
      try {
        const res = await getTasksByTeamApi(selectedTeam.id, projectId);
        const tasks = res.tasks;

        const updatedContainers = containers.map(container => ({
          ...container,
          items: tasks.filter((task: TaskType) => task.status === container.id)
            .map((task: any) => ({
              id: task._id,
              title: task.title,
              description: task.description,
              assignedTo: task.assignedTo?.name,
              dueDate: task.dueDate,
              priority: task.priority,
              status: task.status,
              attachments: task.attachments || [],
              members: task.members || [],
              comments:task.comments || []
            }))
        }));

        setContainers(updatedContainers);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedTeam, projectId]);

  // Filter and sort effect
  useEffect(() => {
    if (!containers) return;

    let filtered = containers.map(container => ({
      ...container,
      items: container.items.filter(item => {
        const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.assignedTo?.toLowerCase().includes(searchQuery.toLowerCase());
        
        const matchesPriority = filterPriority === 'all' || item.priority === filterPriority;

        return matchesSearch && matchesPriority;
      })
    }));

    // Sort items in each container
    filtered = filtered.map(container => ({
      ...container,
      items: container.items.sort((a, b) => {
        switch (sortBy) {
          case 'dueDate':
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case 'priority': {
            const priorityWeight = { low: 0, medium: 1, high: 2 };
            return priorityWeight[b.priority as keyof typeof priorityWeight] - 
                   priorityWeight[a.priority as keyof typeof priorityWeight];
          }
          case 'title':
            return a.title.localeCompare(b.title);
          default:
            return 0;
        }
      })
    }));

    setFilteredContainers(filtered);
  }, [containers, searchQuery, sortBy, filterPriority]);

  // File handling functions
  const fileToBase64 = (file: Blob): Promise<string | ArrayBuffer | null> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (indexToRemove: number) => {
    setFiles(prev => prev.filter((_, index) => index !== indexToRemove));
  };

  // Task management functions
  const onAddItem = async (formData: {
    title: string;
    description: string;
    priority: string;
    assignedTo: string;
    dueDate: string;
  }) => {
    if (!formData.title || !selectedTeam?.id || !projectId) return;
    
    const base64Files = await Promise.all(
      files.map(async (file) => ({
        name: file.name,
        file: await fileToBase64(file)
      }))
    );

    const newItem = {
      ...formData,
      team: selectedTeam.id,
      project: projectId,
      status: currentContainerId,
      attachments: base64Files
    };

    try {
      const res = await postTasksApi(newItem);
      const task = res.createdTask;

      setContainers(prevContainers =>
        prevContainers.map(container =>
          container.id === currentContainerId
            ? {
                ...container,
                items: [
                  ...container.items,
                  {
                    id: task._id,
                    title: task.title,
                    assignedTo: task.assignedTo?.name,
                    priority: task.priority,
                    description: task.description,
                    dueDate: task.dueDate,
                    status: task.status,
                    attachments: task.attachments || [],
                    members: task.members || []
                  },
                ],
              }
            : container
        )
      );
      setShowAddItemModal(false);
      setFiles([]);
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const addTask = async () => {
    setShowAddItemModal(true);
    setCurrentContainerId(CONTAINER_IDS.PENDING);
    if (selectedTeam) {
      const response = await getTeamMembersByTeamIdApi(selectedTeam.id);
      setTeamMembers(response?.teamMembers?.members || []);
    }
  };

  const handleBack = () => {
    navigate(-1);
  };
   const handleAddComment = async (comment: string) => {
      if (!selectedTask?.id || !comment.trim()) return;
    
      try {
        const data = {
          content: comment,
          taskId: selectedTask.id
        };
        const res = await addCommentApi(data);
  console.log(res)
        setContainers(prevContainers => {
          return prevContainers.map(container => ({
            ...container,
            items: container.items.map(item => {
              if (item.id === selectedTask.id) {
                return {
                  ...item,
                  comments: res.comment?.comments
                };
              }
              return item;
            })
          }))
        });
      } catch (error) {
        console.error('Error adding comment:', error);
      }
    };

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-10">
         <TaskDetailModal
        show={showDetail}
        onClose={() => setShowDetail(false)}
        task={selectedTask}
        onAddComment={handleAddComment}
        onEdit={() => {/* Implement edit functionality */}}
        onDelete={() => {/* Implement delete functionality */}}
      />
      
      <div className="container mx-auto max-w-7xl px-4">
        {/* Navigation */}
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center space-x-2 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back</span>
        </Button>

        {/* Team Selection */}
        <div className="flex justify-center mb-8">
          <div className="bg-white shadow-lg rounded-full p-2 flex space-x-2">
            {teams.map((team) => (
              <button
                key={team.id}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedTeam?.id === team.id
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-blue-100 text-gray-700'
                }`}
                onClick={() => setSelectedTeam(team)}
              >
                {team?.name}
              </button>
            ))}
          </div>
        </div>

        {/* Header with Controls */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-6 bg-white rounded-xl shadow-md mb-6"
        >
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-gray-800">
              {selectedTeam?.name} Tasks
            </h2>
            <Button
              onClick={addTask}
              className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
            >
              <Plus className="h-5 w-5" />
            </Button>
          </div>

          {/* Search, Sort, and Filter Controls */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="relative">
              <Input
                placeholder="Search tasks..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
              <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            </div>

            <Select
              value={sortBy}
              onValueChange={(value) => setSortBy(value as typeof sortBy)}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dueDate">Due Date</SelectItem>
                <SelectItem value="priority">Priority</SelectItem>
                <SelectItem value="title">Title</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={filterPriority}
              onValueChange={setFilterPriority}
            >
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Filter by priority..." />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Priorities</SelectItem>
                <SelectItem value="low">Low Priority</SelectItem>
                <SelectItem value="medium">Medium Priority</SelectItem>
                <SelectItem value="high">High Priority</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </motion.div>

        {/* Task Modal */}
        {showAddItemModal && (
          <TaskModal
            showAddItemModal={showAddItemModal}
            setShowAddItemModal={setShowAddItemModal}
            teamMembers={teamMembers}
            priorityLevels={[
              { value: 'low', label: 'Low Priority', color: 'text-green-600' },
              { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
              { value: 'high', label: 'High Priority', color: 'text-red-600' },
            ]}
            onAddItem={onAddItem}
            onFileChange={handleFileChange}
            onFileRemove={removeFile}
            files={files}
          />
        )}

        {/* Task Containers */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >{filteredContainers.map((container) => (
              <motion.div
                key={container.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                className="bg-white rounded-xl shadow-md"
              >
                <Container
                  id={container.id}
                  title={
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        {containerIcons[container.id]}
                        <span className="font-semibold text-gray-800">
                          {container.title}
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {container.items.length}
                      </span>
                    </div>
                  }
                >
                  {loading ? (
                    <div className="flex justify-center items-center h-32">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <AnimatePresence>
                        {container.items.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            className="text-center py-8 text-gray-500"
                          >
                            No tasks found
                          </motion.div>
                        ) : (
                          container.items.map((item) => (
                            <motion.div
                              key={item.id}
                              initial={{ opacity: 0, scale: 0.95 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.95 }}
                              className="cursor-pointer"
                              onClick={() => {
                                setSelectedTask(item);
                                setShowDetail(true);
                              }}
                            >
                              <Items
                                {...item}
                                selectedTeam={selectedTeam}
                              />
                            </motion.div>
                          ))
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </Container>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto" />
              <p className="mt-2 text-gray-600">Loading tasks...</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskDashboard;