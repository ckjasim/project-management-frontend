import React, { useState } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { 
  Trash2, 
  Clock, 
  AlertCircle, 
  GripVertical, 
  Edit, 
  Loader2, 
  MoreVertical 
} from 'lucide-react';
import { format } from 'date-fns';
import { deleteTaskApi, getTeamMembersByTeamIdApi, patchTaskApi } from '@/services/api/api';
import Modal from '@/components/global/Modal/Modal';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { EmployeeSelect, PrioritySelect } from '@/components/ui/select';

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
  const [showEditModal, setShowEditModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(assignedTo);
  const [currentPriority, setCurrentPriority] = useState(priority);

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

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-600' },
  ];

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      setIsDeleting(true);
      try {
        await deleteTaskApi(id);
        // You might want to trigger a refresh of the task list here
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        setIsDeleting(false);
      }
    }
  };
  
  const editTask = async () => {
    setShowEditModal(true);
    try {
      const response = await getTeamMembersByTeamIdApi(selectedTeam.id);
      setTeamMembers(response?.teamMembers?.members || []);
    } catch (error) {
      console.error('Error fetching team members:', error);
    }
  };

  const handleUpdate = async (values: any) => {
    setIsUpdating(true);
    try {
      const updatedTask = {
        ...values,
        assignedTo: currentEmployee,
        priority: currentPriority,
      };
      await patchTaskApi(id, updatedTask);
      setShowEditModal(false);
      // You might want to trigger a refresh of the task list here
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return 'Invalid date';
    }
  };

  const isOverdue = new Date(dueDate) < new Date();

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, 'Enter a valid title')
      .required('Title is required'),
    description: Yup.string(),
    dueDate: Yup.date().required('Due date is required').nullable(),
  });

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
              <h3 className="font-semibold text-xl text-gray-900 mb-1 truncate">{title}</h3>
              {description && (
                <p className="text-sm text-gray-600 line-clamp-2 mt-6">{description}</p>
              )}
            </div>
            
            <div className="flex items-center space-x-2">
              <span className={`px-2.5 py-1 rounded-full text-xs font-normal tracking-wider ${getPriorityColor(priority)}`}>
                {priority}
              </span>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0 hover:bg-gray-100">
                    <MoreVertical className="h-4 w-4 text-gray-500" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem 
                    onSelect={editTask}
                    className="cursor-pointer"
                  >
                    <Edit className="mr-2 h-4 w-4" />
                    Edit Task
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onSelect={handleDelete}
                    className="cursor-pointer text-red-600 focus:bg-red-50 focus:text-red-800"
                    disabled={isDeleting}
                  >
                    {isDeleting ? (
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                      <Trash2 className="mr-2 h-4 w-4" />
                    )}
                    Delete Task
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
              <div className="flex items-center text-sm text-gray-500 space-x-1">
                <Clock className="h-4 w-4 text-blue-500" />
                <span>{formatDate(dueDate)}</span>
              </div>

              {isOverdue && (
                <div className="flex items-center text-red-500 text-sm">
                  <AlertCircle className="h-4 w-4 mr-1" />
                  <span>Overdue</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <Modal showModal={showEditModal} setShowModal={setShowEditModal}>
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-auto p-8">
          <h2 className="text-2xl font-bold mb-6 text-gray-900">Edit Task</h2>
          <Formik
            initialValues={{
              title,
              description,
              dueDate: dueDate ? new Date(dueDate).toISOString().split('T')[0] : '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
          >
            {({ isSubmitting }) => (
              <Form className="space-y-6">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                    Title
                  </label>
                  <Field
                    name="title"
                    as={Input}
                    className="w-full rounded-lg"
                  />
                  <ErrorMessage
                    name="title"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div>
                  <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <Field
                    name="description"
                    as={Input}
                    className="w-full rounded-lg"
                  />
                </div>

                <div className="w-full">
                  <label className="block text-gray-600 font-medium mb-2">
                    Assign Employee
                  </label>
                  <EmployeeSelect
                    assignedEmployee={currentEmployee}
                    setAssignedEmployee={setCurrentEmployee}
                    teamMembers={teamMembers}
                  />
                </div>

                <div className="w-full">
                  <label className="block text-gray-600 font-medium mb-2">
                    Priority
                  </label>
                  <PrioritySelect
                    priority={currentPriority}
                    setPriority={setCurrentPriority}
                    priorityLevels={priorityLevels}
                  />
                </div>

                <div>
                  <label htmlFor="dueDate" className="block text-sm font-medium text-gray-700 mb-2">
                    Due Date
                  </label>
                  <Field
                    name="dueDate"
                    type="date"
                    as={Input}
                    className="w-full rounded-lg"
                  />
                  <ErrorMessage
                    name="dueDate"
                    component="div"
                    className="mt-1 text-sm text-red-600"
                  />
                </div>

                <div className="flex justify-end space-x-3 pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowEditModal(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isSubmitting || isUpdating}
                  >
                    {(isSubmitting || isUpdating) ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Task'
                    )}
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </Modal>
    </>
  );
};

export default Items;