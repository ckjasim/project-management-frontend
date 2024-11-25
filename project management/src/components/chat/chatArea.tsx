// import React, { useEffect, useRef, useState } from 'react';
// import { FiMoreHorizontal, FiSend } from 'react-icons/fi';
// import { BsPersonCircle } from 'react-icons/bs';
// import { RiAttachment2 } from 'react-icons/ri';
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
// import { Button } from '@/components/ui/button';
// import {
//   Card,
//   CardHeader,
//   CardTitle,
//   CardContent,
//   CardFooter,
// } from '@/components/ui/card';
// import { Input } from '@/components/ui/input';
// import socket from '@/utils/socket/socket';

// const ChatArea: React.FC = () => {
//   const [newMessage, setNewMessage] = useState('');
  

//   const initialMessages = [
//     // {
//     //   id: '1',
//     //   sender: 'Killan James',
//     //   content: 'Hi, Are you still Web Designer.',
//     //   timestamp: '10:12 AM',
//     // },
//     // {
//     //   id: '2',
//     //   sender: 'Claudia Maudi',
//     //   content: 'Here are some designs I took earlier today.',
//     //   timestamp: '10:30 AM',
//     // },
//     // {
//     //   id: '3',
//     //   sender: 'You',
//     //   content: "That's a nice design idea.",
//     //   timestamp: '10:30 AM',
//     // },
//   ];
//   const [messages, setMessages] = useState(initialMessages);
//   const messageEndRef = useRef<HTMLDivElement>(null);

//   const handleSendMessage = () => {
//     console.log('1111')
//     if (newMessage.trim() !== '') {
//       console.log('2222')
//       const newMsg = {
//         id: String(messages.length + 1),
//         sender: socket.id,
//         content: newMessage,
//         timestamp: new Date().toLocaleTimeString(),
//       };
//       console.log('3333')
      
//       console.log('4444')
//       console.log(socket.id,'jjjjjjjjjjjjjjjj')
//       socket.emit('private message',newMsg)
//       console.log('5555555555555')
//       setNewMessage('');
//     }
//   };



//   useEffect(() => {

//     socket.on('private message', (msg:any) => {
//       setMessages((prevMessages) => [...prevMessages, msg]);
//     });


//     return () => {
//       socket.off('private message');
//     };
//   }, []);

//   useEffect(() => {
//     messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
//   }, [messages]);

//   return (
//     <div className="flex h-screen w-full max-w-3xl bg-gray-100">
//       <div className="flex-1 p-8">
//         <Card className="h-full flex flex-col rounded-3xl shadow-lg">
//           <CardHeader className="bg-emerald-600 text-white p-6 rounded-t-3xl">
//             <div className="flex items-center justify-between">
//               <div className="flex items-center">
//                 <Avatar className="mr-4">
//                   <AvatarImage src="/avatar.png" />
//                   <AvatarFallback>DT</AvatarFallback>
//                 </Avatar>
//                 <div>
//                   <CardTitle className='text-white'>Design Team</CardTitle>
//                   <p className="text-sm text-gray-300">60 members, 10 online</p>
//                 </div>
//               </div>
//               <Button variant="secondary" className="rounded-full">
//                 Huddle
//               </Button>
//             </div>
//           </CardHeader>

//           <CardContent className="flex-1 overflow-y-auto p-6 space-y-6">
//             {messages.map((message) => (
//               <div
//                 key={message.id}
//                 className={`flex items-start ${
//                   message.sender === socket.id ? 'justify-end' : 'justify-start'
//                 }`}
//               >
//                 {message.sender !== socket.id && (
//                   <Avatar>
//                     <AvatarImage src="/avatar.png" />
//                     <AvatarFallback>{message.sender.charAt(0)}</AvatarFallback>
//                   </Avatar>
//                 )}
//                 <div
//                   className={`bg-gray-100 p-4 rounded-2xl max-w-[70%] ${
//                     message.sender === socket.id
//                       ? 'bg-emerald-400  rounded-br-none'
//                       : 'rounded-bl-none'
//                   }`}
//                 >
//                   <p className="text-sm font-medium mb-1">{message.sender}</p>
//                   <p className="text-sm">{message.content}</p>
//                   <span className="text-xs text-gray-500">
//                     {message.timestamp}
//                   </span>
//                 </div>
//                 {message.sender === 'You' && (
//                   <Avatar className="ml-4">
//                     <AvatarImage src="/avatar.png" />
//                     <AvatarFallback>Y</AvatarFallback>
//                   </Avatar>
//                 )}
//               </div>
//             ))}
//             <div ref={messageEndRef} />
//           </CardContent>

