import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import * as Yup from 'yup';
import {
  AlertCircle,
  ArrowDownToLine,
  Badge,
  Clock,
  Edit,
  FileIcon,
  Loader2,
  MessageSquare,
  Send,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Textarea } from '@/components/ui/textarea';
import Modal from './Modal';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { TaskDetailModalProps } from '@/types';
import { deleteTaskApi, patchTaskApi } from '@/services/api/taskApi';
import { getTeamMembersByTeamIdApi } from '@/services/api/projectApi';
import { ErrorMessage, Field, Form, Formik } from 'formik';
import { Input } from '@/components/ui/input';
import { EmployeeSelect, PrioritySelect } from '@/components/ui/select';


const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  show,
  onClose,
  task,
  onAddComment,
  selectedTeam
}) => {
  const [newComment, setNewComment] = useState('');
  const { userInfo } = useSelector((state: RootState) => state.Auth);
  // const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [teamMembers, setTeamMembers] = useState([]);
  const [currentEmployee, setCurrentEmployee] = useState(task?.assignedTo);
  const [currentPriority, setCurrentPriority] = useState(task?.priority);

  if (!task) return null;

  const isOverdue = new Date(task.dueDate) < new Date();

  const priorityLevels = [
    { value: 'low', label: 'Low Priority', color: 'text-green-600' },
    { value: 'medium', label: 'Medium Priority', color: 'text-yellow-600' },
    { value: 'high', label: 'High Priority', color: 'text-red-900' },
  ];

  const handleSubmitComment = () => {
    if (newComment.trim() && onAddComment) {
      const comment = {
        _id: Math.random().toString(),
        author: {
          name: userInfo.name,
          profileImage: { url: userInfo.profileImage || null },
        },
        createdAt: new Date().toISOString(),
        content: newComment.trim(),
      };

      if (task.comments) {
        task.comments.push(comment);
      } else {
        task.comments = [comment];
      }
      onAddComment(newComment);
      setNewComment('');
    }
  };

  const onDelete = async () => {

      // setIsDeleting(true);
      try {
        await deleteTaskApi(task.id);
        // You might want to trigger a refresh of the task list here
      } catch (error) {
        console.error('Error deleting task:', error);
      } finally {
        // setIsDeleting(false);
      }
  
  };
  const validationSchema = Yup.object().shape({
    title: Yup.string()
      .trim()
      .matches(/^(?!\s*$).+/, 'Enter a valid title')
      .required('Title is required'),
    description: Yup.string(),
    dueDate: Yup.date().required('Due date is required').nullable(),
  });
  const onEdit = async () => {
    setShowEditModal(true);
    try {
      const response = await getTeamMembersByTeamIdApi(selectedTeam?.id);
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
      await patchTaskApi(task?.id, updatedTask);
      setShowEditModal(false);
      // You might want to trigger a refresh of the task list here
    } catch (error) {
      console.error('Error updating task:', error);
    } finally {
      setIsUpdating(false);
    }
  };
  return (
    <div>

         
    <AnimatePresence>
      
      {show && (
        <Modal showModal={show} setShowModal={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex justify-between items-start p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {task.title}
                    </h2>
                    <Badge
                      
                      className="capitalize"
                    >
                      {task.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600">
                    <div className="flex items-center space-x-2">
                      <User className="h-4 w-4" />
                      <span>{task.assignedTo}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Tag className="h-4 w-4" />
                      <span className="capitalize">{task.status}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4" />
                      <span>
                        {format(new Date(task.dueDate), 'MMM d, yyyy')}
                      </span>
                      {isOverdue && (
                        <Badge  className="ml-2">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  {userInfo.role==="project manager"?(
                    <div className='space-x-2'>


                    <Button
                    variant="outline"
                    size="sm"
                    onClick={onEdit}
                    className="text-gray-600 hover:text-gray-900"
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </Button>
                    </div>
                ):('')}
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={onClose}
                    className="text-gray-500"
                  >
                    <X className="h-5 w-5" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Content Section */}
            <div className="grid grid-cols-3 gap-6 p-6">
              {/* Main Content */}
              <div className="col-span-2 space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                    Description
                  </h3>
                  <p className="text-gray-600 whitespace-pre-wrap leading-relaxed">
                    {task.description || 'No description provided'}
                  </p>
                </div>

                {/* Comments Section */}
                <div className="bg-white rounded-lg p-6 shadow-sm border">
                  <h3 className="text-lg font-semibold mb-4 flex items-center text-gray-800">
                    <MessageSquare className="h-5 w-5 mr-2" />
                    Comments
                  </h3>

                  <div className="space-y-4">
                    {task.comments?.map((comment) => (
                      <div
                        key={comment._id}
                        className="flex space-x-3 p-3 bg-gray-50 rounded-lg"
                      >
                        <Avatar className="h-8 w-8">
                          {comment.author?.profileImage?.url ? (
                            <div>
                              <img
                                src={comment.author?.profileImage?.url}
                                alt=""
                              />
                            </div>
                          ) : (
                            <AvatarFallback>
                              {comment.author?.name[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between">
                            <p className="text-sm font-medium text-gray-900">
                              {comment.author?.name}
                            </p>
                            <span className="text-xs text-gray-500">
                              {format(
                                new Date(comment.createdAt),
                                'MMM d, yyyy h:mm a'
                              )}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-gray-600">
                            {comment.content}
                          </p>
                        </div>
                      </div>
                    ))}
                    {userInfo.name === task.assignedTo ||
                    userInfo.role === 'project manager' ? (
                      <div className="mt-4">
                        <Textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="min-h-[80px]"
                        />
                        <div className="mt-2 flex justify-end">
                          <Button
                            onClick={handleSubmitComment}
                            disabled={!newComment.trim()}
                          >
                            <Send className="h-4 w-4 mr-2" />
                            Send
                          </Button>
                        </div>
                      </div>
                    ) : (
                      ''
                    )}
                  </div>
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Attachments Card */}
                <Card className="shadow-sm">
                  <CardHeader className="bg-gray-50 pb-3">
                    <CardTitle className="text-base flex items-center">
                      <FileIcon className="h-4 w-4 mr-2 text-gray-500" />
                      Attachments
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4">
                    {task.attachments && task.attachments.length > 0 ? (
                      <ul className="space-y-2">
                        {task.attachments.map((attachment, index) => (
                          <li
                            key={index}
                            className="group bg-gray-50 p-3 rounded-lg hover:bg-gray-100 transition-all"
                          >
                            <div className="flex items-center justify-between">
                              <div className="min-w-0 flex-1">
                                <p className="font-medium text-sm text-gray-800 truncate">
                                  {attachment.name}
                                </p>
                                <p className="text-xs text-gray-500 mt-0.5">
                                  {`${(Number(attachment?.size) / 1024).toFixed(
                                    2
                                  )} KB`}
                                </p>
                              </div>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => {
                                  const isPdf = attachment.url.endsWith('.pdf');
                                  if (isPdf) {
                                    window.open(attachment.url, '_blank');
                                  } else {
                                    window.open(attachment.url);
                                  }
                                }}
                              >
                                <ArrowDownToLine className="h-4 w-4" />
                              </Button>
                            </div>
                          </li>
                        ))}
                      </ul>
                    ) : (
                      <div className="text-sm text-gray-500 flex items-center justify-center py-4">
                        No attachments
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </motion.div>
        </Modal>
      )}
    </AnimatePresence>
    <Modal showModal={showEditModal} setShowModal={setShowEditModal} >
      
          <h2 className="text-2xl font-bold mb-6 pl-3 text-gray-900">Edit Task</h2>
          <Formik
            initialValues={{
              title: task.title,
              description: task.description,
              dueDate: task.dueDate
                ? new Date(task.dueDate).toISOString().split('T')[0]
                : '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleUpdate}
          >
            {({ isSubmitting }) => ( 
              <Form className="space-y-6 min-w-80 px-3">
                <div>
                  <label
                    htmlFor="title"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                  <label
                    htmlFor="dueDate"
                    className="block text-sm font-medium text-gray-700 mb-2"
                  >
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
                  <Button type="submit" disabled={isSubmitting || isUpdating}>
                    {isSubmitting || isUpdating ? (
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
    
      </Modal>
    </div>
  );
};

export default TaskDetailModal;
