import React, { useEffect, useRef, useState } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { format, isBefore, subMinutes } from 'date-fns';

import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/use-toast';

import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';

import { ChatAreaProps, Message } from '@/types';
import { Image, SendHorizontal } from 'lucide-react';

const ChatArea: React.FC<ChatAreaProps> = ({
  serverRef,
  messages,
  setMessages,
}) => {
  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const { userInfo } = useSelector((state: RootState) => state.Auth);
  const { currentRoom, chatMode, name ,url} = useSelector(
    (state: RootState) => state.chat
  );

  // Scroll to the bottom when messages change
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (!event.target.files || event.target.files.length === 0 || !currentRoom) return;

    const file = event.target.files[0];
    const maxSize = 5 * 1024 * 1024; // 5MB limit

    if (file.size > maxSize) {
      toast({
        title: "Error",
        description: "File size should not exceed 5MB",
        variant: "destructive"
      });
      return;
    }

    
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Only image files are allowed",
        variant: "destructive"
      });
      return;
    }

    const reader = new FileReader();
    reader.readAsDataURL(file);
    
    reader.onloadend = async () => {
      const base64Image = reader.result as string;
      
      const messagePayload: Message = {
        id: Date.now().toString(),
        senderId: userInfo?._id || '',
        senderName: userInfo?.name || 'Anonymous',
        content: base64Image,
        timestamp: new Date(),
        type: chatMode,
        roomId: chatMode === 'group' ? currentRoom : undefined,
        recipientId: chatMode === 'private' ? currentRoom : undefined,
        isImage: true
      };

      if (chatMode === 'private') {
        setMessages((prev) => [...prev, messagePayload]);
      }

      try {
        serverRef?.current?.emit('file', messagePayload);
      } catch (error) {
        console.error('Failed to send file', error);
        toast({
          title: "Error",
          description: "Failed to send file. Please try again.",
          variant: "destructive"
        });
      }
    };

 
    event.target.value = '';
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !currentRoom) return;

    const messagePayload: Message = {
      id: Date.now().toString(),
      senderId: userInfo?._id || '',
      senderName: userInfo?.name || 'Anonymous',
      content: newMessage,
      timestamp: new Date(),
      type: chatMode,
      roomId: chatMode === 'group' ? currentRoom : undefined,
      recipientId: chatMode === 'private' ? currentRoom : undefined,
    };

    if (chatMode === 'private') {
      setMessages((prev) => [...prev, messagePayload]);
    }
    setNewMessage('');

    try {
      serverRef?.current?.emit('message', messagePayload);
    } catch (error) {
      console.error('Failed to send message', error);
    }
  };

  const renderMessages = () => {
    const filteredMessages = messages.filter(
      (msg) =>
        (msg.type === 'group' &&
          chatMode === 'group' &&
          msg.roomId === currentRoom) ||
        (msg.type === 'private' &&
          chatMode === 'private' &&
          ((msg.senderId === userInfo?._id &&
            msg.recipientId === currentRoom) ||
            (msg.recipientId === userInfo?._id &&
              msg.senderId === currentRoom)))
    );
  
    return filteredMessages.map((msg) => {
      const messageDate = new Date(msg.timestamp);
      const oneMinuteAgo = subMinutes(new Date(), 1);
  
      const displayTime =
        isBefore(messageDate, oneMinuteAgo)
          ? format(messageDate, 'hh:mm a')
          : 'Just now';
         
      return (
        <div
        key={msg.id}
        className={`flex items-end mb-4 ${
          msg.senderId === userInfo?._id ? 'justify-end' : 'justify-start'
        }`}
      >
        <div
          className={`py-2 px-2 rounded-lg max-w-[70%] min-w-[200px] shadow-sm ${
            msg.senderId === userInfo?._id
              ? 'bg-emerald-300 text-gray-800 rounded-br-none'
              : 'bg-gray-100 text-gray-800 rounded-bl-none'
          }`}
        >
          {msg.senderId === userInfo?._id
              ? ''
              :           <p className="text-xs font-normal mb-1">{msg.senderName}</p>
}
          {msg.isImage ? (
            <img 
              src={msg.content} 
              alt="Shared image" 
              className="max-w-full rounded-md object-cover"
              style={{ maxHeight: '200px' }}
            />
          ) : (
            <p className="text-sm break-words">{msg.content}</p>
          )}
          <span className="text-xs opacity-80 mt-1 block text-right">{displayTime}</span>
        </div>
      </div>
      );
    });
  };

  return (
    <div className="flex h-screen w-full max-w-4xl mx-auto bg-gray-100">
      <div className="flex-1 p-8">
        <Card className="h-full flex flex-col rounded-3xl shadow-lg">
          <CardHeader className="bg-emerald-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="mr-4">
                  <AvatarImage src={url} />
                  <AvatarFallback>{currentRoom?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-300">
                      {chatMode === 'group' ? `Online` : 'Private Chat'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-2">
            {renderMessages()}
            <div ref={messageEndRef} />
          </CardContent>

          <CardFooter className="bg-gray-100 p-4 rounded-b-3xl w-full">
            <div className="flex items-center border rounded-full px-4 py-2 w-full">
              <Input
                type="text"
                placeholder={`Message${
                  chatMode === 'group' ? '' : ` ${name || 'Select a recipient'}`
                }`}
                className="flex-1 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={chatMode === 'private' && !currentRoom}
              />
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleFileUpload}
              />
              <Button
                onClick={handleSendMessage}
                className="rounded-full ml-2 bg-slate-100"
                disabled={
                  newMessage.trim() === '' ||
                  (chatMode === 'private' && !currentRoom)
                }
              >
                <SendHorizontal className="text-xl text-blue-500" />
              </Button>
              <Button
                onClick={() => fileInputRef.current?.click()}
                className="rounded-full ml-2 bg-slate-100"
                disabled={chatMode === 'private' && !currentRoom}
              >
                <Image className="text-xl text-blue-500" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatArea;