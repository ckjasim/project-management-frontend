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

export function SidebarDemo() {
  const links = [
    {
      label: 'Dashboard',
      href: '#',
      icon: (
        <IconBrandTabler className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Chat',
      href: '#',
      icon: (
        <IconMessageChatbot className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Meeting',
      href: '#',
      icon: (
        <IconCalendarUser className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Files',
      href: '#',
      icon: (
        <IconFolders className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
    {
      label: 'Logout',
      href: '#',
      icon: (
        <IconArrowLeft className="text-lime-200 dark:text-neutral-200 h-6 w-6 flex-shrink-0" />
      ),
    },
  ];

  const [open, setOpen] = useState(false);

  return (
    <div
      className={cn(
        ' rounded-md flex flex-col md:flex-row bg-gray-100 dark:bg-neutral-800 w-screen flex-1 mx-auto border border-neutral-200 dark:border-neutral-700 overflow-hidden',
        'h-screen' // for your use case, use `h-screen` instead of `h-[60vh]`
      )}
    >
      <Sidebar open={open} setOpen={setOpen}>
        <SidebarBody className="justify-between gap-10">
          <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
            {open ? <Logo /> : <LogoIcon />}
            <div className="mt-8 flex flex-col gap-2">
              {links.map((link, idx) => (
                <SidebarLink key={idx} link={link} />
              ))}
            </div>
          </div>
          <div>
            <SidebarLink
              link={{
                label: 'jasim ck',
                href: '#',
                icon: (
                  <img
                    src="https://assets.aceternity.com/manu.png"
                    className="h-7 w-7 flex-shrink-0 rounded-full"
                    alt="Avatar"
                  />
                ),
              }}
            />
          </div>
        </SidebarBody>
      </Sidebar>
      <Dashboard />
    </div>
  );
}

export const Logo = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-5 bg-lime-200 dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
      <motion.span
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="font-medium text-lime-200 dark:text-white whitespace-pre"
      >
        Acet Labs
      </motion.span>
    </Link>
  );
};

export const LogoIcon = () => {
  return (
    <Link
      to="#"
      className="font-normal flex space-x-2 items-center text-sm text-black py-1 relative z-20"
    >
      <div className="h-5 w-6 bg-black dark:bg-white rounded-br-lg rounded-tr-sm rounded-tl-lg rounded-bl-sm flex-shrink-0" />
    </Link>
  );
};

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
  arrayMove,
  sortableKeyboardCoordinates,
} from '@dnd-kit/sortable';

import Container from '@/components/global/Container/Container';
import Items from '@/components/global/Items/Item';
// import {Modal} from '@/components/global/Modal/Modal';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { v4 as generateUuid } from 'uuid';
import { IconPlus } from '@tabler/icons-react';
import { postTasksApi ,getTasksApi} from '@/services/api/api';

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
  REVIEW: 'review',
  COMPLETED: 'completed',
};

const Dashboard = () => {
  const [containers, setContainers] = useState<DNDType[]>([
    { id: CONTAINER_IDS.PENDING, title: 'Pending', items: [] },
    { id: CONTAINER_IDS.PROGRESSING, title: 'Progressing', items: [] },
    { id: CONTAINER_IDS.REVIEW, title: 'Review', items: [] },
    { id: CONTAINER_IDS.COMPLETED, title: 'Done', items: [] },
  ]);
  
  const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
  const [currentContainerId, setCurrentContainerId] =
    useState<UniqueIdentifier>(CONTAINER_IDS.PENDING);
  const [itemName, setItemName] = useState('');
  const [itemSummary, setItemSummary] = useState('');
  const [itemDescription, setItemDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [loading, setLoading] = useState(true); // New loading state
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const res = await getTasksApi();
        const tasks = res.tasks;
  
        const itemsByContainerId = containers.reduce((acc, container) => {
          acc[container.id] = [];
          return acc;
        }, {} as Record<string, DNDType['items']>);
  
  
        tasks.forEach((task: { _id: any; topic: any; summary: any; description: any; dueDate: any; status: string }) => {
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
  
   
        const updatedContainers = containers.map(container => ({
          ...container,
          items: itemsByContainerId[container.id] || [], // Set items for each container
        }));
  
        setContainers(updatedContainers);
      } catch (error) {
        console.error('Error fetching tasks:', error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchTasks();
  }, [currentContainerId]);
  
  
  const onAddItem = async () => {
    if (!itemName) return;
  
    const items = {
      title: itemName,
      summary: itemSummary,
      description: itemDescription,
      dueDate,
      status: currentContainerId,
    };
  
    try {
      const res = await postTasksApi(items);
      console.log(res,'ooooooooooooooooo')
      const task = res.createdTask;
      console.log(task,'kkkkkkkkkkkkkk')
  
      const updatedContainers = containers.map(container => {
        if (container.id === currentContainerId) {
          return {
            ...container,
            items: [
              ...container.items,
              { id: task._id, title: itemName, summary: itemSummary, description: itemDescription, dueDate },
            ],
          };
        }
        return container;
      });
  
      setContainers(updatedContainers);
      resetForm();
      setShowAddItemModal(false);
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
  
  const findContainerById = (id: UniqueIdentifier | undefined) =>
    containers.find((container) => container.id === id);
  
  const findItemInContainer = (itemId: UniqueIdentifier | undefined) =>
    containers.find((container) =>
      container.items.find((item) => item.id === itemId)
    );
  
  const findItemTitle = (id: UniqueIdentifier | undefined) => {
    const container = findItemInContainer(id);
    if (!container) return '';
    const item = container.items.find((item) => item.id === id);
    return item ? item.title : '';
  };
  
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );
  
  function handleDragStart(event: DragStartEvent) {
    const { active } = event;
    setActiveId(active.id);
  }
  
  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
  
    if (!over || active.id === over.id) {
      setActiveId(null);
      return;
    }
  
    if (active.id.toString().includes('item')) {
      const activeContainer = findItemInContainer(active.id);
      const overContainer = findContainerById(over.id);
  
      if (!activeContainer || !overContainer) return;
  
      const activeContainerIndex = containers.findIndex(
        (c) => c.id === activeContainer.id
      );
      const overContainerIndex = containers.findIndex(
        (c) => c.id === overContainer.id
      );
  
      const activeItemIndex = activeContainer.items.findIndex(
        (item) => item.id === active.id
      );
  
      // When dragging within the same container
      if (activeContainerIndex === overContainerIndex) {
        const newItems = arrayMove(
          containers[activeContainerIndex].items,
          activeItemIndex,
          overContainer.items.findIndex((item) => item.id === over.id) // Fix here
        );
        const newContainers = [...containers];
        newContainers[activeContainerIndex].items = newItems;
        setContainers(newContainers);
      } else {
        const newContainers = [...containers];
        const [removedItem] = newContainers[activeContainerIndex].items.splice(
          activeItemIndex,
          1
        );
        newContainers[overContainerIndex].items.push(removedItem);
        setContainers(newContainers);
      }
    }
  
    setActiveId(null);
  }
  

  return (
    <div className="mx-auto max-w-7xl w-svw py-10">
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-center p-6 gap-y-6">
          <h1 className="text-gray-800 text-3xl font-bold mb-4">
            Create To-do
          </h1>

          <div className="flex flex-col w-full">
            <label htmlFor="itemname" className="text-gray-600 font-medium">
              Title
            </label>
            <Input
              type="text"
              id="itemname"
              placeholder="Enter item title"
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="itemsummary" className="text-gray-600 font-medium">
              Summary
            </label>
            <Input
              type="text"
              id="itemsummary"
              placeholder="Enter summary"
              value={itemSummary}
              onChange={(e) => setItemSummary(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col w-full">
            <label
              htmlFor="itemdescription"
              className="text-gray-600 font-medium"
            >
              Description
            </label>
            <Input
              type="text"
              id="itemdescription"
              placeholder="Enter description"
              value={itemDescription}
              onChange={(e) => setItemDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <div className="flex flex-col w-full">
            <label htmlFor="duedate" className="text-gray-600 font-medium">
              Due Date
            </label>
            <Input
              type="date"
              id="duedate"
              placeholder="Select due date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full px-4 py-2 border rounded-md"
            />
          </div>

          <Button
            onClick={onAddItem}
            className="mt-4 w-1/3 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600"
          >
            Add Item
          </Button>
        </div>
      </Modal>

      <div className="flex items-center justify-between gap-y-2 ">
        <h1 className="text-gray-800 text-3xl font-bold">Task Management</h1>
      </div>

      <div className="mt-10">
        <div className="grid grid-cols-4 gap-6">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCorners}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <SortableContext
              items={containers.map((container) => container.id)}
            >
              {containers.map((container) => (
                <div>
                  <div className="w-full  p-4 bg-gray-50 rounded-xl flex flex-row justify-between px-6 gap-y-4 mb-4">
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
                  <Container id={container.id} key={container.id}>
                    <SortableContext
                      items={container.items.map((item) => item.id)}
                    >
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
            </SortableContext>
            <DragOverlay adjustScale={false}>
              {activeId && activeId.toString().includes('item') && (
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
    </div>
  );
};
function uuidv4() {
  throw new Error('Function not implemented.');
}
