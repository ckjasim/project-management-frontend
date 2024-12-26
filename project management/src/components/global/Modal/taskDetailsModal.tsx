import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import {
  AlertCircle,
  ArrowDownToLine,
  Badge,
  Clock,
  Edit,
  FileIcon,
  Tag,
  Trash2,
  User,
  X,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Modal from './Modal';

interface Attachment {
  name: string;
  size: string;
  url: string;
}

interface TaskDetailModalProps {
  show: boolean;
  onClose: () => void;
  task: {
    id: string;
    title: string;
    description: string;
    priority: string;
    assignedTo: string;
    dueDate: string;
    attachments: Attachment[];
    members: string[];
    status: string;
  } | null;
  onEdit: () => void;
  onDelete: () => void;
}

const getPriorityColor = (priority: string) => {
  switch (priority.toLowerCase()) {
    case 'high':
      return 'bg-red-100 text-red-800';
    case 'medium':
      return 'bg-yellow-100 text-yellow-800';
    case 'low':
      return 'bg-green-100 text-green-800';
    default:
      return 'bg-gray-100 text-gray-800';
  }
};

const formatDate = (date: string) => {
  return format(new Date(date), 'MMM d, yyyy');
};

const TaskDetailModal: React.FC<TaskDetailModalProps> = ({
  show,
  onClose,
  task,
  onEdit,
  onDelete,
}) => {
  if (!task) return null;

  const isOverdue = new Date(task.dueDate) < new Date();

  return (
    <AnimatePresence>
      {show && (
        <Modal showModal={show} setShowModal={onClose}>
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="flex flex-col w-full max-w-5xl bg-white rounded-xl shadow-lg overflow-hidden"
          >
            {/* Header Section */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
              <div className="flex justify-between items-start p-6">
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <h2 className="text-2xl font-bold text-gray-800">
                      {task.title}
                    </h2>
                    <Badge
                      variant={task.priority.toLowerCase()}
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
                        <Badge variant="destructive" className="ml-2">
                          <AlertCircle className="h-3 w-3 mr-1" />
                          Overdue
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
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
                                {attachment.url.endsWith('.pdf') ? (
                                  <ArrowDownToLine className="h-4 w-4" />
                                ) : (
                                  <ArrowDownToLine className="h-4 w-4" />
                                )}
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
  );
};

export default TaskDetailModal;
