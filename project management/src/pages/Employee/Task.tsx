


import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates,  } from '@dnd-kit/sortable';

import {  Loader2, } from 'lucide-react';

import Container from '@/components/global/Container/Container';
import Items from '@/components/global/Items/Item';

import {  patchTaskStatusApi, getTasksByProjectApi } from '@/services/api/api';
import { useParams } from 'react-router-dom';

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
    description: string;
    assignedTo:string;
    priority:string;
    dueDate: string;
  }[];
};

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

export const TaskManagement = () => {
  const [containers, setContainers] = useState<DNDType[]>([
    { id: CONTAINER_IDS.PENDING, title: 'To Do', items: [] },
    { id: CONTAINER_IDS.PROGRESSING, title: 'In Progress', items: [] },
    { id: CONTAINER_IDS.COMPLETED, title: 'Completed', items: [] },
    { id: CONTAINER_IDS.REVIEW, title: 'Under Review', items: [] },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [loading, setLoading] = useState(false);
  const {projectId}=useParams()

  useEffect(() => {
    fetchTasks();
  }, []);
  

  const fetchTasks = async () => {
    setLoading(true);
    try {
      
      const res = await getTasksByProjectApi(projectId);
      const tasks = res?.tasks;

      const itemsByContainerId = containers.reduce((acc, container) => {
        acc[container.id] = [];
        return acc;
      }, {} as Record<string, DNDType['items']>);

      tasks.forEach((task: {
        priority: string;
        assignedTo: any;
        _id: UniqueIdentifier;
        title: string;
        description: string;
        dueDate: string;
        status: string;
      }) => {
        const taskItem = {
          id: task._id,
          title: task.title,
          assignedTo: task.assignedTo.name,
          priority:task.priority,
          description: task.description,
          dueDate: task.dueDate,
        };
        if (itemsByContainerId[task.status]) {
          itemsByContainerId[task.status].push(taskItem);
        }
      });

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
    console.log(over?.id,'iiiiiiiiiiiiiiiiiiiiiiiiiii')
    
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }
    
    const sourceContainer = containers.find((container) =>
      container.items.some((item) => item.id === active.id)
    );
    const targetContainer = containers.find((container) => container.id === over.id);

    if (!sourceContainer || !targetContainer) return;

    try {
      await patchTaskStatusApi(active.id, { status: targetContainer.id });

      setContainers((prev) => {
        const newContainers = [...prev];
        const sourceIndex = prev.findIndex((c) => c.id === sourceContainer.id);
        const targetIndex = prev.findIndex((c) => c.id === targetContainer.id);
        const itemIndex = sourceContainer.items.findIndex((item) => item.id === active.id);
        
        const [movedItem] = newContainers[sourceIndex].items.splice(itemIndex, 1);
        newContainers[targetIndex].items.push(movedItem);
        
        return newContainers;
      });
    } catch (error) {
      console.error('Error updating task status:', error);
    } finally {
      setActiveId(null);
    }
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
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
                title={container.title }
                className={CONTAINER_COLORS[container.id as keyof typeof CONTAINER_COLORS]}
              >
                <SortableContext items={container.items.map((item) => item.id)}>
                  <div className="space-y-4">
                    {container.items.map((item) => (
                      <Items key={item.id} {...item} />
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
                  dueDate="" assignedTo={''} priority={''}              />
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default TaskManagement;