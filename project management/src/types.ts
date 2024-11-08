// src/types.ts
export interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
}

export interface Team {
  name: string;
  lastMessage: string;
  time: string;
  isTyping?: boolean;
  unreadCount?: number;
}

export interface Attachment {
  name: string;
  type: string;
  size: string;
  timestamp: string;
}
