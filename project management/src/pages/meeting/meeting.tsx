import { SetStateAction, useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
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
import { createMeetingApi, getMeetingsApi, updateMeetingApi, deleteMeetingApi } from '@/services/api/meetingApi';
import MeetingSheduleForm from '@/components/global/Forms/meetingSheduleForm';

const MeetingScheduler = () => {
  const { userInfo } = useSelector((state: RootState) => state.Auth);
  const [teams, setTeams] = useState([]);
  const [meetings, setMeetings] = useState([]);
  const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchMeetings = async () => {
      try {
        const res = await getMeetingsApi();
        setMeetings(res.meetings || []);
      } catch (error) {
        console.error('Failed to fetch meetings:', error);
      }
    };
    fetchMeetings();
  }, []);

  const formatDate = (date: string | number | Date) => {
    return new Date(date).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  };

  const isBacklogMeeting = (date: string | number | Date) => {
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

  const joinMeet = (meetLink: any) => {
    navigate(`join${meetLink}`);
  };

  const editMeeting = (meeting: SetStateAction<null>) => {
    setSelectedMeeting(meeting);
    setIsEditMode(true);
    setIsRescheduleModalOpen(true);
  };

  const deleteMeeting = async (meetingId: any) => {
    if (window.confirm('Are you sure you want to delete this meeting?')) {
      try {
        await deleteMeetingApi(meetingId);
        setMeetings(meetings.filter(m => m._id !== meetingId));
      } catch (error) {
        console.error('Failed to delete meeting:', error);
      }
    }
  };

  const handleReschedule = async (newDate: any, newTime: any) => {
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
      await updateMeetingApi(updatedMeeting);
      setMeetings(
        meetings.map((m) => (m._id === selectedMeeting._id ? updatedMeeting : m))
      );
    } catch (error) {
      console.error('Failed to update meeting:', error);
    }

    setIsRescheduleModalOpen(false);
    setSelectedMeeting(null);
    setIsEditMode(false);
  };

  const MeetingCard = ({ meeting, isBacklog }) => (
    <div
      key={meeting._id}
      className="p-4 border border-slate-200 rounded-xl space-y-3 
               hover:border-indigo-200 hover:bg-indigo-50/30 
               transition-all duration-200"
    >
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-lg text-gray-800">{meeting.title}</h3>
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium px-3 py-1 bg-indigo-100 
                       text-indigo-700 rounded-full">
            {meeting.duration}
          </span>
          {userInfo.role === 'project manager' && (
            <div className="flex gap-2">
              <button
                onClick={() => editMeeting(meeting)}
                className="p-1 text-blue-600 hover:text-blue-800 transition-colors"
              >
                <Edit className="w-4 h-4" />
              </button>
              <button
                onClick={() => deleteMeeting(meeting._id)}
                className="p-1 text-red-600 hover:text-red-800 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
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
        {meeting.teams.map((team: { name: any; }) => team.name).join(', ')}
      </div>

      <div className="flex gap-2 mt-3">
        {!isBacklog && (
          <button
            onClick={() => joinMeet(meeting.meetingLink)}
            className="w-full mt-2 bg-indigo-50 text-indigo-600 py-2 rounded-lg
                  hover:bg-indigo-100 transition-colors"
          >
            Join Meeting
          </button>
        )}
        {isBacklog && (
          <button
            onClick={() => editMeeting(meeting)}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-red-500 text-white font-semibold py-2 px-4 rounded-lg 
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
    <div className="mx-auto p-9 px-9">
      <RescheduleModal
        isOpen={isRescheduleModalOpen}
        onClose={() => {
          setIsRescheduleModalOpen(false);
          setIsEditMode(false);
          setSelectedMeeting(null);
        }}
        onReschedule={handleReschedule}
        currentDate={selectedMeeting?.date?.split('T')[0] || ''}
        currentTime={selectedMeeting?.time || ''}
        isEditMode={isEditMode}
      />
      
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Meetings</h1>
        <p className="text-gray-500 text-lg">
          Schedule and manage your team meetings
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {userInfo.role === 'project manager' && (
          <Card className="bg-white shadow-xl shadow-indigo-100/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
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
            <CardTitle className="text-2xl font-bold flex items-center gap-2">
              <CalendarIcon className="w-6 h-6 text-indigo-500" />
              Upcoming Meetings
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {upcomingMeetings
                .sort((a, b) => new Date(a.date) - new Date(b.date))
                .map((meeting) => (
                  <MeetingCard
                    key={meeting._id}
                    meeting={meeting}
                    isBacklog={false}
                  />
                ))}
            </div>
          </CardContent>
        </Card>

        {userInfo.role === 'project manager' && (
          <Card className="bg-white shadow-xl shadow-indigo-100/20">
            <CardHeader className="pb-4">
              <CardTitle className="text-2xl font-bold flex items-center gap-2">
                <CalendarIcon className="w-6 h-6 text-indigo-500" />
                Backlog Meetings
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {backlogMeetings
                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                  .map((meeting) => (
                    <MeetingCard
                      key={meeting._id}
                      meeting={meeting}
                      isBacklog={true}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};

export default MeetingScheduler;