import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  postTasksApi,
  getTasksByTeamApi,
  getTeamsByProject,
  getTeamMembersByTeamIdApi,
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
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import TaskModal from '@/components/global/Modal/AddTaskModal';
import TaskDetailModal from '@/components/global/Modal/taskDetailsModal';

type TaskType = {
  assignedTo: string;
  priority: string;
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  attachments: Array<{
    name: string;
    size: string;
    url: string;
  }>;
  members: string[];
};

type ContainerType = {
  id: string;
  title: string;
  items: TaskType[];
};

interface ITeam {
  id: string;
  name: string;
}

const CONTAINER_IDS = {
  PENDING: 'pending',
  PROGRESSING: 'progressing',
  COMPLETED: 'completed',
  REVIEW: 'review',
} as const;

const TaskDashboard = () => {
  const { projectId } = useParams<{ projectId: string }>();
  const [selectedTask, setSelectedTask] = useState<TaskType | null>(null);
  const [containers, setContainers] = useState<ContainerType[]>([
    { id: CONTAINER_IDS.PENDING, title: 'Pending', items: [] },
    { id: CONTAINER_IDS.PROGRESSING, title: 'Progressing', items: [] },
    { id: CONTAINER_IDS.COMPLETED, title: 'Done', items: [] },
    { id: CONTAINER_IDS.REVIEW, title: 'Review', items: [] },
  ]);

  const [teams, setTeams] = useState<ITeam[]>([]);
  const [showDetail, setShowDetail] = useState(false);
  const [selectedTeam, setSelectedTeam] = useState<ITeam>();
  const [currentContainerId, setCurrentContainerId] = useState<string>(CONTAINER_IDS.PENDING);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [files, setFiles] = useState<File[]>([]);

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
              members: task.members || []
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
  
  function fileToBase64(file: Blob) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Read the file as a Data URL (Base64 encoded string)
      reader.onload = () => resolve(reader.result); // Resolve with the Base64 string
      reader.onerror = (error) => reject(error);
    });
  }
  const onAddItem = async (formData: {
    title: string;
    description: string;
    priority: string;
    assignedTo: string;
    dueDate: string;
  }) => {
    console.log(formData)
    if (!formData.title || !selectedTeam?.id || !projectId) return;
    const base64Files = await Promise.all(
      files.map(async (file) => ({name:file.name,file:await fileToBase64(file)}))
    );
  
console.log(files)
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

  const containerIcons = {
    [CONTAINER_IDS.PENDING]: <ClipboardList className="text-blue-500" />,
    [CONTAINER_IDS.PROGRESSING]: <CircleDashed className="text-yellow-500" />,
    [CONTAINER_IDS.COMPLETED]: <Check className="text-green-500" />,
    [CONTAINER_IDS.REVIEW]: <Eye className="text-purple-500" />,
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const addTask = async () => {
    setShowAddItemModal(true);
    setCurrentContainerId(CONTAINER_IDS.PENDING);
    if (selectedTeam) {
      const response = await getTeamMembersByTeamIdApi(selectedTeam.id);
      console.log(response)
      setTeamMembers(response?.teamMembers?.members || []);
    }
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

  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-10">
      <TaskDetailModal
        show={showDetail}
        onClose={() => setShowDetail(false)}
        task={selectedTask}
        onEdit={() => {/* Implement edit functionality */}}
        onDelete={() => {/* Implement delete functionality */}}
      />
      
      <div className="container mx-auto max-w-7xl px-4">
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center space-x-2 mb-6"
        >
          <ArrowLeftIcon className="h-4 w-4" />
          <span>Back</span>
        </Button>

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

        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-6 bg-white rounded-xl shadow-md flex justify-between items-center mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">
            {selectedTeam?.name} Tasks
          </h2>
          <Button
            onClick={addTask}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
          >
            <Plus className="h-5 w-5" />
          </Button>
        </motion.div>

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

        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {containers.map((container) => (
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
                    <div className="flex items-center space-x-2">
                      {containerIcons[container.id]}
                      <span className="font-semibold text-gray-800">
                        {container.title}
                      </span>
                    </div>
                  }
                >
                  <div className="space-y-4">
                    <AnimatePresence>
                      {container.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
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
                      ))}
                    </AnimatePresence>
                  </div>
                </Container>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default TaskDashboard;