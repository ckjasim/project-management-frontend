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
  IconEye 
} from '@tabler/icons-react';
import { postTasksApi, getTasksApi } from '@/services/api/api';
import Container from '@/components/global/Container/Container';
import Items from '@/components/global/Items/Item';
import { ArrowLeftIcon } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

type TaskType = {
  id: string;
  title: string;
  summary: string;
  description: string;
  dueDate: string;
};

type ContainerType = {
  id: string;
  title: string;
  items: TaskType[];
};

const CONTAINER_IDS = {
  PENDING: 'pending',
  PROGRESSING: 'progressing',
  COMPLETED: 'completed',
  REVIEW: 'review',
};

const TaskDashboard = () => {
  const [containers, setContainers] = useState<ContainerType[]>([
    { id: CONTAINER_IDS.PENDING, title: 'Pending', items: [] },
    { id: CONTAINER_IDS.PROGRESSING, title: 'Progressing', items: [] },
    { id: CONTAINER_IDS.COMPLETED, title: 'Done', items: [] },
    { id: CONTAINER_IDS.REVIEW, title: 'Review', items: [] },
  ]);

  const teams = ["Developers", "Designers", "Sales"];
  // useEffect(()=>{

  // })
  // const[teams,setTeams()]
  const [selectedTeam, setSelectedTeam] = useState(teams[0]);
  const [currentContainerId, setCurrentContainerId] = useState<string>(
    CONTAINER_IDS.PENDING
  );
  const [itemName, setItemName] = useState('');
  const [itemSummary, setItemSummary] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTasks = async () => {
      setLoading(true);
      try {
        const res = await getTasksApi();
        const tasks = res.tasks;

        const itemsByContainerId = containers.reduce((acc, container) => {
          acc[container.id] = [];
          return acc;
        }, {} as Record<string, TaskType[]>);

        tasks.forEach(
          (task: {
            _id: string;
            topic: string;
            summary: string;
            description: string;
            dueDate: string;
            status: string;
          }) => {
            const taskItem = {
              id: task._id,
              title: task.topic,
              summary: task.summary,
              description: task.description,
              dueDate: task.dueDate,
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
  }, []);

  const onAddItem = async () => {
    if (!itemName) return;

    const newItem = {
      title: itemName,
      summary: itemSummary,
      description: itemDescription,
      dueDate,
      status: currentContainerId,
    };

    try {
      const res = await postTasksApi(newItem);
      const task = res.createdTask;

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
                    summary: itemSummary,
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
    setItemSummary('');
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
                key={team}
                className={`px-4 py-2 rounded-full transition-all duration-300 ${
                  selectedTeam === team
                    ? 'bg-blue-500 text-white'
                    : 'hover:bg-blue-100 text-gray-700'
                }`}
                onClick={() => setSelectedTeam(team)}
              >
                {team}
              </button>
            ))}
          </div>
        </div>

        {/* Team Header */}
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full p-6 bg-white rounded-xl shadow-md flex justify-between items-center mb-6"
        >
          <h2 className="text-2xl font-bold text-gray-800">{selectedTeam} Tasks</h2>
          <button
            onClick={() => {
              setShowAddItemModal(true);
              setCurrentContainerId(CONTAINER_IDS.PENDING);
            }}
            className="bg-blue-500 text-white p-3 rounded-full hover:bg-blue-600 transition-colors shadow-lg"
          >
            <IconPlus />
          </button>
        </motion.div>

        {/* Modal for Adding Items */}
        <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
          <div className="flex flex-col w-full items-center p-8 gap-y-6 bg-white rounded-xl">
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Task</h1>
            
            {/* Input fields with enhanced styling */}
            {[
              { 
                label: 'Title', 
                value: itemName, 
                onChange: (e) => setItemName(e.target.value),
                placeholder: 'Enter task title' 
              },
              { 
                label: 'Summary', 
                value: itemSummary, 
                onChange: (e) => setItemSummary(e.target.value),
                placeholder: 'Brief task summary' 
              },
              { 
                label: 'Description', 
                value: itemDescription, 
                onChange: (e) => setItemDescription(e.target.value),
                placeholder: 'Detailed task description' 
              }
            ].map(({ label, value, onChange, placeholder }) => (
              <div key={label} className="w-full">
                <label className="block text-gray-600 font-medium mb-2">{label}</label>
                <Input
                  type="text"
                  placeholder={placeholder}
                  value={value}
                  onChange={onChange}
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                />
              </div>
            ))}

            {/* Due Date with enhanced styling */}
            <div className="w-full">
              <label htmlFor="duedate" className="block text-gray-600 font-medium mb-2">
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
                      <span className="font-semibold text-gray-800">{container.title}</span>
                    </div>
                  }
                >
                  <div className="space-y-4 p-4">
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
                            summary={item.summary}
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