import React, { useState } from 'react';
import { UniqueIdentifier } from '@dnd-kit/core';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Trash2, Clock, AlertCircle, GripVertical, Edit } from 'lucide-react';
import { format } from 'date-fns';
import { deleteTaskApi, patchTaskApi } from '@/services/api/api';
import Modal from '@/components/global/Modal/Modal';
import * as Yup from 'yup';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Button } from '@/components/ui/button';

type Priority = 'low' | 'medium' | 'high';

interface ItemsType {
  id: UniqueIdentifier;
  title: string;
  summary: string;
  description: string;
  dueDate: string;
  priority?: Priority;
  status?: string;
}

const Item = ({
  id,
  title,
  summary,
  description,
  dueDate,
  status = 'pending'
}: ItemsType) => {
  const [showEditItemModal, setShowEditItemModal] = useState(false);
  
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

  const deleteItem = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    try {
      await deleteTaskApi(id);
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  const handleEditSubmit = async (values: Omit<ItemsType, 'id' | 'status' | 'priority'>) => {
    try {
      await patchTaskApi(id, values);
    } catch (error) {
      console.error('Error updating task:', error);
    }
  };

  const getPriorityColor = (priority: Priority) => {
    return {
      high: 'bg-red-100 text-red-700',
      medium: 'bg-yellow-100 text-yellow-700',
      low: 'bg-green-100 text-green-700',
    }[priority] || 'bg-gray-100 text-gray-700';
  };

  const getStatusColor = (status: string) => {
    return {
      completed: 'bg-green-100 text-green-700',
      'in progress': 'bg-blue-100 text-blue-700',
      pending: 'bg-gray-100 text-gray-700',
    }[status.toLowerCase()] || 'bg-gray-100 text-gray-700';
  };
  
  

  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, "Enter a valid title")
      .required("Title is required"),
    summary: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, "Enter a valid summary")
      .required("Summary is required"),
    description: Yup.string(),
    dueDate: Yup.date().required("Due date is required").nullable(),
  });

  type FormValues = Omit<ItemsType, 'id' | 'priority' | 'status'>;
  console.log(dueDate,'llllllllllllllllllllllllllllllllllllllllllllllllllddddddddddddd')
  return (
    <div>
      <Modal showModal={showEditItemModal} setShowModal={setShowEditItemModal}>
        <Formik<FormValues>
          initialValues={{
            title,
            summary,
            description,
            dueDate,
          }}
          validationSchema={validationSchema}
          onSubmit={handleEditSubmit}
        >
          {({ isSubmitting }) => (
            <Form className="flex flex-col w-full items-center p-6 gap-y-6">
              <h1 className="text-gray-800 text-3xl font-bold mb-4">Edit To-do</h1>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="title" className="text-gray-600 font-medium">Title</label>
                <Field
                  name="title"
                  type="text"
                  placeholder="Enter item title"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage name="title" component="div" className="text-red-600 font-semibold text-sm" />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="summary" className="text-gray-600 font-medium">Summary</label>
                <Field
                  name="summary"
                  type="text"
                  placeholder="Enter summary"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage name="summary" component="div" className="text-red-600 font-semibold text-sm" />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="description" className="text-gray-600 font-medium">Description</label>
                <Field
                  name="description"
                  type="text"
                  placeholder="Enter description"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage name="description" component="div" className="text-red-600 font-semibold text-sm" />
              </div>
              <div className="flex flex-col w-full mb-4">
                <label htmlFor="dueDate" className="text-gray-600 font-medium">Due Date</label>
                <Field
                  name="dueDate"
                  type="date"
                  className="w-full px-4 py-2 border rounded-md"
                />
                <ErrorMessage name="dueDate" component="div" className="text-red-600 font-semibold text-sm" />
              </div>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="mt-4 w-1/3 py-2 bg-emerald-700 text-white rounded-md hover:bg-emerald-600"
              >
                Update Item
              </Button>
            </Form>
          )}
        </Formik>
      </Modal>
      <div
        ref={setNodeRef}
        {...attributes}
        style={{
          transition,
          transform: CSS.Translate.toString(transform),
        }}
        className={`group relative px-4 py-4 bg-white rounded-xl border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-md transition-all duration-200 ${isDragging ? 'opacity-50 rotate-2' : ''}`}
      >
        <div
          {...listeners}
          className="absolute left-0 top-0 bottom-0 px-2 flex items-center cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <GripVertical className="w-4 h-4 text-gray-400" />
        </div>
        <div className="space-y-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 max-w-[150px]">
              <h3 className="text-lg font-semibold text-gray-900 mb-1 break-words">{title}</h3>
              <p className="text-sm text-gray-500 break-words">{summary}</p>
            </div>
            <div className="flex items-center space-x-2 ml-4">
              <button
                onClick={(e) => { e.stopPropagation(); setShowEditItemModal(true); }}
                className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
              >
                <Edit size={16} />
              </button>
              <button
                onClick={deleteItem}
                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
          <p className="text-sm text-gray-600 break-words max-w-[150px]">{description}</p>
          <div className="flex items-center justify-between pt-2">
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status)}`}>
              {status}
            </span>
            <div className="flex items-center text-sm text-gray-500">
              <Clock className="w-4 h-4 mr-1" />
              <span>{dueDate}</span>
            </div>
          </div>
        </div>
        {new Date(dueDate) < new Date() && (
          <div className="absolute top-2 right-2">
            <AlertCircle className="w-5 h-5 text-red-500" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Item;
