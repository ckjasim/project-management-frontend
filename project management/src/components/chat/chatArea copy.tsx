import React, { useEffect, useRef, useState } from 'react';
import { FiMoreHorizontal, FiSend } from 'react-icons/fi';
import { BsPersonCircle } from 'react-icons/bs';
import { RiAttachment2 } from 'react-icons/ri';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import socket from '@/services/socket/socket';

// Define message types
interface Message {
  id: string;
  sender: string;
  content: string;
  timestamp: string;
  type: 'group' | 'private';
  recipient?: string;
}

const ChatArea: React.FC = () => {
 

  const messageEndRef = useRef<HTMLDivElement>(null);
  const [username, setUsername] = useState('');
  const [currentRoom, setCurrentRoom] = useState('general');
  const [messages, setMessages] = useState<Message[]>([]); // Declare messages first
  const [newMessage, setNewMessage] = useState('');
  const [chatMode, setChatMode] = useState<'group' | 'private'>('group');
  const [selectedRecipient, setSelectedRecipient] = useState('');
  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);

  useEffect(() => {
    if (!username) {
      const generatedUsername = `User_${Math.random().toString(36).substr(2, 9)}`;
      setUsername(generatedUsername);
    }

    // Register user
    socket.emit('register', username);

    // Group Messages
    socket.on('group message', (message: Message) => {
      setMessages((prev) => [...prev, { ...message, type: 'group' }]);
    });

    // Private Messages
    socket.on('private message', (message: Message) => {
      setMessages((prev) => [...prev, { ...message, type: 'private' }]);
    });

    // Online Users
    socket.on('online users', (users: string[]) => {
      setOnlineUsers(users.filter((user) => user !== username));
    });

    return () => {
      socket.off('group message');
      socket.off('private message');
      socket.off('online users');
    };
  }, [username]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Join or switch room
  const handleJoinRoom = (roomName: string) => {
    socket.emit('join room', roomName);
    setCurrentRoom(roomName);
  };

  // Send message handler
  const handleSendMessage = () => {
    if (newMessage.trim() === '') return;

    const messagePayload: Message = {
      id: `msg_${Date.now()}`,
      sender: username,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      type: chatMode
    };

    if (chatMode === 'group') {
      socket.emit('group message', { ...messagePayload, room: currentRoom });
    } else if (chatMode === 'private' && selectedRecipient) {
      socket.emit('private message', { 
        ...messagePayload, 
        recipient: selectedRecipient 
      });
    }

    setMessages(prev => [...prev, messagePayload]);
    setNewMessage('');
  };

  return (
    <div className="flex h-screen w-full max-w-4xl bg-gray-100">
      <div className="flex-1 p-8">
        <Card className="h-full flex flex-col rounded-3xl shadow-lg">
          <CardHeader className="bg-emerald-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="mr-4">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>{username.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className='text-white'>
                    {chatMode === 'group' ? currentRoom : `Chat with ${selectedRecipient}`}
                  </CardTitle>
                  <p className="text-sm text-gray-300">
                    {chatMode === 'group' 
                      ? `${onlineUsers.length} online` 
                      : 'Private Chat'}
                  </p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Select 
                  value={chatMode} 
                  onValueChange={(value: 'group' | 'private') => setChatMode(value)}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Chat Mode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="group">Group Chat</SelectItem>
                    <SelectItem value="private">Private Chat</SelectItem>
                  </SelectContent>
                </Select>

                {chatMode === 'private' && (
                  <Select 
                    value={selectedRecipient}
                    onValueChange={setSelectedRecipient}
                  >
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="Select Recipient" />
                    </SelectTrigger>
                    <SelectContent>
                      {onlineUsers.map(user => (
                        <SelectItem key={user} value={user}>{user}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages
              .filter(msg => 
                (msg.type === 'group' && chatMode === 'group') || 
                (msg.type === 'private' && 
                 chatMode === 'private' && 
                 (msg.sender === selectedRecipient || msg.recipient === selectedRecipient))
              )
              .map((msg) => (
                <div
                  key={msg.id}
                  className={`flex items-start ${
                    msg.sender === username ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div
                    className={`bg-gray-100 p-4 rounded-2xl max-w-[70%] ${
                      msg.sender === username
                        ? 'bg-emerald-400 rounded-br-none'
                        : 'rounded-bl-none'
                    }`}
                  >
                    <p className="text-sm font-medium mb-1">{msg.sender}</p>
                    <p className="text-sm">{msg.content}</p>
                    <span className="text-xs text-gray-500">{msg.timestamp}</span>
                  </div>
                </div>
              ))}
            <div ref={messageEndRef} />
          </CardContent>

          <CardFooter className="bg-gray-100 p-4 rounded-b-3xl">
            <div className="flex items-center border rounded-full px-4 py-2">
              <Input
                type="text"
                placeholder={
                  chatMode === 'group' 
                    ? `Message ${currentRoom}` 
                    : `Message ${selectedRecipient}`
                }
                className="flex-1 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              />
              <div className="flex space-x-3 ml-4">
                <Button onClick={handleSendMessage} className="rounded-full">
                  <FiSend className="text-xl text-blue-500" />
                </Button>
              </div>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatArea;