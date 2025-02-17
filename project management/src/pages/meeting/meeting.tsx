import {  useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Calendar as CalendarIcon,
  Clock,
  Users,
  Video,
  RefreshCw,
  Edit,
  Trash2,
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { RescheduleModal } from '@/components/global/Modal/RescheduleModal';
import {
  getMeetingsApi,
  deleteMeetingApi,
} from '@/services/api/meetingApi';
import MeetingSheduleForm from '@/components/global/Forms/meetingSheduleForm';

type Meeting = {
  _id: string;
  title: string;
  date: string;
  time: string;
  duration: string;
  teams: { name: string }[];
  meetingLink: string;
};

type Team = {
  name: string;
};

const MeetingScheduler = () => {
  const { userInfo } = useSelector((state: RootState) => state.Auth);
  const [teams, setTeams] = useState<Team[]>([]);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState<boolean>(false);
  const [selectedMeeting, setSelectedMeeting] = useState<Meeting | null>(null);
  // const [isEditMode, setIsEditMode] = useState<boolean>(false);
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [dltLoading, setDltLoading] = useState<boolean>(false);

  useEffect(() => {
    setLoading(true);
    const fetchMeetings = async () => {
      try {
        const res = await getMeetingsApi();
        setMeetings(res.meetings || []);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchMeetings();
  }, []);

  const formatDate = (date: string | number | Date): string => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isBacklogMeeting = (date: string | number | Date): boolean => {
    const meetingDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return meetingDate < today;
  };

  const upcomingMeetings = meetings.filter(
    (meeting) => !isBacklogMeeting(meeting.date)
  );
  const backlogMeetings = meetings.filter((meeting) =>
    isBacklogMeeting(meeting.date)
  );

  const joinMeet = (meetLink: string): void => {
    navigate(`join${meetLink}`);
  };

  const editMeeting = (meeting: Meeting | null): void => {
    setSelectedMeeting(meeting);
    // setIsEditMode(true);
    setIsRescheduleModalOpen(true);
  };

  const deleteMeeting = async (meetingId: string): Promise<void> => {
    try {
      setDltLoading(true);
      await deleteMeetingApi(meetingId);
      setMeetings(meetings.filter((m) => m._id !== meetingId));
    } catch (error) {
      console.error('Failed to delete meeting:', error);
    } finally {
      setDltLoading(false);
    }
  };

  const handleReschedule = async (newDate: string, newTime: string): Promise<void> => {
    if (!selectedMeeting || !newDate || !newTime) return;

    const updatedMeeting = {
      ...selectedMeeting,
      date: new Date(`${newDate}T${newTime}`).toISOString(),
      time: new Date(`${newDate}T${newTime}`).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    try {
      // await updateMeetingApi(updatedMeeting);
      setMeetings(
        meetings.map((m) => (m._id === selectedMeeting._id ? updatedMeeting : m))
      );
    } catch (error) {
      console.error('Failed to update meeting:', error);
    }

    setIsRescheduleModalOpen(false);
    setSelectedMeeting(null);
    // setIsEditMode(false);
  };

  const MeetingCard = ({
    meeting,
    isBacklog,
  }: {
    meeting: Meeting;
    isBacklog: boolean;
  }) => (
    <div
      key={meeting._id}
      className="p-4 border border-slate-200 rounded-xl space-y-3 
               hover:border-indigo-200 hover:bg-indigo-50/30 
               transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-800">{meeting.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium px-3 py-1 bg-teal-50 
                       text-teal-700 rounded-full">
            {meeting.duration}
          </span>
          {userInfo.role === 'project manager' && (
            <div className="flex gap-2">
              <button
                onClick={() => editMeeting(meeting)}
                className="p-1 text-teal-600 hover:text-teal-800 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              {dltLoading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-3 w-3 border-b-2 border-teal-500" />
                </div>
              ) : (
                <button
                  onClick={() => deleteMeeting(meeting._id)}
                  className="p-1 text-red-500 hover:text-red-600 transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
        {formatDate(meeting.date)}
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <Clock className="w-4 h-4 mr-2 text-gray-400" />
        {meeting.time}
      </div>

      <div className="flex items-center text-sm text-gray-600">
        <Users className="w-4 h-4 mr-2 text-gray-400" />
        {meeting.teams.map((team) => team.name).join(', ')}
      </div>

      <div className="flex gap-2 mt-3">
        {!isBacklog && (
          <button
            onClick={() => joinMeet(meeting.meetingLink)}
            className="w-full mt-2 bg-teal-50 text-teal-600 py-2 rounded-lg
                  hover:bg-indigo-100 transition-colors"
          >
            Join Meeting
          </button>
        )}
        {isBacklog && (
          <button
            onClick={() => editMeeting(meeting)}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-gradient-to-r from-rose-500 to-rose-600 text-white font-semibold py-2 px-4 rounded-lg 
             shadow-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-300 focus:ring-offset-2 transition-all duration-200"
          >
            <RefreshCw className="w-5 h-5" />
            <span>Reschedule</span>
          </button>
        )}
      </div>
    </div>
  );

  return (
    <div className="mx-auto p-9 px-9 bg-gradient-to-br from-zinc-50 to-teal-50">
      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          // setIsEditMode(false);
          setSelectedMeeting(null);
        }}
        onReschedule={handleReschedule}
        currentDate={selectedMeeting?.date?.split('T')[0] || ''}
        currentTime={selectedMeeting?.time || ''}
        // isEditMode={isEditMode}
      />
      
      <div className="mb-8">
        <h1 className="text-gray-700 text-3xl font-semibold m-2">Meetings</h1>
        <p className="text-gray-500 text-lg">
          Schedule and manage your team meetings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {userInfo.role === 'project manager' && (
          <Card className="bg-white shadow-xl shadow-indigo-100/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <Video className="w-6 h-6 text-indigo-500" />
                Schedule Meeting
              </CardTitle>
            </CardHeader>
            <CardContent>
              <MeetingSheduleForm
                meetings={meetings}
                setMeetings={setMeetings}
                setTeams={setTeams}
                teams={teams}
              />
            </CardContent>
          </Card>
        )}

        <Card className="bg-white shadow-xl shadow-indigo-100/20">
          <CardHeader className="pb-4">
            <CardTitle className="text-2xl font-semibold flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-500" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
              </div>
            ) : (
              <div className="space-y-4">
              {upcomingMeetings
                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                .map((meeting) => (
                  <MeetingCard
                    key={meeting._id}
                    meeting={meeting}
                    isBacklog={false}
                  />
                ))}
            </div>
            
            )}
          </CardContent>
        </Card>

        {userInfo.role === 'project manager' && (
          <Card className="bg-white shadow-xl shadow-indigo-100/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-semibold flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-indigo-500" />
                Backlog Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-32">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
                </div>
              ) : (
                <div className="space-y-4">
                  {backlogMeetings
                    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                    .map((meeting) => (
                      <MeetingCard
                        key={meeting._id}
                        meeting={meeting}
                        isBacklog={true}
                      />
                    ))}
                </div>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MeetingScheduler;
