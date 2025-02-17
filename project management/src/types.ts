import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { UniqueIdentifier } from "@dnd-kit/core";

// export interface TaskType {
//   id: string;
//   title: string;
//   description: string;
//   assignedTo: string;
//   priority: string;
//   dueDate: string;
//   status: string;
// }
export type TaskType = {
  assignedTo: string;
  priority: string;
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: string;
  attachments: Array<{
    name: string;
    size: string;
    url: string;
  }>;
  members: string[];
};



export interface TeamMember {
  id: string;
  name: string;
}

export interface Team {
  id: string;
  name: string;
}

export interface PriorityLevel {
  value: string;
  label: string;
  color: string;
}
export interface Message {
  _id?: any;
  id?: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: string | undefined;
  roomId?: string;
  recipientId?: string;
  isImage?:boolean
  isRead?:boolean
}
export type DNDType = {
  id: UniqueIdentifier;
  title: string;
  items: TaskItem[];
};

export type TaskItem = {
  id: UniqueIdentifier;
  title: string;
  description: string;
  assignedTo: string;
  priority: string;
  dueDate: string;
};
export type ChatAreaProps = {
  serverRef:MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>

};
export type UserSideBarProps = {
  serverRef:MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>
};
// export interface Team {
//   name: string;
//   lastMessage: string;
//   time: string;
//   isTyping?: boolean;
//   unreadCount?: number;
// }


export type ContainerType = {
  id: string;
  title: string;
  items: TaskType[];
};

export interface ITeam {
  id: string;
  name: string;
}

export interface IFile {
  name: string;
  file: string | ArrayBuffer | null;
}
// export interface Attachment {
//   name: string;
//   type: string;
//   size: string;
//   timestamp: string;
// }

export interface Employee {
  _id: string;
  name: string;
  email?: string;
  jobRole?: string;
  mobile?: string;
  profileImage?: { url: string };
}

export interface Team {
  id: string;
  name: string;
}

export interface Project {
  _id: string;
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  teamId: string;
  status: 'completed' | 'overdue' | 'active';
  teams?: Team[];
  participants?: number;
}

export interface ProjectFormValues {
  title?: string;
  description?: string;
  dueDate?: string;
  teams?: any;
  priority?: string;
}

export interface TeamFormValues {
  name: string;
  employees: string[];
}

export interface Attachment {
  name: string;
  size: string;
  url: string;
}

export interface Comment {
  createdAt: string | number | Date;
  _id: string;
  author: any;
  content: string;
  timestamp?: string;
}

export interface TaskDetailModalProps {
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
    comments?: Comment[];
  } 
  selectedTeam:any;
  onAddComment?: (comment: string) => void;
}