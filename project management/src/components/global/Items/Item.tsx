import React, { useState } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Clock, 
  AlertCircle, 
  GripVertical, 
} from 'lucide-react';
import { format } from 'date-fns';

interface ItemsProps { 
  id: UniqueIdentifier;
  title: string;
  description: string;
  dueDate: string;
  assignedTo: string;
  priority: string;
  selectedTeam: any;
}

const getPriorityColor = (priority: string) => {
  switch (priority?.toLowerCase()) {
    case 'high': return 'bg-red-50 text-red-600 border border-red-200';
    case 'medium': return 'bg-yellow-50 text-yellow-600 border border-yellow-200';
    case 'low': return 'bg-green-50 text-green-600 border border-green-200';
    default: return 'bg-gray-50 text-gray-600 border border-gray-200';
  }
};

const Items = ({ 
  id, 
  title, 
  description, 
  dueDate, 
  assignedTo, 
  priority,
  selectedTeam
}: ItemsProps) => {

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


  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const isOverdue = new Date(dueDate) < new Date();



  return (
    <>
      <div
        ref={setNodeRef}
        {...attributes}
        style={{
          transform: CSS.Transform.toString(transform),
          transition,
        }}
        className={`
          group relative
          bg-white
          rounded-2xl
          shadow-md
          border border-gray-100
          hover:shadow-xl
          transition-all
          duration-300
          overflow-hidden
          ${isDragging ? 'opacity-70 scale-105 shadow-2xl' : ''}
        `}
      >
        <div
          {...listeners}
          className="absolute left-2 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity z-10"
        >
          <GripVertical className="h-5 w-5 text-gray-400 hover:text-gray-600" />
        </div>

        <div className="p-4 space-y-3">
          <div className="flex items-start justify-between gap-4">
          <div className="flex-1">
          <span 
      className={`absolute top-0 left-0 w-full  ${getPriorityColor(priority)}`}
    ></span>
  <h3 
    className={`font-semibold text-xl text-gray-900 mb-1 truncate relative`}
  >
    {title}
   
  </h3>
  {description && (
    <p className="text-sm text-gray-600 line-clamp-2 mt-6">{description}</p>
  )}
</div>

            
            <div className="flex items-center space-x-2">
             
            {isOverdue && (
                <div className="flex items-center text-red-500 text-xs">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  <span>Overdue</span>
                </div>
              )}

    
            </div>
          </div>

          <div className="flex items-center justify-between border-t border-gray-100 pt-3">
            <div className="flex items-center space-x-2">
              <div className="bg-gray-100 text-gray-700 px-2.5 py-1 rounded-full text-xs">
                <span className="mr-1">👤</span>
                {assignedTo}
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <div className="flex items-center text-xs text-gray-500 space-x-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{formatDate(dueDate)}</span>
              </div>

             
            </div>
          </div>
           
        </div>
      </div>

   
    </>
  );
};

export default Items;