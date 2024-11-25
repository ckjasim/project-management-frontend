// TaskManagement.tsx
import React, { useEffect, useState } from 'react';
import { DndContext, DragEndEvent, DragOverlay, DragStartEvent, KeyboardSensor, PointerSensor, UniqueIdentifier, closestCorners, useSensor, useSensors } from '@dnd-kit/core';
import { SortableContext, sortableKeyboardCoordinates, arrayMove } from '@dnd-kit/sortable';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';
import { Plus, Loader2 } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Container from './Container';
import Items from './Items';
import Modal from '@/components/global/Modal/Modal';
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

const CONTAINER_COLORS = {
  [CONTAINER_IDS.PENDING]: 'border-yellow-200 bg-yellow-50',
  [CONTAINER_IDS.PROGRESSING]: 'border-blue-200 bg-blue-50',
  [CONTAINER_IDS.COMPLETED]: 'border-green-200 bg-green-50',
  [CONTAINER_IDS.REVIEW]: 'border-purple-200 bg-purple-50',
};

export const TaskManagement = () => {
  const [containers, setContainers] = useState<DNDType[]>([
    { id: CONTAINER_IDS.PENDING, title: 'To Do', items: [] },
    { id: CONTAINER_IDS.PROGRESSING, title: 'In Progress', items: [] },
    { id: CONTAINER_IDS.COMPLETED, title: 'Completed', items: [] },
    { id: CONTAINER_IDS.REVIEW, title: 'Under Review', items: [] },
  ]);

  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>(CONTAINER_IDS.PENDING);
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchTasks();
  }, [currentContainerId]);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const res = await getTasksApi();
      const tasks = res.tasks;

      const itemsByContainerId = containers.reduce((acc, container) => {
        acc[container.id] = [];
        return acc;
      }, {} as Record<string, DNDType['items']>);

      tasks.forEach((task: {
        _id: UniqueIdentifier;
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

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, 'Enter a valid title')
      .required('Title is required'),
    summary: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, 'Enter a valid summary')
      .required('Summary is required'),
    description: Yup.string(),
    dueDate: Yup.date().required('Due date is required').nullable(),
  });

  const onAddItem = async (values: {
    title: string;
    summary: string;
    description: string;
    dueDate: string;
  }, { setSubmitting, resetForm }: any) => {
    try {
      const res = await postTasksApi({
        ...values,
        status: currentContainerId,
      });
      
      setContainers((prev) =>
        prev.map((container) =>
          container.id === currentContainerId
            ? {
                ...container,
                items: [
                  ...container.items,
                  {
                    id: res.createdTask._id,
                    ...values,
                  },
                ],
              }
            : container
        )
      );
      
      setShowAddItemModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding task:', error);
    } finally {
      setSubmitting(false);
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
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>Create New Task</CardTitle>
          </CardHeader>
          <CardContent>
            <Formik
              initialValues={{
                title: '',
                summary: '',
                description: '',
                dueDate: '',
              }}
              validationSchema={validationSchema}
              onSubmit={onAddItem}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-6">
                  <div>
                    <label htmlFor="title" className="text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <Field
                      name="title"
                      type="text"
                      as={Input}
                      placeholder="Task title"
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="summary" className="text-sm font-medium text-gray-700">
                      Summary
                    </label>
                    <Field
                      name="summary"
                      type="text"
                      as={Input}
                      placeholder="Brief summary"
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="summary"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <Field
                      name="description"
                      as="textarea"
                      placeholder="Detailed description"
                      className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 placeholder-gray-400 shadow-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <Field
                      name="dueDate"
                      type="date"
                      as={Input}
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="dueDate"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div className="flex justify-end space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowAddItemModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button type="submit" disabled={isSubmitting}>
                      {isSubmitting ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Creating...
                        </>
                      ) : (
                        'Create Task'
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </CardContent>
        </Card>
      </Modal>

      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Task Management</h1>
        <Button
          onClick={() => setShowAddItemModal(true)}
          className="flex items-center space-x-2"
        >
          <Plus className="h-5 w-5" />
          <span>Add Task</span>
        </Button>
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
                title={container.title}
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
                summary=""
                description=""
                dueDate=""
              />
            )}
          </DragOverlay>
        </DndContext>
      )}
    </div>
  );
};

export default TaskManagement;

// Container.tsx
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContainerProps {
  id: string;
  title: string;
  children: React.ReactNode;
  className?: string;
}