//           <CardFooter className="bg-gray-100 p-4 rounded-b-3xl">
//             <div className="flex items-center border rounded-full px-4 py-2">
//               <Input
//                 type="text"
//                 placeholder="Add a comment..."
//                 className="flex-1 focus:outline-none"
//                 value={newMessage}
//                 onChange={(e) => setNewMessage(e.target.value)}
//               />
//               <div className="flex space-x-3 ml-4">
//                 <RiAttachment2 className="text-xl text-gray-500 cursor-pointer" />
//                 <Button onClick={handleSendMessage} className="rounded-full">
//                   <FiSend className="text-xl text-blue-500" />
//                 </Button>
//               </div>
//             </div>
//           </CardFooter>
//         </Card>
//       </div>
//     </div>
//   );
// };

// export default ChatArea;

import React, { useEffect, useRef, useState, useCallback } from 'react';
import { FiSend, FiMessageCircle } from 'react-icons/fi';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '../hooks/use-toast';
import SocketService, { Message } from '@/services/socket/socket';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';



const ChatArea: React.FC = () => {
  const { toast } = useToast();
  

  const messageEndRef = useRef<HTMLDivElement>(null);
  

  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');

  const [onlineUsers, setOnlineUsers] = useState<string[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [socketService] = useState(SocketService.getInstance());

  const { currentRoom,chatMode,name } = useSelector((state: RootState) => state.chat);
  const { userInfo } = useSelector((state: RootState) => state.Auth);

 


  useEffect(() => {

    socketService.connect();

    socketService.registerUser(currentRoom);

    // Return cleanup function
    return () => {
      socketService.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!currentRoom) return;
  
  
    socketService.joinRoom( currentRoom);
  
    return () => {
      
      socketService.socket.emit('leave room', currentRoom);
    };
  }, [currentRoom, socketService]);

  const setupSocketListeners = useCallback(() => {
    const handleGroupMessage = (data: { room: string; message: Message }) => {
      console.log(data, 'shaakkkk');
      setMessages(prev => [...prev, { ...data, type: 'group' }]);
    };
  
    const handlePrivateMessage = (message: Message) => {
      setMessages(prev => [...prev, { ...message, type: 'private' }]);
    };
  
    const handleOnlineUsers = (users: string[]) => {
      const uniqueUsers = Array.from(new Set(users)).filter(user => user !== currentRoom);
      setOnlineUsers(uniqueUsers);
    };
  
    const handleConnect = () => {
      setIsConnected(true);
      toast({
        title: "Connected",
        description: "Successfully connected to the chat server",
        variant: "default",
      });
    };
  
    const handleDisconnect = () => {
      setIsConnected(false);
      toast({
        title: "Disconnected",
        description: "Lost connection to the chat server",
        variant: "destructive",
      });
    };
  
    const handleError = (error: any) => {
      toast({
        title: "Connection Error",
        description: error.message || "An unexpected error occurred",
        variant: "destructive",
      });
    };
  
    // Attach listeners
    socketService.socket.on('connect', handleConnect);
    socketService.socket.on('disconnect', handleDisconnect);
    socketService.socket.on('group message', handleGroupMessage);
    socketService.socket.on('private message', handlePrivateMessage);
    socketService.socket.on('online users', handleOnlineUsers);
    socketService.socket.on('error', handleError);
  
    // Cleanup listeners
    return () => {
      socketService.socket.off('connect', handleConnect);
      socketService.socket.off('disconnect', handleDisconnect);
      socketService.socket.off('group message', handleGroupMessage);
      socketService.socket.off('private message', handlePrivateMessage);
      socketService.socket.off('online users', handleOnlineUsers);
      socketService.socket.off('error', handleError);
    };
  }, [currentRoom, socketService, toast]);
  

 
  
  

  useEffect(() => {
    const cleanup = setupSocketListeners();
    return () => cleanup();
  }, [setupSocketListeners]);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);


  const handleSendMessage = () => {
    if (newMessage.trim() === '' || (chatMode === 'private' && !currentRoom)) return;
  
    const messagePayload: Message = {
      id: `msg_${messages.length + 1}`,
      sender: userInfo?._id,
      content: newMessage,
      timestamp: new Date().toLocaleTimeString(),
      type: chatMode,
      room: chatMode === 'group' ? currentRoom : undefined,
      recipient: chatMode === 'private' ? currentRoom : undefined,
    };
  
    console.log('Sending message:', messagePayload);
  
    try {
      if (chatMode === 'group') {
        socketService.sendGroupMessage(currentRoom, messagePayload);
      } else if (chatMode === 'private' && currentRoom) {
        socketService.sendPrivateMessage(currentRoom, messagePayload);
      }
  
      // setMessages(prev => [...prev, { ...messagePayload }]);
      setNewMessage('');
    } catch (error) {
      toast({
        title: "Message Send Error",
        description: "Failed to send message. Please check your connection.",
        variant: "destructive",
      });
    }
  };
  

  const renderMessages = () => {
    const filteredMessages = messages.filter(
      msg =>
        (msg.type === 'group' && chatMode === 'group' && msg.room === currentRoom) ||
        (msg.type === 'private' &&
          chatMode === 'private' &&
          (msg.sender === userInfo?._id || msg.recipient === currentRoom))
    );

    return filteredMessages.map(msg => (
      <div   
        key={msg.id} 
        className={`flex items-start mb-4 ${msg.sender === userInfo?._id ? 'justify-end' : 'justify-start'}`}
      >
        <div
          className={`p-4 rounded-2xl max-w-[70%] ${
            msg.sender === userInfo?._id
              ? 'bg-emerald-300 rounded-br-none' 
              : 'bg-gray-100 rounded-bl-none'
          }`}
        >
          <p className="text-sm font-medium mb-1">{msg.sender}</p>
          <p className="text-sm">{msg.content}</p>
          <span className="text-xs text-gray-500">{msg.timestamp}</span>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex h-screen w-full max-w-4xl mx-auto bg-gray-100">
      <div className="flex-1 p-8">
        <Card className="h-full flex flex-col rounded-3xl shadow-lg">
          {/* Header */}
          <CardHeader className="bg-emerald-600 text-white p-6 rounded-t-3xl">
            <div className="flex items-center justify-between">
              {/* User Info & Connection Status */}
              <div className="flex items-center">
                <Avatar className="mr-4">
                  <AvatarImage src="/avatar.png" />
                  <AvatarFallback>{currentRoom?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-white">
                    {name}
                  </CardTitle>
                  <div className="flex items-center space-x-2">
                    <p className="text-sm text-gray-300">
                      {chatMode === 'group' 
                        ? `${onlineUsers.length} online` 
                        : 'Private Chat'
                      }
                    </p>
                    <div 
                      className={`w-3 h-3 rounded-full ${
                        isConnected ? 'bg-green-500' : 'bg-red-500'
                      }`}
                    />
                  </div>
                </div>
              </div>

              {/* Chat Mode & Room/Recipient Selector */}
          
            </div>
          </CardHeader>

          {/* Message Display Area */}
          <CardContent className="flex-1 overflow-y-auto p-6 space-y-2">
            {renderMessages()}
            <div ref={messageEndRef} />
          </CardContent>

          {/* Message Input */}
          <CardFooter className="bg-gray-100 p-4 rounded-b-3xl">
            <div className="flex items-center border rounded-full px-4 py-2 w-full">
              <Input
                type="text"
                placeholder={
                  chatMode === 'group' 
                    ? `Message...` 
                    : `Message ${name || 'Select a recipient'}`
                }
                className="flex-1 focus:outline-none"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
                disabled={chatMode === 'private' && !currentRoom}
              />
              <div className="ml-4">
                <Button 
                  onClick={handleSendMessage} 
                  className="rounded-full"
                  disabled={
                    newMessage.trim() === '' || 
                    (chatMode === 'private' && !currentRoom)
                  }
                >
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