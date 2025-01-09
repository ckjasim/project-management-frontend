import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UniqueIdentifier } from '@dnd-kit/core';

interface ContainerProps {
  id: UniqueIdentifier;
  title: any;
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
    isOver,
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
        h-[calc(100vh-10rem)]
        flex
        flex-col
        relative
        ${className}
        ${isDragging ? 'opacity-50 scale-105' : ''}
      `}
      style={{
        transform: CSS.Translate.toString(transform),
        transition,
      }}
    >
      <CardHeader className="pb-3">
        <CardTitle className="text-lg font-semibold flex items-center">
          {title}
          
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pt-0 pb-96">
        {/* Drop area indicator */}
        <div 
          className={`
            absolute 
            inset-0
            pointer-events-none
            transition-colors 
            duration-200
            ${isOver ? 'bg-blue-100/50 border-2 border-dashed border-blue-400 rounded-lg' : ''}
          `}
        />
        {/* Task items */}
        <div className="space-y-4 relative min-h-full">
          {children}
        </div>
      </CardContent>
    </Card>
  );
};

export default Container;