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
} from '@/services/api/api';
import { RootState } from '@/redux/store';
import {  UserSideBarProps } from '@/types';

interface ITeam {
  groupName: string;
  _id: string;
  profileImage:any;

}

interface IPersonal {
  url:any;
  name: string;
  _id: string;
}



const UserSideBar: React.FC<UserSideBarProps> = ({ serverRef }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [groups, setGroups] = useState<ITeam[]>([]);
  const [personal, setPersonal] = useState<IPersonal[]>([]);
  const dispatch = useDispatch();

  const { userInfo } = useSelector((state: RootState) => state.Auth);
  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const empResponse = await getEmployeesByOrganizationApi();
        const personals =
          empResponse?.data?.all
            ?.filter(
              (val: { _id: string | undefined }) => val._id !== userInfo?._id
            )
            .map((val: {
              profileImage: any;
              url: any; name: any; _id: any ;
}) => ({
              name: val.name,
              _id: val._id,
              url:val?.profileImage?.url
            })) || [];
        setPersonal(personals);

        if (userInfo?.role === 'project manager') {
          const teams = await getTeamsApi();

          setGroups(
            teams?.teams.map((team: { name: any; _id: any }) => ({
              groupName: team.name,
              _id: team._id,
            })) || []
          );
        } else if (userInfo?.role === 'employee') {
          const teams = await getTeamByEmployeeApi();

          setGroups(
            teams?.teams.map((team: { name: any; _id: any }) => ({
              groupName: team.name,
              _id: team._id,
            })) || []
          );
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    if (userInfo?._id) {
      fetchTeams();
    }

    return () => {

    };
  }, [userInfo]);

  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPersonal = personal.filter((person) =>
    person.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  console.log(filteredPersonal,'--------------------------')

  const handleItemClick = (
    id: string,
    chatMode: 'group' | 'private',
    name: string,
    url:any
  ) => {
    dispatch(SetChat({ currentRoom: id, chatMode, name ,url}));

    if (chatMode === 'group') {
      serverRef?.current?.emit('joinRoom',id)
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
        {filteredGroups.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">Groups</h3>
            {filteredGroups.map((team) => (
              <div
                key={team._id}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-1"
                onClick={() =>
                  handleItemClick(team._id, 'group', team.groupName,"")
                }
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                        team.groupName
                      )}`}
                    />
                    <AvatarFallback>{team.groupName.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div className="min-w-48">
                    <p className="text-gray-800 font-medium">
                      {team.groupName}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {filteredPersonal.length > 0 && (
          <div>
            <h3 className="text-sm font-semibold text-gray-500 mb-2">
              Direct Messages
            </h3>
            {filteredPersonal.map((person) => (
              <div
                key={person._id}
                className="bg-white p-4 rounded-2xl shadow-sm hover:shadow-md transition-shadow cursor-pointer mb-1"
                onClick={() =>
                  handleItemClick(person._id, 'private', person.name,person.url)
                }
              >
                <div className="flex items-center space-x-4">
                  <Avatar>
                    <AvatarImage
                      src={person?.url}
                    />
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
