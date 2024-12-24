import { JSXElementConstructor, Key, ReactElement, ReactNode, ReactPortal, useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { ChevronDown, Loader2, Users, X } from 'lucide-react';
import { getTeamsApi } from '@/services/api/api';

export const TeamSelect: React.FC<{
  values: any;
  setFieldValue: any;
  teams:any
  setTeams: React.Dispatch<React.SetStateAction<never[]>>
}>  = ({ values, setFieldValue,teams ,setTeams}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTeams = async () => {
      setIsLoading(true);
      try {
        const res = await getTeamsApi();
        const formattedTeams = res.teams.map((team: { name: any; _id: any; }) => ({
          name: team.name,
          id: team._id,
        }));
        setTeams(formattedTeams);
      } catch (error) {
        console.error('Error fetching teams:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeams();
  }, []);

  const handleTeamChange = (teamId: any) => {
    const updatedTeams = values.teams.includes(teamId)
      ? values.teams.filter((id: any) => id !== teamId)
      : [...values.teams, teamId];
    setFieldValue('teams', updatedTeams);
  };

  return (
    <div>
      <Label className="flex items-center gap-2 text-sm font-medium text-gray-700">
        <Users size={18} className="text-gray-500" />
        Select Teams
      </Label>
      <div className="relative">
        <div
          onClick={() => !isLoading && setIsOpen(!isOpen)}
          className="cursor-pointer px-4 py-3 border rounded-xl bg-white flex justify-between items-center"
        >
          <span>{values.teams.length ? `${values.teams.length} selected` : 'Choose teams'}</span>
          {isLoading ? <Loader2 className="animate-spin" /> : <ChevronDown />}
        </div>
        {isOpen && (
          <div className="absolute w-full bg-white border mt-2 rounded shadow">
            {teams.map((team: { id: Key | null | undefined; name: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | null | undefined; }) => (
              <div
                key={team.id}
                onClick={() => handleTeamChange(team.id)}
                className="p-2 cursor-pointer hover:bg-gray-200"
              >
                <input
                  type="checkbox"
                  checked={values.teams.includes(team.id)}
                  readOnly
                  className="mr-2"
                />
                {team.name}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
