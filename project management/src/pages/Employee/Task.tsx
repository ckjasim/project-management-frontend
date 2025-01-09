import  { useEffect, useState } from 'react';
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  KeyboardSensor,
  PointerSensor,
  UniqueIdentifier,
  closestCorners,
  useSensor,
  useSensors,
} from '@dnd-kit/core';
import {
  SortableContext,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';
import { Filter,  Search, SortAsc, SortDesc } from 'lucide-react';
import Container from '@/components/global/Container/Container';
import Items from '@/components/global/Items/Item';

import {
  patchTaskStatusApi,
  getTasksByProjectApi,
  addCommentApi,
} from '@/services/api/taskApi';
import { useParams } from 'react-router-dom';
import TaskDetailModal from '@/components/global/Modal/taskDetailsModal';
import { DNDType, TaskItem  } from '@/types';
import { motion } from 'framer-motion';

const CONTAINER_IDS = {
  PENDING: 'pending',
  PROGRESSING: 'progressing',
  COMPLETED: 'completed',
  REVIEW: 'review',
};

const CONTAINER_COLORS = {
  [CONTAINER_IDS.PENDING]: 'border-red-200 bg-red-50',
  [CONTAINER_IDS.PROGRESSING]: 'border-yellow-200 bg-yellow-50',
  [CONTAINER_IDS.COMPLETED]: 'border-blue-200 bg-blue-50',
  [CONTAINER_IDS.REVIEW]: 'border-green-200 bg-green-50',
};

const PRIORITY_OPTIONS = ['High', 'Medium', 'Low'];

export const TaskManagement = () => {
  const [containers, setContainers] = useState<DNDType[]>([
    { id: CONTAINER_IDS.PENDING, title: 'To Do', items: [] },
    { id: CONTAINER_IDS.PROGRESSING, title: 'In Progress', items: [] },
    { id: CONTAINER_IDS.COMPLETED, title: 'Completed', items: [] },
    { id: CONTAINER_IDS.REVIEW, title: 'Under Review', items: [] },
  ]);
  const [originalContainers, setOriginalContainers] = useState<DNDType[]>([]);
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPriority, setSelectedPriority] = useState<string>('');
  const [selectedAssignee, setSelectedAssignee] = useState<string>('');
  const [assigneesList, setAssigneesList] = useState<string[]>([]);
  const [selectedTask, setSelectedTask] = useState<any>(null);
const [options,setOptions]=useState(false)
  const [sortConfig, setSortConfig] = useState<{
    key: keyof TaskItem;
    direction: 'asc' | 'desc';
  } | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const { projectId } = useParams();

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasksByProjectApi(projectId);
      const tasks = res?.tasks;
      console.log(tasks);
      const itemsByContainerId = containers.reduce((acc, container) => {
        acc[container.id] = [];
        return acc;
      }, {} as Record<string, DNDType['items']>);
      const uniqueAssignees = new Set<string>();

      tasks.forEach(
        (task: {
          priority: string;
          assignedTo: { name: string };
          _id: UniqueIdentifier;
          title: string;
          description: string;
          dueDate: string;
          status: string;
          attachments: Array<{
            name: string;
            size: string;
            url: string;
          }>;
          comments: Array<{
            author: string;
            content: string;
            timestamp: string;
          }>;
        }) => {
          const taskItem = {
            id: task._id,
            title: task.title,
            assignedTo: task.assignedTo.name,
            priority: task.priority,
            description: task.description,
            dueDate: task.dueDate,
            attachments: task.attachments || [],
            comments: task.comments || [],
          };
          if (itemsByContainerId[task.status]) {
            itemsByContainerId[task.status].push(taskItem);
          }
          uniqueAssignees.add(task.assignedTo.name);
        }
      );

      const newContainers = containers.map((container) => ({
        ...container,
        items: itemsByContainerId[container.id] || [],
      }));

      setContainers(newContainers);
      setOriginalContainers(newContainers);
      setAssigneesList(Array.from(uniqueAssignees).sort());
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;

    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }

    const sourceContainer = containers.find((container) =>
      container.items.some((item) => item.id === active.id)
    );
    const targetContainer = containers.find(
      (container) => container.id === over.id
    );

    if (!sourceContainer || !targetContainer) return;

    try {
      await patchTaskStatusApi(active.id, { status: targetContainer.id });

      setContainers((prev) => {
        const newContainers = [...prev];
        const sourceIndex = prev.findIndex((c) => c.id === sourceContainer.id);
        const targetIndex = prev.findIndex((c) => c.id === targetContainer.id);
        const itemIndex = sourceContainer.items.findIndex(
          (item) => item.id === active.id
        );

        const [movedItem] = newContainers[sourceIndex].items.splice(
          itemIndex,
          1
        );
        newContainers[targetIndex].items.push(movedItem);

        return newContainers;
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setActiveId(null);
    }
  };

  const handleSort = (key: keyof TaskItem) => {
    setSortConfig((currentSort) => {
      const newDirection: "asc" | "desc" =
        currentSort?.key === key && currentSort.direction === "asc"
          ? "desc"
          : "asc";

      const newSort = { key, direction: newDirection };

      setContainers((prev) => {
        return prev.map((container) => ({
          ...container,
          items: [...container.items].sort((a, b) => {
            if (newDirection === 'asc') {
              return a[key] > b[key] ? 1 : -1;
            }
            return a[key] < b[key] ? 1 : -1;
          }),
        }));
      });

      return newSort;
    });
  };

  const filterAndSearchTasks = () => {
    let filteredContainers = JSON.parse(JSON.stringify(originalContainers));

    // Apply priority filter
    if (selectedPriority) {
      filteredContainers = filteredContainers.map((container: DNDType) => ({
        ...container,
        items: container.items.filter(
          (item) =>
            item.priority.toLowerCase() === selectedPriority.toLowerCase()
        ),
      }));
    }

    // Apply assignee filter
    if (selectedAssignee) {
      filteredContainers = filteredContainers.map((container: DNDType) => ({
        ...container,
        items: container.items.filter(
          (item) => item.assignedTo === selectedAssignee
        ),
      }));
    }

    // Apply search
    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      filteredContainers = filteredContainers.map((container: DNDType) => ({
        ...container,
        items: container.items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchLower) ||
            item.description.toLowerCase().includes(searchLower) ||
            item.assignedTo.toLowerCase().includes(searchLower)
        ),
      }));
    }

    setContainers(filteredContainers);
  };

  useEffect(() => {
    filterAndSearchTasks();
  }, [searchTerm, selectedPriority, selectedAssignee]);

  const handleAddComment = async (comment: string) => {
    if (!selectedTask?.id || !comment.trim()) return;

    try {
      const data = {
        content: comment,
        taskId: selectedTask.id,
      };
      const res = await addCommentApi(data);
      console.log(res);
      setContainers((prevContainers) => {
        return prevContainers.map((container) => ({
          ...container,
          items: container.items.map((item) => {
            if (item.id === selectedTask.id) {
              return {
                ...item,
                comments: res.comment?.comments,
              };
            }
            return item;
          }),
        }));
      });
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };
const handleOptions = ()=>{
  setOptions((prevOptions) => !prevOptions);
}

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
    <TaskDetailModal
        show={showDetail}
        onClose={() => setShowDetail(false)}
        task={selectedTask || { id: '', title: '', description: '', priority: '', assignedTo: '', dueDate: '', attachments: [], members: [], status: '' }}
        onAddComment={handleAddComment} selectedTeam={undefined}/>

      <div className="flex flex-col gap-6 mb-8">
        <div className='flex justify-between'>
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <div 
  onClick={handleOptions} 
  className={`${options ? "text-gray-900" : "text-gray-500"}`}
>
  <Filter />
</div>
</div>
{options && ( <div className="flex flex-wrap gap-4 items-center">
          {/* Search Input */}
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Priority Filter */}
          <select
            value={selectedPriority}
            onChange={(e) => setSelectedPriority(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Priorities</option>
            {PRIORITY_OPTIONS.map((priority) => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>

          {/* Assignee Filter */}
          <select
            value={selectedAssignee}
            onChange={(e) => setSelectedAssignee(e.target.value)}
            className="border rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Assignees</option>
            {assigneesList.map((assignee) => (
              <option key={assignee} value={assignee}>
                {assignee}
              </option>
            ))}
          </select>

          {/* Sort Buttons */}
          <div className="flex gap-2">
            <button
              onClick={() => handleSort('dueDate')}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              {sortConfig?.key === 'dueDate' ? (
                sortConfig.direction === 'asc' ? (
                  <SortAsc />
                ) : (
                  <SortDesc />
                )
              ) : null}
              Due Date
            </button>
            <button
              onClick={() => handleSort('priority')}
              className="flex items-center gap-2 px-4 py-2 border rounded-md hover:bg-gray-50"
            >
              {sortConfig?.key === 'priority' ? (
                sortConfig.direction === 'asc' ? (
                  <SortAsc />
                ) : (
                  <SortDesc />
                )
              ) : null}
              Priority
            </button>
          </div>
        </div>)}
       
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {containers.map((container) => (
              <Container
                key={container.id}
                id={container.id}
                title={container.title}
                className={
                  CONTAINER_COLORS[
                    container.id as keyof typeof CONTAINER_COLORS
                  ]
                }
              >
                <SortableContext items={container.items.map((item) => item.id)}>
                  <div className="space-y-4">
                    {container.items.map((item) => (
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
                        <Items selectedTeam={undefined} key={item.id} {...item} />
                      </motion.div>
                    ))}
                  </div>
                </SortableContext>
              </Container>
            ))}
          </div>
          <DragOverlay>
            {activeId && (
              <Items
                  id={activeId}
                  title={containers
                    .flatMap((c) => c.items)
                    .find((item) => item.id === activeId)?.title || ''}
                  description=""
                  dueDate=""
                  assignedTo={''}
                  priority={''} selectedTeam={undefined}              />
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default TaskManagement;
