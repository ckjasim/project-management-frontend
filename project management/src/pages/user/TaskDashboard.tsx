import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from '@/components/global/Modal/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  IconPlus,
  IconClipboardList,
  IconProgress,
  IconCheck,
  IconEye,
} from '@tabler/icons-react';
import {
  postTasksApi,
  getTasksByTeamApi,
  getTeamsApi,
  getTeamsByProject,
  getTeamMembersByTeamIdApi,
} from '@/services/api/api';
import Container from '@/components/global/Container/Container';
import Items from '@/components/global/Items/Item';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

type TaskType = {
  assignedTo: string;
  priority:string
  id: string;
  title: string;
  description: string;
  dueDate: string;
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
};

const TaskDashboard = () => {
  const { projectId: projectId } = useParams();

  const [containers, setContainers] = useState<ContainerType[]>([
    { id: CONTAINER_IDS.PENDING, title: 'Pending', items: [] },
    { id: CONTAINER_IDS.PROGRESSING, title: 'Progressing', items: [] },
    { id: CONTAINER_IDS.COMPLETED, title: 'Done', items: [] },
    { id: CONTAINER_IDS.REVIEW, title: 'Review', items: [] },
  ]);

  const [teams, setTeams] = useState<ITeam[]>([]);
  useEffect(() => {
    const fetchTeams = async () => {
      const res = await getTeamsByProject(projectId);
      const teams = res?.teams?.map((team: any) => ({
        id: team?._id,
        name: team?.name,
      }))
      setTeams(teams);
      setSelectedTeam({name:teams[0]?.name,id:teams[0].id});
    };

    fetchTeams();
  }, []);

  const [selectedTeam, setSelectedTeam] = useState<ITeam>();
  const [currentContainerId, setCurrentContainerId] = useState<string>(
    CONTAINER_IDS.PENDING
  );
  const [itemName, setItemName] = useState('');
  const [teamMembers, setTeamMembers] = useState<any>([]);

  const [itemDescription, setItemDescription] = useState('');
  const [assignedEmployee, setAssignedEmployee] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        console.log(selectedTeam)
        const res = await getTasksByTeamApi(selectedTeam?.id,projectId);
        const tasks = res.tasks;
        console.log(tasks,'tasks,--------------')

        const itemsByContainerId = containers.reduce((acc, container) => {
          acc[container.id] = [];
          return acc;
        }, {} as Record<string, TaskType[]>);

        tasks.forEach(
          (task: {
            assignedTo: any;
            priority:stirng
            _id: string;
            title: string;
            description: string;
            dueDate: string;
            status: string;
          }) => {
            const taskItem = {
              id: task._id,
              title: task.title,
              description: task.description,
              assignedTo:task.assignedTo.name,
              dueDate: task.dueDate,
              priority:task.priority
            };
            if (itemsByContainerId[task.status]) {
              itemsByContainerId[task.status].push(taskItem);
            }
          }
        );

        setContainers(
          containers.map((container) => ({
            ...container,
            items: itemsByContainerId[container.id] || [],
          }))
        );
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [selectedTeam]);

  const onAddItem = async () => {
    if (!itemName) return;

    const newItem = {
      title: itemName,
      team:selectedTeam?.id,
      project:projectId,
      priority,
      assignedTo:assignedEmployee,
      description: itemDescription,
      dueDate,
      status: currentContainerId,
    };

    try {
      const res = await postTasksApi(newItem);
      console.log(res)
      const task = res.createdTask;
console.log(task,'task,---------')
      setContainers((prevContainers) =>
        prevContainers.map((container) =>
          container.id === currentContainerId
            ? {
                ...container,
                items: [
                  ...container.items,
                  {
                    id: task._id,
                    title: itemName,
                    assignedTo: task.assignedTo.name,
                    priority:task.priority,
                    description: itemDescription,
                    dueDate,
                    
                  },
                ],
              }
            : container
        )
      );
      setShowAddItemModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding item:', error);
    }
  };

  const resetForm = () => {
    setItemName('');
    setItemDescription('');
    setDueDate('');
  };

  const containerIcons = {
    [CONTAINER_IDS.PENDING]: <IconClipboardList className="text-blue-500" />,
    [CONTAINER_IDS.PROGRESSING]: <IconProgress className="text-yellow-500" />,
    [CONTAINER_IDS.COMPLETED]: <IconCheck className="text-green-500" />,
    [CONTAINER_IDS.REVIEW]: <IconEye className="text-purple-500" />,
  };
  const navigate = useNavigate();

  const handleBack = () => {
    navigate(-1);
  };

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
  ];

  const addTask = async() => {
    setShowAddItemModal(true);
    setCurrentContainerId(CONTAINER_IDS.PENDING);  
    if(selectedTeam){
      const teamMembers=await getTeamMembersByTeamIdApi(selectedTeam.id)
      console.log(teamMembers,'teammem-----------------')
      setTeamMembers(teamMembers?.teamMembers?.members)
    }
  };
  return (
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 min-h-screen py-10">
      <div className="container mx-auto max-w-7xl px-4">
        {/* Team Selection */}
        <Button
          variant="outline"
          onClick={handleBack}
          className="flex items-center space-x-2"
        >
          <ArrowLeftIcon className="h-4 w-4" />
        </Button>
        <div className="flex justify-center mb-8">
          <div className="bg-white shadow-lg rounded-full p-2 flex space-x-2">
            {teams.map((team) => (
              <button
                key={team.id}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedTeam?.name === team.name
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-blue-100 text-gray-700'
                }`}
                onClick={() => setSelectedTeam({name:team.name,id:team.id})}
              >
                {team.name}
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
          <button
            onClick={() => {
              addTask();
            }}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
          >
            <IconPlus />
          </button>
        </motion.div>

        <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
          <div className="flex flex-col w-full items-center p-8 gap-y-6 bg-white rounded-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">
              Create Task
            </h1>

            {[
              {
                label: 'Title',
                value: itemName,
                onChange: (e: { target: { value: React.SetStateAction<string>; }; }) => setItemName(e.target.value),
                placeholder: 'Enter task title',
              },
              {
                label: 'Description',
                value: itemDescription,
                onChange: (e: { target: { value: React.SetStateAction<string>; }; }) => setItemDescription(e.target.value),
                placeholder: 'Detailed task description',
              },
            ].map(({ label, value, onChange, placeholder }) => (
              <div key={label} className="w-full">
                <label className="block text-gray-600 font-medium mb-2">
                  {label}
                </label>
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={onChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                />
              </div>
            ))}
            <div className="w-full">
              <label className="block text-gray-600 font-medium mb-2">
                Assign Employee
              </label>
              <Select
      value={assignedEmployee}
      onValueChange={(value) => setAssignedEmployee(value)}
    >
      <SelectTrigger className="w-full">
        <SelectValue placeholder="Select Employee" />
      </SelectTrigger>
      <SelectContent>
        {teamMembers.map((employee:any) => (
          <SelectItem key={employee._id} value={employee._id}>
            {employee.name}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
            </div>

            <div className="w-full">
              <label className="block text-gray-600 font-medium mb-2">
                Priority
              </label>
              <Select
                value={priority}
                onValueChange={(value) => setPriority(value)}
              >
                <SelectTrigger className="w-full">
                  <SelectValue placeholder="Select Priority" />
                </SelectTrigger>
                <SelectContent>
                  {priorityLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      <div className="flex items-center">
                        <span className={`mr-2 ${level.color}`}>●</span>
                        {level.label}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Due Date */}
            <div className="w-full">
              <label
                htmlFor="duedate"
                className="block text-gray-600 font-medium mb-2"
              >
                Due Date
              </label>
              <Input
                type="date"
                id="duedate"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
              />
            </div>

            {/* Priority Selection */}

            {/* Employee Assignment */}

            <Button
              onClick={onAddItem}
              className="mt-6 w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Create Task
            </Button>
          </div>
        </Modal>

        {/* Task Containers */}
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ staggerChildren: 0.1 }}
            className="grid grid-cols-4 gap-6"
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
                  <div className="space-y-4 ">
                    <AnimatePresence>
                      {container.items.map((item) => (
                        <motion.div
                          key={item.id}
                          initial={{ opacity: 0, scale: 0.95 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.95 }}
                        >
                          <Items
                            title={item.title}
                            id={item.id}
                            assignedTo={item.assignedTo}
                            priority={item.priority}
                            description={item.description}
                            dueDate={item.dueDate}
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
