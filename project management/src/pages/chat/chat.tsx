import { useEffect, useRef, useState } from 'react';
import UserSideBar from '@/components/chat/UserSideBar';
import ChatArea from '@/components/chat/chatArea';
import DetailsSidebar from '@/components/chat/detailesSideBar';

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
    socketRef.current = io('http://localhost:3003', {
      transports: ['websocket'],
      query: { userId: userInfo?._id },
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 10000,
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

  const attachments = [
    { name: 'Very important file.fig', type: 'figma', size: '7.5 MB', timestamp: '3.22.22, 11:15 AM' },
    { name: 'Some file.scratch', type: 'scratch', size: '7.5 MB', timestamp: '3.22.22, 11:15 AM' },
    { name: 'List of something.xd', type: 'xd', size: '7.5 MB', timestamp: '3.22.22, 11:15 AM' },
  ];
    // const teams = [
  //   { name: 'Testing team', lastMessage: 'Typing...', time: '4:30 PM', isTyping: true },
  //   { name: 'Design Team', lastMessage: 'Hello! Everyone', time: '9:36 AM' },
  //   { name: 'Development team', lastMessage: 'Wow really Cool 🔥', time: '1:15 AM' },
  // ];
 

  const members = ['Novita', 'Millie Nose', 'Ikhsan SD', 'Aditya'];
  console.log(messages,'============================-----------')

  return (
    <div className="flex h-screen">
      <UserSideBar serverRef={socketRef} messages={messages} setMessages={setMessages} />
      <ChatArea serverRef={socketRef} messages={messages} setMessages={setMessages}/>
      <DetailsSidebar attachments={attachments} members={members}  />
    </div>
  );
};

export default MessagesPage;
