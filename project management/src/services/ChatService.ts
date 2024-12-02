import axios from 'axios';
export interface Message {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: Date;
  type: 'group' | 'private';
  roomId?: string;
  recipientId?: string;
}

class ChatService {
  private API_BASE_URL ='http://localhost:3000/api';

  async saveMessage(message: Message): Promise<Message> {
    try {
      const response = await axios.post(`${this.API_BASE_URL}/messages`, message);
      return response.data;
    } catch (error) {
      console.error('Error saving message:', error);
      throw error;
    }
  }

  async getMessages(roomId: string | undefined , type: string | undefined): Promise<Message[]> {
    try {
      const response = await axios.get(`${this.API_BASE_URL}/messages`, {
        params: { roomId, type }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching messages:', error);
      throw error;
    }
  }
}

export default new ChatService();