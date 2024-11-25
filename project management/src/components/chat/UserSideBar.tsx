import React, { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import { Card, CardHeader, CardContent, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useSelector } from 'react-redux';
import { useDispatch } from 'react-redux';
import { SetChat } from '@/redux/features/chat/chatSlice';
import { getAllProjectApi, getEmployeesByOrganizationApi, getProjectByProjectCodeApi } from '@/services/api/api';
import { RootState } from '@/redux/store';

interface ITeam {
  groupName: string;
  _id: string;
}

interface IPersonal {
  name: string;
  _id: string;
}

const UserSideBar: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<ITeam[]>([]);
  const [personal, setPersonal] = useState<IPersonal[]>([]);
  const { userInfo } = useSelector((state: RootState) => state.Auth);
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const empResponse = await getEmployeesByOrganizationApi();
        const personals = empResponse?.employees.map((val: { name: string; _id: string }) => ({
          name: val.name,
          _id: val._id,
        })) || [];
        setPersonal(personals);

        if (userInfo?.role === 'project manager') {
          const projResponse = await getAllProjectApi();
          const groups = projResponse?.projects.map((val: { title: string; _id: string }) => ({
            groupName: val.title,
            _id: val._id,
          })) || [];
          setGroups(groups);
        } else if (userInfo?.role === 'employee') {
          const projResponse = await getProjectByProjectCodeApi();
          const groups = projResponse?.project.map((val: { title: string; _id: string }) => ({
            groupName: val.title,
            _id: val._id,
          })) || [];
          setGroups(groups);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userInfo?._id) {
      fetchTeams();
    }
  }, [userInfo]);

  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPersonal = personal.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleItemClick = (id: string, chatMode: 'group' | 'private', name: string) => {
    dispatch(SetChat({ currentRoom: id, chatMode, name }));
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
        {filteredGroups.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Groups</h3>
            {filteredGroups.map((team) => (
              <div
                key={team._id}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleItemClick(team._id, 'group', team.groupName)}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(team.groupName)}`} />
                    <AvatarFallback>{team.groupName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-48">
                    <p className="text-gray-800 font-medium">{team.groupName}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPersonal.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Direct Messages</h3>
            {filteredPersonal.map((person) => (
              <div
                key={person._id}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => handleItemClick(person._id, 'private', person.name)}
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}`} />
                    <AvatarFallback>{person.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-48">
                    <p className="text-gray-800 font-medium">{person.name}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserSideBar;