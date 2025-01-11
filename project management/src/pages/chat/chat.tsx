import { useEffect, useRef, useState } from 'react';
import UserSideBar from '@/components/chat/UserSideBar';
import ChatArea from '@/components/chat/chatArea';

import { io, Socket } from 'socket.io-client';
import { DefaultEventsMap } from '@socket.io/component-emitter';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';   
import { Message } from '@/types';
import { getChats } from '@/services/api/chatApi';

const MessagesPage = () => {
  const socketRef = useRef<Socket<DefaultEventsMap, DefaultEventsMap>>();
  const [messages, setMessages] = useState<Message[]>([]);

  const {userInfo} = useSelector((state:RootState)=>state.Auth)

useEffect(() => {
  const fetchChats =  async ()=>{
    const prevMessages = await getChats();
    console.log(prevMessages)
    setMessages(prevMessages?.chats)
  }
  fetchChats()
},[])


  const setupListeners = () => {
    if (!socketRef.current) return;

    socketRef.current.on('connect', () => {
      console.log('Socket connected');
    });

    socketRef.current.on('disconnect', () => {
      console.log('Socket disconnected');
    });

    socketRef.current.on('error', (error) => {
      console.error('Socket error:', error);
    });

    socketRef.current.on('new_message', (data) => {
      console.log('new message:', data);
      setMessages((prev)=>[...prev,data])
    });
    socketRef.current.on('new_file', (data) => {
      console.log('new file:', data);
      setMessages((prev)=>[...prev,data])
    });
  };



  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_BASE_URL, {
      transports: ['websocket'],
      query: { userId: userInfo?._id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 10000,
      path:'/chat'
    });

    setupListeners();

    return () => {
      if (socketRef.current) {
        socketRef.current.off('connect'); 
        socketRef.current.off('new_message'); 
        socketRef.current.off('disconnect');
        socketRef.current.disconnect();
      }
    };
  }, []);



  return (
    <div className="flex justify-center h-screen  bg-gradient-to-br from-zinc-50 to-teal-50">
      <UserSideBar serverRef={socketRef} messages={messages} setMessages={setMessages} />
      <ChatArea serverRef={socketRef} messages={messages} setMessages={setMessages}/>
    </div>
  );
};

export default MessagesPage;
