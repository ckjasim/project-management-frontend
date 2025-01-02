import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';

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
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: string | undefined;
  roomId?: string;
  recipientId?: string;
  isImage?:boolean
}

export type ChatAreaProps = {
  serverRef:MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>

};
export type UserSideBarProps = {
  serverRef:MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>,
  messages: Message[],
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
export interface Attachment {
  name: string;
  type: string;
  size: string;
  timestamp: string;
}

export interface Employee {
  _id: string;
  name: string;
  jobRole: string;
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
  title: string;
  description: string;
  dueDate: string;
  teams?: [];
  priority: string;
}

export interface TeamFormValues {
  name: string;
  employees: string[];
}