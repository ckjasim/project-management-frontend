// import React from 'react';
// import ContainerProps from './container.type';
// import { useSortable } from '@dnd-kit/sortable';
// import { CSS } from '@dnd-kit/utilities';
// import clsx from 'clsx';

// // import { Button } from '../Button';

// const Container = ({
//   id,
//   children,
//   title,
//   description,
//   onAddItem,
// }: ContainerProps) => {
//   const {
//     attributes,
//     setNodeRef,
//     listeners,
//     transform,
//     transition,
//     isDragging,
//   } = useSortable({
//     id: id,
//     data: {
//       type: 'container',
//     },
//   });
//   return (
//     <div
//       {...attributes}
//       ref={setNodeRef}
//       style={{
//         transition,
//         transform: CSS.Translate.toString(transform),
//       }}
//       className={`
//         w-full 
//         min-h-[calc(100vh-16rem)]  
//         max-h-full 
//         bg-white
//         rounded-2xl
//         shadow-lg
//         hover:shadow-xl
//         transition-all
//         duration-300
//         p-6
//         pb-72
//         flex
//         flex-col
//         gap-y-6
//         border
//         border-gray-100
//         ${isDragging ? 'opacity-50 rotate-2 scale-105' : ''}
//       `}
      
      
//     > 
      
//       <div className="flex items-center justify-between">
//         <div className="flex flex-col gap-y-1">
//           <h1 className="text-gray-800 text-xl">{title}</h1>
//           <p className="text-gray-400 text-sm">{description}</p>
//         </div>
//         {/* <button
//           className="border p-2 text-xs rounded-xl shadow-lg hover:shadow-xl"
//           {...listeners}
//         >
//           Drag Handle
//         </button> */}
//       </div>

//       {children}
//       {/* <button  onClick={onAddItem}>
//         <IconPlus  />
//       </button> */}
//     </div>
//   );
// };

// export default Container;

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
        h-screen
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