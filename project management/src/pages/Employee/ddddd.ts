// import { useState } from 'react';
// import { v4 as uuidv4 } from 'uuid';

// // DnD
// import {
//   DndContext,
//   DragEndEvent,
//   DragOverlay,
//   DragStartEvent,
//   KeyboardSensor,
//   PointerSensor,
//   UniqueIdentifier,
//   closestCorners,
//   useSensor,
//   useSensors,
// } from '@dnd-kit/core';
// import {
//   SortableContext,
//   arrayMove,
//   sortableKeyboardCoordinates,
// } from '@dnd-kit/sortable';

// // Components
// import Container from '@/components/Container';
// import Items from '@/components/Item';
// import Modal from '@/components/Modal';
// import Input from '@/components/Input';
// import { Button } from '@/components/Button';

// type DNDType = {
//   id: UniqueIdentifier;
//   title: string;
//   items: {
//     id: UniqueIdentifier;
//     title: string;
//   }[];
// };

// // Define fixed container IDs for easy referencing
// const CONTAINER_IDS = {
//   PENDING: 'pending',
//   PROGRESSING: 'progressing',
//   REVIEW: 'review',
//   DONE: 'done',
// };

// export default function Home() {
//   const [containers, setContainers] = useState<DNDType[]>([
//     { id: CONTAINER_IDS.PENDING, title: 'Pending', items: [] },
//     { id: CONTAINER_IDS.PROGRESSING, title: 'Progressing', items: [] },
//     { id: CONTAINER_IDS.REVIEW, title: 'Review', items: [] },
//     { id: CONTAINER_IDS.DONE, title: 'Done', items: [] },
//   ]);

//   const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
//   const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>(CONTAINER_IDS.PENDING);
//   const [itemName, setItemName] = useState('');
//   const [showAddItemModal, setShowAddItemModal] = useState(false);

//   const onAddItem = () => {
//     if (!itemName) return;
//     const id = `item-${uuidv4()}`;
//     const container = containers.find((item) => item.id === currentContainerId);
//     if (!container) return;
//     container.items.push({
//       id,
//       title: itemName,
//     });
//     setContainers([...containers]);
//     setItemName('');
//     setShowAddItemModal(false);
//   };

//   const findContainerById = (id: UniqueIdentifier | undefined) =>
//     containers.find((container) => container.id === id);

//   const findItemInContainer = (itemId: UniqueIdentifier | undefined) =>
//     containers.find((container) =>
//       container.items.find((item) => item.id === itemId),
//     );

//   const findItemTitle = (id: UniqueIdentifier | undefined) => {
//     const container = findItemInContainer(id);
//     if (!container) return '';
//     const item = container.items.find((item) => item.id === id);
//     return item ? item.title : '';
//   };

//   const sensors = useSensors(
//     useSensor(PointerSensor),
//     useSensor(KeyboardSensor, {
//       coordinateGetter: sortableKeyboardCoordinates,
//     })
//   );

//   function handleDragStart(event: DragStartEvent) {
//     const { active } = event;
//     setActiveId(active.id);
//   }

//   function handleDragEnd(event: DragEndEvent) {
//     const { active, over } = event;

//     if (!over || active.id === over.id) {
//       setActiveId(null);
//       return;
//     }

//     if (active.id.toString().includes('item')) {
//       const activeContainer = findItemInContainer(active.id);
//       const overContainer = findContainerById(over.id);

//       if (!activeContainer || !overContainer) return;

//       const activeContainerIndex = containers.findIndex((c) => c.id === activeContainer.id);
//       const overContainerIndex = containers.findIndex((c) => c.id === overContainer.id);

//       const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id);

//       if (activeContainerIndex === overContainerIndex) {
//         const newItems = arrayMove(
//           containers[activeContainerIndex].items,
//           activeItemIndex,
//           over.items.findIndex((item) => item.id === over.id)
//         );
//         const newContainers = [...containers];
//         newContainers[activeContainerIndex].items = newItems;
//         setContainers(newContainers);
//       } else {
//         const newContainers = [...containers];
//         const [removedItem] = newContainers[activeContainerIndex].items.splice(activeItemIndex, 1);
//         newContainers[overContainerIndex].items.push(removedItem);
//         setContainers(newContainers);
//       }
//     }

//     setActiveId(null);
//   }

//   return (
//     <div className="mx-auto max-w-7xl py-10">
//       <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
//         <div className="flex flex-col w-full items-start gap-y-4">
//           <h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
//           <Input
//             type="text"
//             placeholder="Item Title"
//             name="itemname"
//             value={itemName}
//             onChange={(e) => setItemName(e.target.value)}
//           />
//           <Button onClick={onAddItem}>Add Item</Button>
//         </div>
//       </Modal>

//       <div className="flex items-center justify-between gap-y-2">
//         <h1 className="text-gray-800 text-3xl font-bold">Task Management</h1>
//       </div>

//       <div className="mt-10">
//         <div className="grid grid-cols-4 gap-6">
//           <DndContext
//             sensors={sensors}
//             collisionDetection={closestCorners}
//             onDragStart={handleDragStart}
//             onDragEnd={handleDragEnd}
//           >
//             <SortableContext items={containers.map((container) => container.id)}>
//               {containers.map((container) => (
//                 <Container
//                   id={container.id}
//                   title={container.title}
//                   key={container.id}
//                   onAddItem={() => {
//                     setShowAddItemModal(true);
//                     setCurrentContainerId(container.id);
//                   }}
//                 >
//                   <SortableContext items={container.items.map((item) => item.id)}>
//                     <div className="flex items-start flex-col gap-y-4">
//                       {container.items.map((item) => (
//                         <Items title={item.title} id={item.id} key={item.id} />
//                       ))}
//                     </div>
//                   </SortableContext>
//                 </Container>
//               ))}
//             </SortableContext>
//             <DragOverlay adjustScale={false}>
//               {activeId && activeId.toString().includes('item') && (
//                 <Items id={activeId} title={findItemTitle(activeId)} />
//               )}
//             </DragOverlay>
//           </DndContext>
//         </div>
//       </div>
//     </div>
//   );
// }


import React from 'react';
import ContainerProps from './container.type';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';

// import { Button } from '../Button';

const Container = ({
  id,
  children,
  title,
  description,
  onAddItem,
}: ContainerProps) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'container',
    },
  });
  return (
    <div
      {...attributes}
      ref={setNodeRef}
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'w-full h-full p-4 bg-gray-50 rounded-xl flex flex-col gap-y-4',
        isDragging && 'opacity-50',
      )}
    > 
      
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-y-1">
          <h1 className="text-gray-800 text-xl">{title}</h1>
          <p className="text-gray-400 text-sm">{description}</p>
        </div>
        {/* <button
          className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          Drag Handle
        </button> */}
      </div>

      {children}
      {/* <button  onClick={onAddItem}>
        <IconPlus  />
      </button> */}
    </div>
  );
};

export default Container;




<button className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-[#013a33] dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]" type="submit">
<IconBrandGoogle className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
<span className="text-neutral-700 dark:text-neutral-300 text-sm">Google</span>
{/* <BottomGradient /> */}
</button>
<button className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black dark:text-white rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-[#013a33] dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]" type="submit">
<IconBrandGithub className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
<span className="text-neutral-700 dark:text-neutral-300 text-sm">GitHub</span>
{/* <BottomGradient /> */}
</button>