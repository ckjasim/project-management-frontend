import { useState } from 'react';
import { v4 as uuidv4 } from 'uuid';

// DnD
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

// Components
import Container from '@/components/Container';
import Items from '@/components/Item';
import Modal from '@/components/Modal';
import Input from '@/components/Input';
import { Button } from '@/components/Button';

type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: {
    id: UniqueIdentifier;
    title: string;
  }[];
};

export default function Home() {
    const [containers, setContainers] = useState<DNDType[]>([
      { id: 'pending', title: 'Pending', items: [] },
      { id: 'progressing', title: 'Progressing', items: [] },
      { id: 'review', title: 'Review', items: [] },
      { id: 'done', title: 'Done', items: [] },
    ]);
    
    const [activeId, setActiveId] = useState<UniqueIdentifier | null>(null);
    const [currentContainerId, setCurrentContainerId] = useState<UniqueIdentifier>();
    const [itemName, setItemName] = useState('');
    const [showAddItemModal, setShowAddItemModal] = useState(false);

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

    const findValueOfItems = (id: UniqueIdentifier | undefined, type: string) => {
      if (type === 'container') {
        return containers.find((item) => item.id === id);
      }
      if (type === 'item') {
        return containers.find((container) =>
          container.items.find((item) => item.id === id),
        );
      }
    };

    const findItemTitle = (id: UniqueIdentifier | undefined) => {
      const container = findValueOfItems(id, 'item');
      if (!container) return '';
      const item = container.items.find((item) => item.id === id);
      if (!item) return '';
      return item.title;
    };

    const findContainerTitle = (id: UniqueIdentifier | undefined) => {
      const container = findValueOfItems(id, 'container');
      if (!container) return '';
      return container.title;
    };

    const findContainerItems = (id: UniqueIdentifier | undefined) => {
      const container = findValueOfItems(id, 'container');
      if (!container) return [];
      return container.items;
    };

    const sensors = useSensors(
      useSensor(PointerSensor),
      useSensor(KeyboardSensor, {
        coordinateGetter: sortableKeyboardCoordinates,
      })
    );

    function handleDragStart(event: DragStartEvent) {
      const { active } = event;
      const { id } = active;
      setActiveId(id);
    }

    function handleDragEnd(event: DragEndEvent) {
      const { active, over } = event;

      if (!over || active.id === over.id) {
        setActiveId(null);
        return;
      }

      // Handle Item Sorting and Movement between Containers
      if (active.id.toString().includes('item')) {
        const activeContainer = findValueOfItems(active.id, 'item');
        const overContainer = findValueOfItems(over.id, 'container');

        if (!activeContainer || !overContainer) return;

        const activeContainerIndex = containers.findIndex((container) => container.id === activeContainer.id);
        const overContainerIndex = containers.findIndex((container) => container.id === overContainer.id);

        const activeItemIndex = activeContainer.items.findIndex((item) => item.id === active.id);

        if (activeContainerIndex === overContainerIndex) {
          const newItems = arrayMove(
            containers[activeContainerIndex].items,
            activeItemIndex,
            over.items.findIndex((item) => item.id === over.id)
          );
          const newContainers = [...containers];
          newContainers[activeContainerIndex].items = newItems;
          setContainers(newContainers);
        } else {
          let newContainers = [...containers];
          const [removedItem] = newContainers[activeContainerIndex].items.splice(activeItemIndex, 1);
          newContainers[overContainerIndex].items.push(removedItem);
          setContainers(newContainers);
        }
      }

      setActiveId(null);
    }

  return (
  
    
    <div className="mx-auto max-w-7xl py-10">
      {/* Add Item Modal */}
      <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
        <div className="flex flex-col w-full items-start gap-y-4">
          <h1 className="text-gray-800 text-3xl font-bold">Add Item</h1>
          <Input
            type="text"
            placeholder="Item Title"
            name="itemname"
            value={itemName}
            onChange={(e) => setItemName(e.target.value)}
          />
          <Button onClick={onAddItem}>Add Item</Button>
        </div>
      </Modal>

      <div className="flex items-center justify-between gap-y-2">
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
            <DragOverlay adjustScale={false}>
              {/* Drag Overlay for Item */}
              {activeId && activeId.toString().includes('item') && (
                <Items id={activeId} title={findItemTitle(activeId)} />
              )}
            </DragOverlay>
          </DndContext>
        </div>
      </div>
    </div>
  );
}
