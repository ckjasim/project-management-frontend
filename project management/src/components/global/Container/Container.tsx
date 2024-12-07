
import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ContainerProps {
  id: string;
  title: string ;
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