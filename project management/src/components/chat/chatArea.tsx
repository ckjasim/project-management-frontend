
import React, { useEffect, useRef, useState, useCallback, MutableRefObject } from 'react';
import { FiSend } from 'react-icons/fi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { useToast } from '../hooks/use-toast';
import SocketService from '@/services/SocketService';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import ChatService from '@/services/ChatService';
import { Message } from '@/types';
import { Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';

type ChatAreaProps = {
  serverRef:MutableRefObject<Socket<DefaultEventsMap, DefaultEventsMap> | undefined>,
  messages: Message[],
  setMessages: React.Dispatch<React.SetStateAction<Message[]>>

};

const ChatArea: React.FC<ChatAreaProps> = ({ serverRef,messages,setMessages }) => {
  const { toast } = useToast();
  const messageEndRef = useRef<HTMLDivElement>(null);

  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { userInfo } = useSelector((state: RootState) => state.Auth);
  const { currentRoom, chatMode,name } = useSelector((state: RootState) => state.chat);



  // useEffect(() => {



  //   if (currentRoom) {
  //     socketService.joinRoom(currentRoom);
  //   }

  //   // Listen for incoming messages
  //   socketService.onMessage((message) => {
  //     // Only add message if it's for the current room/chat
  //     if (
  //       (chatMode === 'group' && message.roomId === currentRoom) ||
  //       (chatMode === 'private' && 
  //        (message.senderId === currentRoom || message.recipientId === currentRoom))
  //     ) {
  //       setMessages(prev => [...prev, message]);
        
  //       // Optionally save to database
  //       ChatService.saveMessage(message);
  //     }
  //   });


  //   const fetchPreviousMessages = async () => {
  //     try {
  //       const prevMessages = await ChatService.getMessages(currentRoom, chatMode);
  //       setMessages(prevMessages);
  //     } catch (error) {
  //       console.error('Failed to fetch previous messages');
  //     }
  //   };

  //   if (currentRoom) {
  //     fetchPreviousMessages();
  //   }

  //   return () => {
  //     // Cleanup socket listeners and leave room
  //     if (currentRoom) {
  //       socketService.leaveRoom(currentRoom);
  //     }
  //   };
  // }, [currentRoom, chatMode, userInfo]);

  // Auto-scroll to latest message

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages]);

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
    console.log(messagePayload,'message=--------------')

    setMessages((prev)=>[...prev,messagePayload])
    setNewMessage('');

    try {
      serverRef?.current?.emit('message',messagePayload)
    } catch (error) {
      console.error('Failed to send message', error);

    }
  };



  const renderMessages = () => {
    const filteredMessages = messages.filter(
      msg =>
        (msg.type === 'group' && chatMode === 'group' && msg.roomId === currentRoom) ||
        (msg.type === 'private' &&
          chatMode === 'private' &&
          (msg.senderId === userInfo?._id && msg.recipientId===currentRoom|| msg.senderId === currentRoom))
    );
    console.log(messages,currentRoom)
    return filteredMessages.map(msg => (
      <div
        key={msg.id}
        className={`flex items-start mb-4 ${msg.senderId === userInfo?._id ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`p-4 rounded-2xl max-w-[70%] ${
            msg.senderId === userInfo?._id
              ? 'bg-emerald-300 rounded-br-none'
              : 'bg-gray-100 rounded-bl-none'
          }`}
        >
          <p className="text-sm font-medium mb-1">{msg.senderName}</p>
          <p className="text-sm">{msg.content}</p>
          <span className="text-xs text-gray-500">{'ddddddddddd'}</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex h-screen w-full max-w-4xl mx-auto bg-gray-100">
      <div className="flex-1 p-8">
        <Card className="h-full flex flex-col rounded-3xl shadow-lg">
          <CardHeader className="bg-emerald-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <Avatar className="mr-4">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>{currentRoom?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle>{name}</CardTitle>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-300">
                      {chatMode === 'group' ? ` online` : 'Private Chat'}
                    </p>
                    {/* <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-500' : 'bg-red-500'}`} /> */}
                  </div>
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="flex-1 overflow-y-auto p-6 space-y-2">
            {renderMessages()}
            <div ref={messageEndRef} />
          </CardContent>

          <CardFooter className="bg-gray-100 p-4 rounded-b-3xl">
            <div className="flex items-center border rounded-full px-4 py-2 w-full">
              <Input
                type="text"
                placeholder={`Message${chatMode === 'group' ? '' : ` ${name || 'Select a recipient'}`}`}
                className="flex-1 focus:outline-none"
                value={newMessage}
                onChange={e => setNewMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                disabled={chatMode === 'private' && !currentRoom}
              />
              <Button
                onClick={handleSendMessage}
                className="rounded-full ml-4"
                disabled={newMessage.trim() === '' || (chatMode === 'private' && !currentRoom)}
              >
                <FiSend className="text-xl text-blue-500" />
              </Button>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default ChatArea;
