// TaskModal.tsx
import React from 'react';
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import Modal from './Modal';

interface PriorityLevel {
  value: string;
  label: string;
  color: string;
}

interface TeamMember {
  _id: string;
  name: string;
}

interface TaskModalProps {
  showAddItemModal: boolean;
  setShowAddItemModal: (show: boolean) => void;
  teamMembers: TeamMember[];
  priorityLevels: PriorityLevel[];
  onAddItem: (values: any) => void;
}


interface TaskModalProps {
  showAddItemModal: boolean;
  setShowAddItemModal: (show: boolean) => void;
  teamMembers: TeamMember[];
  priorityLevels: PriorityLevel[];
  onAddItem: (values: any) => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onFileRemove: (index: number) => void;
  files: File[];
}

const TaskFormSchema = Yup.object().shape({
  title: Yup.string().required('Task title is required'),
  description: Yup.string().required('Task description is required'),
  dueDate: Yup.date().required('Due date is required'),
  priority: Yup.string().required('Priority is required'),
  assignedTo: Yup.string().required('Assigned employee is required'),
});

const TaskModal: React.FC<TaskModalProps> = ({
  showAddItemModal,
  setShowAddItemModal,
  teamMembers,
  priorityLevels,
  onAddItem,
  onFileChange,
  onFileRemove,
  files,
}) => {
  const initialValues = {
    title: '',
    description: '',
    assignedTo: '',
    priority: '',
    dueDate: '',
  };

  return (
    <Modal showModal={showAddItemModal} setShowModal={setShowAddItemModal}>
      <div className="flex flex-col w-full items-center p-8 gap-y-6 bg-white rounded-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Create Task</h1>

        <Formik
          initialValues={initialValues}
          validationSchema={TaskFormSchema}
          onSubmit={onAddItem}
        >
          <Form className="w-full space-y-4">
          <div className="space-y-1">
                <label htmlFor="title" className="block text-gray-600 font-medium">
                  Title
                </label>
                <Field
                  id="title"
                  name="title"
                  placeholder="Enter task title"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                />
                <ErrorMessage
                  name="title"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="description" className="block text-gray-600 font-medium">
                  Description
                </label>
                <Field
                  as="textarea"
                  id="description"
                  name="description"
                  placeholder="Detailed task description"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500 transition-colors"
                  rows={4}
                />
                <ErrorMessage
                  name="description"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="assignedTo" className="block text-gray-600 font-medium">
                  Assign Employee
                </label>
                <Field
                  as="select"
                  id="assignedTo"
                  name="assignedTo"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                >
                  <option value="" disabled hidden>
                    Select Employee
                  </option>
                  {teamMembers.map((member) => (
                    <option key={member._id} value={member._id}>
                      {member.name}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="assignedTo"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="priority" className="block text-gray-600 font-medium">
                  Priority
                </label>
                <Field
                  as="select"
                  id="priority"
                  name="priority"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                >
                  <option value="" disabled hidden>
                    Select Priority
                  </option>
                  {priorityLevels.map((level) => (
                    <option key={level.value} value={level.value}>
                      {level.label}
                    </option>
                  ))}
                </Field>
                <ErrorMessage
                  name="priority"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

              <div className="space-y-1">
                <label htmlFor="dueDate" className="block text-gray-600 font-medium">
                  Due Date
                </label>
                <Field
                  id="dueDate"
                  type="date"
                  name="dueDate"
                  className="w-full px-4 py-2 border-2 border-gray-200 rounded-lg focus:border-blue-500"
                />
                <ErrorMessage
                  name="dueDate"
                  component="div"
                  className="text-red-500 text-sm"
                />
              </div>

            <div className="space-y-1">
              <label htmlFor="files" className="block text-gray-600 font-medium">
                Attachments
              </label>
              <div className="mt-2">
                <label className="flex items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 cursor-pointer transition-colors">
                  <input
                    id="files"
                    type="file"
                    multiple
                    onChange={onFileChange}
                    className="hidden"
                    accept="image/*,.pdf,.doc,.docx,.txt"
                  />
                  <div className="text-center">
                    <p className="text-gray-600">
                      Drop files here or click to upload
                    </p>
                    <p className="text-sm text-gray-500 mt-1">
                      Supported formats: Images, PDF, DOC, DOCX, TXT
                    </p>
                  </div>
                </label>
                {files.length > 0 && (
                  <ul className="mt-2 space-y-2">
                    {files.map((file, index) => (
                      <li 
                        key={index} 
                        className="flex justify-between items-center text-sm text-gray-600 bg-gray-50 p-2 rounded"
                      >
                        <span>{file.name}</span>
                        <button
                          type="button"
                          onClick={() => onFileRemove(index)}
                          className="text-red-500 hover:text-red-700"
                        >
                          Remove
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-md"
            >
              Create Task
            </button>
          </Form>
        </Formik>
      </div>
    </Modal>
  );
};

export default TaskModal;