const Container = ({ id, title, children, className }: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type: 'container' },
  });

  return (
    <Card
      ref={setNodeRef}
      {...attributes}
      className={`
        transition-all
        duration-200
        ${className}
        ${isDragging ? 'opacity-50 scale-105' : ''}
      `}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold">{title}</CardTitle>
      </CardHeader>
      <CardContent className="min-h-[calc(100vh-20rem)] pt-0">
        {children}
      </CardContent>
    </Card>
  );
};

export default Container;

// Items.tsx
import React, { useState } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Clock, AlertCircle, GripVertical, Edit, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { deleteTaskApi, patchTaskApi } from '@/services/api/api';
import Modal from '@/components/global/Modal/Modal';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface ItemsProps {
  id: UniqueIdentifier;
  title: string;
  summary: string;
  description: string;
  dueDate: string;
}

const Items = ({ id, title,
  summary,
  description,
  dueDate,
}: ItemsProps) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type: 'item' },
  });

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTaskApi(id);
        // Task will be removed from the list via parent component re-fetch
      } catch (error) {
        console.error('Error deleting task:', error);
        alert('Failed to delete task. Please try again.');
      } finally {
        setIsDeleting(false);
      }
    }
  };

  const handleUpdate = async (values: Omit<ItemsProps, 'id'>) => {
    setIsUpdating(true);
    try {
      await patchTaskApi(id, values);
      setShowEditModal(false);
      // Task will be updated in the list via parent component re-fetch
    } catch (error) {
      console.error('Error updating task:', error);
      alert('Failed to update task. Please try again.');
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const isOverdue = new Date(dueDate) < new Date();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, 'Enter a valid title')
      .required('Title is required'),
    summary: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, 'Enter a valid summary')
      .required('Summary is required'),
    description: Yup.string(),
    dueDate: Yup.date().required('Due date is required').nullable(),
  });

  return (
    <>
      <Card
        ref={setNodeRef}
        {...attributes}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className={`
          group relative
          bg-white
          hover:shadow-md
          transition-all
          duration-200
          ${isDragging ? 'opacity-50 rotate-2 cursor-grabbing' : ''}
        `}
      >
        <div
          {...listeners}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="h-5 w-5 text-gray-400" />
        </div>

        <div className="p-4 pl-10">
          <div className="flex items-start justify-between mb-2">
            <div className="flex-1 mr-4">
              <h3 className="font-medium text-gray-900 mb-1">{title}</h3>
              <p className="text-sm text-gray-500">{summary}</p>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowEditModal(true);
                }}
                className="h-8 w-8 p-0"
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isDeleting}
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600 hover:bg-red-50"
              >
                {isDeleting ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Trash2 className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          {description && (
            <p className="text-sm text-gray-600 mt-2 mb-3">{description}</p>
          )}

          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="h-4 w-4 mr-1" />
              <span>{formatDate(dueDate)}</span>
            </div>

            {isOverdue && (
              <div className="flex items-center text-red-500 text-sm">
                <AlertCircle className="h-4 w-4 mr-1" />
                <span>Overdue</span>
              </div>
            )}
          </div>
        </div>
      </Card>

      <Modal showModal={showEditModal} setShowModal={setShowEditModal}>
        <Card className="w-full max-w-lg">
          <div className="p-6">
            <h2 className="text-xl font-semibold mb-6">Edit Task</h2>
            <Formik
              initialValues={{
                title,
                summary,
                description,
                dueDate,
              }}
              validationSchema={validationSchema}
              onSubmit={handleUpdate}
            >
              {({ isSubmitting }) => (
                <Form className="space-y-4">
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <Field
                      name="title"
                      as={Input}
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="title"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="summary" className="block text-sm font-medium text-gray-700">
                      Summary
                    </label>
                    <Field
                      name="summary"
                      as={Input}
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="summary"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <Field
                      name="description"
                      as="textarea"
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                      rows={4}
                    />
                  </div>

                  <div>
                    <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700">
                      Due Date
                    </label>
                    <Field
                      name="dueDate"
                      type="date"
                      as={Input}
                      className="mt-1"
                    />
                    <ErrorMessage
                      name="dueDate"
                      component="div"
                      className="mt-1 text-sm text-red-600"
                    />
                  </div>

                  <div className="flex justify-end space-x-3 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => setShowEditModal(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={isSubmitting || isUpdating}
                    >
                      {(isSubmitting || isUpdating) ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Updating...
                        </>
                      ) : (
                        'Update Task'
                      )}
                    </Button>
                  </div>
                </Form>
              )}
            </Formik>
          </div>
        </Card>
      </Modal>
    </>
  );
};

export default Items;