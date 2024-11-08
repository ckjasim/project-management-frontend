import React, { useState } from 'react';
import { Search } from 'lucide-react';
import { Team } from '@/types';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface SidebarProps {
  teams: Team[];
}

const Sidebar: React.FC<SidebarProps> = ({ teams }) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredTeams = teams.filter((team) =>
    team.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Card className="h-full flex flex-col rounded-3xl shadow-lg">
      <CardHeader className=" text-white px-4 pt-6 rounded-t-3xl">
      <CardTitle className=' text-gray-700 text-2xl m-4' >Chats</CardTitle>
      <div className="flex items-center mt-5">
        <Search className="text-gray-400 mr-3" />
        
        <input
          type="text"
          placeholder="Search teams..."
          className="bg-gray-50 text-gray-700 w-full p-2 rounded-md focus:outline-none focus:ring focus:ring-blue-200"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto px-4 pb-6 space-y-4">
        {filteredTeams.map((team, index) => (
          <div
            key={index}
            className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
          >
            <div className="flex  justify-between items-center">
              <div className="flex  items-center space-x-4">
                <Avatar>
                  <AvatarImage src={`https://ui-avatars.com/api/?name=${team.name}`} />
                  <AvatarFallback>{team.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className='min-w-48'>
                  <p className="text-gray-800 font-medium">{team.name}</p>
                  <p className="text-gray-500 text-sm">
                    {team.isTyping ? 'Typing...' : team.lastMessage}
                  </p>
                </div>
              </div>
              <span className="text-gray-400 text-sm">{team.time}</span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};

export default Sidebar;