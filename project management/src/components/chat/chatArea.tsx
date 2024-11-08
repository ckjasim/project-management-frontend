import React, { useEffect, useRef, useState } from 'react';
import { FiMoreHorizontal, FiSend } from 'react-icons/fi';
import { BsPersonCircle } from 'react-icons/bs';
import { RiAttachment2 } from 'react-icons/ri';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

const ChatArea: React.FC = () => {
  const [newMessage, setNewMessage] = useState('');
  
  const initialMessages = [
    { id: '1', sender: 'Killan James', content: 'Hi, Are you still Web Designer.', timestamp: '10:12 AM' },
    { id: '2', sender: 'Claudia Maudi', content: 'Here are some designs I took earlier today.', timestamp: '10:30 AM' },
    { id: '3', sender: 'You', content: "That's a nice design idea.", timestamp: '10:30 AM' },
  ];
  const [messages, setMessages] = useState(initialMessages);
  const messageEndRef = useRef<HTMLDivElement>(null);

  const handleSendMessage = () => {
    if (newMessage.trim() !== '') {      const newMsg = { 
        id: String(messages.length + 1), 
        sender: 'You', 
        content: newMessage, 
        timestamp: new Date().toLocaleTimeString() 
      };
      setMessages((prevMessages) => [...prevMessages, newMsg]);
      setNewMessage('');
    }
  };

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex h-screen w-full max-w-3xl bg-gray-100">

      <div className="flex-1 p-8">
        <Card className="h-full flex flex-col rounded-3xl shadow-lg">
          <CardHeader className="bg-emerald-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="mr-4">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>DT</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>Design Team</CardTitle>
                  <p className="text-sm text-gray-300">60 members, 10 online</p>
                </div>
              </div>
              <Button variant="secondary" className="rounded-full">
                Huddle
              </Button>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex items-start ${message.sender === 'You' ? 'justify-end' : 'justify-start'}`}
              >
                {message.sender !== 'You' && (
                  <Avatar>
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={`bg-gray-100 p-4 rounded-2xl max-w-[70%] ${
                    message.sender === 'You' ? 'bg-emerald-600 text-white rounded-br-none' : 'rounded-bl-none'
                  }`}
                >
                  <p className="text-sm font-medium mb-1">{message.sender}</p>
                  <p className="text-sm">{message.content}</p>
                  <span className="text-xs text-gray-500">{message.timestamp}</span>
                </div>
                {message.sender === 'You' && (
                  <Avatar className="ml-4">
                    <AvatarImage src="/avatar.png" />
                    <AvatarFallback>Y</AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
            <div ref={messageEndRef} />
          </CardContent>

          <CardFooter className="bg-gray-100 p-4 rounded-b-3xl">
            <div className="flex items-center border rounded-full px-4 py-2">
              <Input
                type="text"
                placeholder="Add a comment..."
                className="flex-1 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
              />
              <div className="flex space-x-3 ml-4">
                <RiAttachment2 className="text-xl text-gray-500 cursor-pointer" />
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
