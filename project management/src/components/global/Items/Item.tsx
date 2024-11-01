import { getTasksApi } from '@/services/api/api';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import clsx from 'clsx';
import { useEffect } from 'react';

type ItemsType = {
  id: UniqueIdentifier;
  title: string;
  summary: string;
  description: string;
  dueDate: string;
};

const Items = ({ id, title,summary,description,dueDate }: ItemsType) => {

 
  

  
    

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: id,
    data: {
      type: 'item',
    },
  });

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners} // Apply listeners to the entire div for full draggable area
      style={{
        transition,
        transform: CSS.Translate.toString(transform),
      }}
      className={clsx(
        'px-2 py-4 bg-white shadow-md rounded-xl w-full border border-transparent hover:border-gray-200 cursor-pointer',
        isDragging && 'opacity-50',
      )}
    >
      <div className="flex items-center justify-between">
        {title}
       
      </div>
      <div className="flex items-center justify-between">
        {summary}
    
      </div>
      <div className="flex items-center justify-between">

        {description}

      </div>
      <div className="flex items-center justify-between">

        {dueDate}
      </div>
    </div>
  );
};

export default Items;
