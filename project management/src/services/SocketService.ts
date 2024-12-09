import io, { Socket } from 'socket.io-client';

export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'private' | 'group';
  roomId?: string;
  recipientId?: string;
}

class SocketService {
  private static instance: SocketService;
  private socket: Socket;

  private constructor() {
    this.socket = io('http://localhost:3003', {
      transports: ['websocket'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
    });

    this.setupListeners();
  }

  public static getInstance(): SocketService {
    if (!this.instance) {
      this.instance = new SocketService();
    }
    return this.instance;
  }

  public connect(data: { userId: string }) {
    this.socket.emit('register', data, (ack: { success: boolean; message?: string }) => {
      if (ack.success) {
        console.log('User registered successfully');
      } else {
        console.error('User registration failed:', ack.message);
      }
    });
  }

  private setupListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });

    this.socket.on('error', (error) => {
      console.error('Socket error:', error);
    });
  }

  public sendMessage(message: Message) {
    this.socket.emit('send_message', message, (ack: { success: boolean; error?: string }) => {
      if (!ack.success) {
        console.error('Failed to send message:', ack.error);
      }
    });
  }

  public onMessage(callback: (message: Message) => void) {
    this.socket.on('new_message', callback);
  }

  public joinRoom(roomId: string) {
    this.socket.emit('join_room', { roomId });
  }

  public leaveRoom(roomId: string) {
    this.socket.emit('leave_room', { roomId });
  }

  public disconnect() {
    this.socket.disconnect();
  }
}

export default SocketService;