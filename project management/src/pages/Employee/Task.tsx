import React, { useEffect, useState } from 'react';
import { Sidebar, SidebarBody, SidebarLink } from '@/components/ui/sidebar';
import {
  IconArrowLeft,
  IconBrandTabler,
  IconCalendarUser,
  IconMessageChatbot,
  IconFolders,
} from '@tabler/icons-react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import Modal from '@/components/global/Modal/Modal';

import { ErrorMessage, Field, Form, Formik, useFormik } from 'formik';
import * as Yup from 'yup';

const TodoSchema = Yup.object().shape({
  title: Yup.string().required('Title is required'),
  summary: Yup.string().required('Summary is required'),
  description: Yup.string().required('Description is required'),
  dueDate: Yup.date().required('Due date is required'),
});







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
  arrayMove,
} from '@dnd-kit/sortable';

import Container from '@/components/global/Container/Container';
import Items from '@/components/global/Items/Item';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { v4 as generateUuid } from 'uuid';
import { IconPlus } from '@tabler/icons-react';
import { postTasksApi, getTasksApi, patchTaskStatusApi } from '@/services/api/api';

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
    summary: string;
    description: string;
    dueDate: string;
  }[];
};

const CONTAINER_IDS = {
  PENDING: 'pending',
  PROGRESSING: 'progressing',
  COMPLETED: 'completed',
  REVIEW: 'review',
};

