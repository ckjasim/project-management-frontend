import React, { useState } from 'react';
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

import Container from '@/components/global/Container/Container';
import { UniqueIdentifier } from '@dnd-kit/core';
import { SortableContext } from '@dnd-kit/sortable';
import Items from '@/components/global/Items/Item';
import { div, h1 } from 'framer-motion/client';
type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
  }[];
};

// Dummy dashboard component with content
const Dashboard = () => {
  // const contentArray = [
  //   <div className="p-2 bg-blue-200 rounded">Content 1</div>,
  //   <div className="p-2 bg-green-200 rounded">Content 2</div>,
  //   <div className="p-2 bg-red-200 rounded">Content 3</div>,
  //   <div className="p-2 bg-yellow-200 rounded">Content 4</div>,
  // ];

  const [itemName, setItemName] = useState('');
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();

  const [containers, setContainers] = useState<DNDType[]>([
    { id: 'pending', title: 'Pending', items: [{ id: '1', title: 'Task 1' }] },
    { id: 'progressing', title: 'Progressing', items: [{ id: '2', title: 'Task 2' }] },
    { id: 'review', title: 'Review', items: [{ id: '3', title: 'Task 3' }] },
    { id: 'done', title: 'Done', items: [{ id: '4', title: 'Task 4' }] },
  ]);
  const onAddItem = () => {
    if (!itemName) return;
    const id = `item-${uuidv4()}`;
    const container = containers.find((item) => item.id === currentContainerId);
    if (!container) return;
    container.items.push({
      id,
      title: itemName,
    });
    setContainers([...containers]);
    setItemName('');
    setShowAddItemModal(false);
  };

  return (
    //     <div className="flex flex-1">
    //     <div className="p-2 md:p-10 rounded-tl-2xl border border-neutral-200 dark:border-neutral-700 bg-white dark:bg-neutral-900 flex flex-col gap-2 flex-1 w-full h-full">
    //       {/* First Section with 4 placeholders */}
    //       <div className="flex gap-2">
    //   {[...new Array(4)].map((_, i) => (
    //     <div
    //       key={"first-array-" + i}
    //       className="h-20 w-full rounded-lg bg-gray-100 dark:bg-neutral-800 animate-pulse flex items-center justify-center" // Added flex properties
    //     >
    //       {/* Add your content here */}
    //       <span className="text-gray-600 dark:text-neutral-300">
    //         Loading...
    //       </span>
    //       {/* You can also use an icon or any other element */}
    //       {/* <IconLoader className="text-gray-600 dark:text-neutral-300 h-6 w-6" /> */}
    //     </div>
    //   ))}
    // </div>

    // <div className="flex gap-2">
    //   {contentArray.map((content, i) => (
    //     <div
    //       key={"second-array-" + i}
    //       className="h-full w-full rounded-lg bg-gray-100 dark:bg-neutral-800  flex items-center justify-center"
    //     >
    //       {content} {/* Render the div as content */}
    //     </div>
    //   ))}
    // </div>

    //     </div>
    //   </div>

    <div>
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
          <input
            type="text"
            placeholder="Item Title"
            name="itemname"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <button>Add Item</button>
        </div>
      </Modal>
      <SortableContext items={containers.map((i) => i.id)}>
        {containers.map((container) => (
         
          <Container
            id={container.id}
            title={container.title}
            key={container.id}
            onAddItem={() => {
              setShowAddItemModal(true);
              setCurrentContainerId(container.id);
            }}
          >
            <SortableContext items={container.items.map((i) => i.id)}>
              <div className="flex items-start flex-col gap-y-4">
                {container.items.map((i) => (
                  <Items title={i.title} id={i.id} key={i.id} />
                ))}
              </div>
            </SortableContext>
          </Container>
        ))}
      </SortableContext>
    </div>
  );
};
function uuidv4() {
  throw new Error('Function not implemented.');
}

