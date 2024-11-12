import React, { useEffect, useState } from 'react';

import Modal from '@/components/global/Modal/Modal';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import * as Yup from 'yup';

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

import { IconPlus } from '@tabler/icons-react';
import {
  postTasksApi,
  getTasksApi,
  patchTaskStatusApi,
} from '@/services/api/api';

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
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>(CONTAINER_IDS.PENDING);
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

        tasks.forEach(
          (task: {
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
  }, [currentContainerId]);

  const onAddItem = async (
    values: { title: string; summary: string; description: string; dueDate: string },
    { setSubmitting, resetForm }: any
  ) => {
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

      setContainers((prevContainers) =>
        prevContainers.map((container) => {
          if (container.id === currentContainerId) {
            return {
              ...container,
              items: [
                ...container.items,
                {
                  id: task._id,
                  title,
                  summary,
                  description,
                  dueDate,
                },
              ],
            };
          }
          return container;
        })
      );

      setShowAddItemModal(false);
      resetForm();
    } catch (error) {
      console.error('Error adding item:', error);
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
    const { active } = event;
    setActiveId(active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
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

    const sourceIndex = containers.findIndex(
      (c) => c.id === sourceContainer.id
    );
    const targetIndex = containers.findIndex(
      (c) => c.id === targetContainer.id
    );
    const activeIndex = sourceContainer.items.findIndex(
      (item) => item.id === active.id
    );

    if (sourceIndex === targetIndex) {
      const newItems = arrayMove(
        [...sourceContainer.items],
        activeIndex,
        targetContainer.items.findIndex((item) => item.id === over.id)
      );

      setContainers(
        containers.map((container, index) =>
          index === sourceIndex ? { ...container, items: newItems } : container
        )
      );
    } else {
      const updatedContainers = [...containers];
      const [movedItem] = updatedContainers[sourceIndex].items.splice(
        activeIndex,
        1
      );
      updatedContainers[targetIndex].items.push(movedItem);

      setContainers(updatedContainers);

      patchTaskStatusApi(active.id, { status: targetContainer.id }).catch(
        (error) => {
          console.error('Error updating task status:', error);
          setContainers(containers);
        }
      );
    }
    setActiveId(null);
  };

  const findItemTitle = (id: UniqueIdentifier) => {
    for (const container of containers) {
      const item = container.items.find((item) => item.id === id);
      if (item) return item.title;
    }
    return '';
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

  return (
    <div className="mx-auto max-w-7xl w-svw py-10">
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
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
            <Form className="flex flex-col w-full items-center p-6 gap-y-6">
              <h1 className="text-gray-800 text-3xl font-bold mb-4">Create To-do</h1>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="title" className="text-gray-600 font-medium">Title</label>
                <Field
                  name="title"
                  type="text"
                  as={Input}
                  placeholder="Enter item title"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="summary" className="text-gray-600 font-medium">Summary</label>
                <Field
                  name="summary"
                  type="text"
                  as={Input}
                  placeholder="Enter item summary"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="summary"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="description" className="text-gray-600 font-medium">Description</label>
                <Field
                  name="description"
                  as="textarea"
                  placeholder="Enter item description"
                  className="w-full px-4 py-2 border rounded-md h-24"
                />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="dueDate" className="text-gray-600 font-medium">Due Date</label>
                <Field
                  name="dueDate"
                  type="date"
                  as={Input}
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="text-red-600 font-semibold text-sm"
                />
              </div>
              <div className="flex w-full justify-center">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                  {isSubmitting ? 'Creating...' : 'Create'}
                </Button>
              </div>
            </Form>
          )}
        </Formik>
      </Modal>
      <div className="flex justify-between mb-6">
        <h1 className="text-gray-800 text-3xl font-bold">Task Management</h1>
        <Button
          onClick={() => setShowAddItemModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md"
        >
          <IconPlus size={20} />
          Add Task
        </Button>
      </div>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {containers.map((container) => (
            <Container key={container.id} id={container.id} title={container.title}>
              <SortableContext items={container.items.map((item) => item.id)}>
                {container.items.map((item) => (
                  <Items
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    summary={item.summary}
                    description={item.description}
                    dueDate={item.dueDate}
                  />
                ))}
              </SortableContext>
            </Container>
          ))}
        </div>
        <DragOverlay>
          {activeId && <Items id={activeId} title={findItemTitle(activeId)} summary={''} description={''} dueDate={''} />}
        </DragOverlay>
      </DndContext>
    </div>
  );
};
export default TaskManagement;