export const TaskManagement = () => {
  const [containers, setContainers] = useState<DNDType[]>([
    { id: CONTAINER_IDS.PENDING, title: 'Pending', items: [] },
    { id: CONTAINER_IDS.PROGRESSING, title: 'Progressing', items: [] },
    { id: CONTAINER_IDS.COMPLETED, title: 'Done', items: [] },
    { id: CONTAINER_IDS.REVIEW, title: 'Review', items: [] },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>(CONTAINER_IDS.PENDING);
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
        }, {} as Record<string, DNDType['items']>);

        tasks.forEach((task: { _id: UniqueIdentifier; topic: string; summary: string; description: string; dueDate: string; status: string }) => {
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
        });

        setContainers(containers.map(container => ({
          ...container,
          items: itemsByContainerId[container.id] || [],
        })));
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [currentContainerId]); // Dependency on currentContainerId might be needed depending on your logic.

  const onAddItem = async (values: { title: any; summary: any; description: any; dueDate: any; }, { setSubmitting, resetForm }: any) => {
    const { title, summary, description, dueDate } = values;
  
    if (!title) return;
  
    const newItem = {
      title,
      summary,
      description,
      dueDate,
      status: currentContainerId,
    };
  
    try {
      const res = await postTasksApi(newItem);
      const task = res.createdTask;
  
      setContainers(prevContainers =>
        prevContainers.map(container => {
          if (container.id === currentContainerId) {
            return {
              ...container,
              items: [
                ...container.items,
                { id: task._id, title, summary, description, dueDate },
              ],
            };
          }
          return container;
        })
      );
  
      setShowAddItemModal(false);
      resetForm(); // Reset the Formik form
    } catch (error) {
      console.error('Error adding item:', error);
    } finally {
      setSubmitting(false); // End submitting state in Formik
    }
  };

  const resetForm = () => {
    setItemName('');
    setItemSummary('');
    setItemDescription('');
    setDueDate('');
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    setActiveId(active.id); // Set the active item being dragged
  };
  
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
  
    // If dropped outside or over the same item, do nothing
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }
  
    // Find the source and target containers
    const sourceContainer = containers.find(container =>
      container.items.some(item => item.id === active.id)
    );
  
    const targetContainer = containers.find(container => container.id === over.id);
  
    if (!sourceContainer || !targetContainer) return;
  
    // Indices for source and target containers
    const sourceIndex = containers.findIndex(c => c.id === sourceContainer.id);
    const targetIndex = containers.findIndex(c => c.id === targetContainer.id);
    const activeIndex = sourceContainer.items.findIndex(item => item.id === active.id);
  
    // Move the item within the same container
    if (sourceIndex === targetIndex) {
      const newItems = arrayMove(
        [...sourceContainer.items],
        activeIndex,
        targetContainer.items.findIndex(item => item.id === over.id)
      );
  
      setContainers(containers.map((container, index) =>
        index === sourceIndex ? { ...container, items: newItems } : container
      ));
    } else {
      // Move the item to a different container
      const updatedContainers = [...containers];
      const [movedItem] = updatedContainers[sourceIndex].items.splice(activeIndex, 1);
      updatedContainers[targetIndex].items.push(movedItem);
  
      setContainers(updatedContainers);
  
      // Update the task status in the backend (optional)
      patchTaskStatusApi(active.id, { status: targetContainer.id }).catch(error => {
        console.error('Error updating task status:', error);
        // Optionally revert the state if API call fails
        setContainers(containers);
      });
    }
  
    // Clear the active ID after drag ends
    setActiveId(null);
  };
  

  // Placeholder function to find the title of an item by ID
  const findItemTitle = (id: UniqueIdentifier) => {
    for (const container of containers) {
      const item = container.items.find(item => item.id === id);
      if (item) return item.title;
    }
    return '';
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim() // Trim spaces from start and end
      .matches(/^(?!\s*$).+/, "enter a valid title")
      .required("Title is required"),
    
    summary: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, "Enter a valid summary")
      .required("Summary is required"),
    
    description: Yup.string(), 
    
    dueDate: Yup.date()
      .required("Due date is required")
      .nullable(),
  });
  

  return (
    <div className="mx-auto max-w-7xl w-svw py-10">
   <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
  <Formik
    initialValues={{ title: '', summary: '', description: '', dueDate: '' }}
    validationSchema={validationSchema} // Ensure you define this
    onSubmit={onAddItem} // Function to handle form submission
  >
    {({ isSubmitting }) => (
      <Form className="flex flex-col w-full items-center p-6 gap-y-6">
        <h1 className="text-gray-800 text-3xl font-bold mb-4">Create To-do</h1>
        {/* Title Field */}
        <div className="flex flex-col w-full mb-4">
          <label htmlFor="title" className="text-gray-600 font-medium">Title</label>
          <Field
            name="title"
            type="text"
            as={Input} // Use your custom Input component
            placeholder="Enter item title"
            className="w-full px-4 py-2 border rounded-md"
          />
          <ErrorMessage
            name="title"
            component="div"
            className="text-red-600 font-semibold text-sm"
          />
        </div>
        {/* Summary Field */}
        <div className="flex flex-col w-full mb-4">
          <label htmlFor="summary" className="text-gray-600 font-medium">Summary</label>
          <Field
            name="summary"
            type="text"
            as={Input} // Use your custom Input component
            placeholder="Enter summary"
            className="w-full px-4 py-2 border rounded-md"
          />
          <ErrorMessage
            name="summary"
            component="div"
            className="text-red-600 font-semibold text-sm"
          />
        </div>
        {/* Description Field */}
        <div className="flex flex-col w-full mb-4">
          <label htmlFor="description" className="text-gray-600 font-medium">Description</label>
          <Field
            name="description"
            type="text"
            as={Input} // Use your custom Input component
            placeholder="Enter description"
            className="w-full px-4 py-2 border rounded-md"
          />
          <ErrorMessage
            name="description"
            component="div"
            className="text-red-600 font-semibold text-sm"
          />
        </div>
        {/* Due Date Field */}
        <div className="flex flex-col w-full mb-4">
          <label htmlFor="dueDate" className="text-gray-600 font-medium">Due Date</label>
          <Field
            name="dueDate"
            type="date"
            as={Input} // Use your custom Input component
            className="w-full px-4 py-2 border rounded-md"
          />
          <ErrorMessage
            name="dueDate"
            component="div"
            className="text-red-600 font-semibold text-sm"
          />
        </div>
        {/* Submit Button */}
        <Button
          type="submit" // Use type="submit" for Formik to handle submission
          disabled={isSubmitting} // Disable while submitting
          className="mt-4 w-1/3 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600"
        >
          Add Item
        </Button>
      </Form>
    )}
  </Formik>
</Modal>

  
      <div className="flex items-center justify-between gap-y-2">
        <h1 className="text-gray-800 text-3xl font-bold">Task Management</h1>
      </div>
  
      <div className="mt-10">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCorners}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <div className="grid grid-cols-4 gap-6">
            {containers.map((container) => (
              <div key={container.id}>
                <div className="w-full p-4 bg-gray-50 rounded-xl flex flex-row justify-between px-6 gap-y-4 mb-4">
                  {container.title}
                  <button
                    onClick={() => {
                      setShowAddItemModal(true);
                      setCurrentContainerId(container.id);
                    }}
                  >
                    <IconPlus />
                  </button>
                </div>
                <Container id={container.id}>
                  <SortableContext items={container.items.map(item => item.id)}>
                    <div className="flex items-start flex-col gap-y-4">
                      
                      {container.items.map((item) => (
                        <Items
                          title={item.title}
                          id={item.id}
                          key={item.id}
                          summary={item.summary}
                          description={item.description}
                          dueDate={item.dueDate}
                        />
                      ))}
                    </div>
                  </SortableContext>
                </Container>
              </div>
            ))}
          </div>
          <DragOverlay adjustScale={false}>
            {activeId && (
              <Items
                id={activeId}
                title={findItemTitle(activeId)}
                summary={''}
                description={''}
                dueDate={''}
              />
            )}
          </DragOverlay>
        </DndContext>
      </div>
    </div>
  );
};

// Define uuidv4 function if needed
function uuidv4() {
  return generateUuid(); // Or implement a unique ID generation logic if not using uuid
}
