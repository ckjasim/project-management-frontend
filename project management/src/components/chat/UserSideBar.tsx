import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SetChat } from '@/redux/features/chat/chatSlice';
import {
  getEmployeesByOrganizationApi,
  getTeamByEmployeeApi,
  getTeamsApi,
  markMessagesAsReadApi,
} from '@/services/api/api';
import { RootState } from '@/redux/store';
import { UserSideBarProps } from '@/types';

interface IChat {
  id: string;
  name: string;
  _id: string;
  type: 'group' | 'private';
  url?: string;
  lastMessage?: string;
  timestamp?: string;
  unreadCount?: number;
  isRead?: boolean;
}

const UserSideBar: React.FC<UserSideBarProps> = ({ serverRef, messages }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [chats, setChats] = useState<IChat[]>([]);
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: RootState) => state.Auth);

  useEffect(() => {
    const fetchChats = async () => {
      try {
        const empResponse = await getEmployeesByOrganizationApi();
        const personals =
          empResponse?.data?.all
            ?.filter((val: { _id: string | undefined }) => val._id !== userInfo?._id)
            ?.map((val: { profileImage: any; name: any; _id: any }) => ({
              name: val.name,
              _id: val._id,
              url: val?.profileImage?.url,
              type: 'private',
            })) || [];

        let teams = [];
        if (userInfo?.role === 'project manager') {
          const teamResponse = await getTeamsApi();
          teams = teamResponse?.teams.map((team: { name: any; _id: any }) => ({
            name: team.name,
            _id: team._id,
            type: 'group',
          }));
        } else if (userInfo?.role === 'employee') {
          const teamResponse = await getTeamByEmployeeApi();
          teams = teamResponse?.teams.map((team: { name: any; _id: any }) => ({
            name: team.name,
            _id: team._id,
            type: 'group',
          }));
        }

        const allChats = [...personals, ...teams].map((chat) => {
          const chatMessages = messages.filter(
            (msg) => 
              (msg.roomId === chat._id || 
              msg.senderId === chat._id || 
              msg.recipientId === chat._id) && 
              msg.type === chat.type
          );

          const lastMessage = chatMessages
            .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0];

          const unreadCount = chatMessages.filter(
            (msg) => 
              !msg?.isRead && 
              msg.senderId !== userInfo?._id
          ).length;
          
          return {
            ...chat,
            lastMessage: lastMessage?.content.startsWith('data:image/') ? 'photo' : lastMessage?.content || '',
            timestamp: lastMessage?.timestamp || '',
            unreadCount,
            isRead: unreadCount === 0,
          };
        });

        setChats(allChats);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userInfo?._id) {
      fetchChats();
    }
  }, [userInfo, messages]);

  const filteredChats = chats
    .filter((chat) =>
      chat.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => {
      if (a.unreadCount && !b.unreadCount) return -1;
      if (!a.unreadCount && b.unreadCount) return 1;
      return new Date(b.timestamp || '').getTime() - new Date(a.timestamp || '').getTime();
    });

  const handleItemClick = async(
    id: string,
    chatMode: 'group' | 'private',
    name: string,
    url: any
  ) => {
    dispatch(SetChat({ currentRoom: id, chatMode, name, url }));
    if (chatMode === 'group') {
      serverRef?.current?.emit('joinRoom', id);
    }
     // Find all unread messages for this chat
  const unreadMessages = messages.filter(msg => 
    !msg.isRead && 
    msg.senderId !== userInfo?._id && 
    ((chatMode === 'private' && (msg.senderId === id || msg.recipientId === id)) ||
     (chatMode === 'group' && msg.roomId === id))
  );

  if (unreadMessages.length > 0) {
    try {

      await markMessagesAsReadApi(unreadMessages.map(msg => msg._id));
      
      // Update local messages state
      const updatedMessages = messages.map(msg => 
        unreadMessages.some(unread => unread._id === msg._id)
          ? { ...msg, isRead: true }
          : msg
      );
      
      // // Update your messages state - you'll need to implement this dispatch
      // dispatch(updateMessages(updatedMessages));
    } catch (error) {
      console.error('Error marking messages as read:', error);
    }
  }

  };

  return (
    <Card className="h-full flex flex-col rounded-3xl shadow-lg">
      <CardHeader className="px-4 pt-6 rounded-t-3xl">
        <CardTitle className="text-gray-700 text-2xl m-4">Chats</CardTitle>
        <div className="flex items-center mt-5">
          <Search className="text-gray-400 mr-3" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-gray-50 text-gray-700 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
        {filteredChats.map((chat) => (
          <div
            key={chat._id}
            className={`bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-1 ${
              !chat.isRead ? 'bg-blue-50' : ''
            }`}
            onClick={() => handleItemClick(chat._id, chat.type, chat.name, chat.url)}
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar>
                  <AvatarImage
                    src={
                      chat.type === 'group'
                        ? `https://ui-avatars.com/api/?name=${encodeURIComponent(chat.name)}`
                        : chat.url
                    }
                  />
                  <AvatarFallback>{chat.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {chat?.unreadCount > 0 && (
                  <div className="absolute -top-1 -right-1 bg-blue-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                    {chat.unreadCount}
                  </div>
                )}
              </div>
              <div className="min-w-48">
                <div className="flex justify-between items-start">
                  <p className={`font-medium ${!chat.isRead ? 'text-blue-600' : 'text-gray-800'}`}>
                    {chat.name}
                  </p>
                </div>
                <p className={`text-sm truncate ${!chat.isRead ? 'text-blue-500' : 'text-gray-500'}`}>
                  {chat.lastMessage || 'No messages yet'}
                </p>
                {chat.timestamp && (
  <p className="text-gray-400 text-xs">
    {new Date(chat.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
  </p>
)}

              </div>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default UserSideBar;