import io, { Socket } from 'socket.io-client';

export interface Message {
  id: string;
  sender: string | undefined;
  content: string;
  timestamp: string;
  type: string|undefined;
  room?: string;
  recipient?: string;
}

class SocketService {
  private static instance: SocketService;
  public socket: Socket;

  private constructor() {
    this.socket = io('http://localhost:3003', {
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000,
      autoConnect: false,
      transports: ['websocket'],
    });

    this.setupBaseListeners();
  }

  public static getInstance(): SocketService {
    if (!SocketService.instance) {
      SocketService.instance = new SocketService();
    }
    return SocketService.instance;
  }

  private setupBaseListeners() {
    this.socket.on('connect', () => {
      console.log('Socket connected');
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Disconnected:', reason);
      if (reason === 'io server disconnect') {
        this.socket.connect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
    });
  }

  public connect() {
    if (!this.socket.connected) {
      this.socket.connect();
    }
  }

  public disconnect() {
    this.socket.disconnect();
  }

  public registerUser(username: string | undefined) {
    this.socket.emit('register', username);
  }

  public unregisterUser(username: string) {
    this.socket.emit('unregister', username);
  }

  public joinRoom(room: string) {
    this.socket.emit('join room', room);
  }

  public sendGroupMessage(room: string | undefined, message: Message) {

    this.socket.emit('group message', { room, message });
  }

  public sendPrivateMessage(recipient: string, message: Message) {
    this.socket.emit('private message', { to: recipient, message });
  }
}

export default SocketService;
