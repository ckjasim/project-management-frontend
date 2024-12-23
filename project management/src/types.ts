import { MutableRefObject } from "react";
import { Socket } from "socket.io-client";
import { DefaultEventsMap } from '@socket.io/component-emitter';

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