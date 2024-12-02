

import io, { Socket } from 'socket.io-client';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type:string| undefined;
  roomId?: string;
  recipientId?: string;
}

// Extend Socket interface
declare module 'socket.io-client' {
  interface Socket {
    userId?: string;
  }
}

class SocketService {
  private static instance: SocketService | null = null;
  private socket: Socket;

  private constructor() {
    this.socket = io(import.meta.env.VITE_SOCKET_URL, {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      transports: ['websocket'],
    });

    this.setupListeners();
  }

  public static getInstance(): SocketService {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected');
      const userId = localStorage.getItem('user');
      console.log(userId,'jjjjjjjjjjjjjjjjjjjj')
      if (userId) {
        this.connect(userId);
      }
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
    });

    // Error handling
    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  public connect(userId: string) {
    if (this.socket.connected) {
      this.socket.emit('register', { userId });
      this.socket.userId = userId;
    } else {
      this.socket.once('connect', () => {
        this.socket.emit('register', { userId });
        this.socket.userId = userId;
      });
    }
  }

  public joinRoom(roomId: string) {
    this.socket.emit('join_room', roomId);
  }

  public leaveRoom(roomId: string) {
    this.socket.emit('leave_room', roomId);
  }

  public sendMessage(message: Message) {
    this.socket.emit('send_message', message);
  }

  public onMessage(callback: (message: Message) => void) {
    this.socket.on('new_message', callback);
  }

  public removeMessageListener() {
    this.socket.off('new_message');
  }

  public disconnect() {
    this.socket.disconnect();
    SocketService.instance = null;
  }

  // Getter for accessing the socket directly if needed
  public getSocket(): Socket {
    return this.socket;
  }
}

export default SocketService;