import { RootState } from '@/redux/store';
import { deleteNotificationApi, getNotification } from '@/services/api/notificationApi';
import { Bell, Trash2, User, CheckCircle2 } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

export const NotificationsPage = () => {
  const { userInfo } = useSelector((state: RootState) => state.Auth);
  const [notifications, setNotifications] = useState<any>([]);

  useEffect(() => {
    const fetchNotification = async () => {
      const res = await getNotification(userInfo?._id);
      // Sort notifications by date, most recent first
      const sortedNotifications = res?.notifications.sort(
        (a: any, b: any) =>
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      );
      setNotifications(sortedNotifications);
    };
    fetchNotification();
  }, []);

  const deleteNoti = async (id: string) => {
    await deleteNotificationApi(id);
    setNotifications(notifications.filter((noti: any) => noti._id !== id));
  };

  const getTimeAgo = (date: string) => {
    const seconds = Math.floor(
      (new Date().getTime() - new Date(date).getTime()) / 1000
    );
    if (seconds < 60) return `${seconds} seconds ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes} minutes ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    const days = Math.floor(hours / 24);
    return `${days} days ago`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-50 to-teal-50">
      <div className="container mx-auto px-4 py-6 max-w-3xl">
        <div className="flex items-center gap-2 mb-6">
          <Bell className="h-6 w-6 text-blue-600" />
          <h1 className="text-2xl font-bold text-gray-900">Notifications</h1>
        </div>

        {notifications.length === 0 ? (
          <div className="bg-white border border-dashed border-blue-300 rounded-lg p-6 text-center">
            <div className="flex justify-center mb-3">
              <CheckCircle2 className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-base font-semibold text-gray-900 mb-1">
              All Caught Up!
            </h3>
            <p className="text-sm text-gray-600">
              You're up to date with all your notifications.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {notifications.map((item: any) => (
              <Card
                key={item._id}
                className="transform transition-all duration-200 hover:shadow-md"
              >
                <CardContent className="p-4">
                  <div className="flex justify-between items-start gap-3">
                    <div className="flex items-start gap-3">
                      <div>
                        {item.type === 'employee_created' ? (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-green-400 to-green-500 flex items-center justify-center">
                            <User className="h-4 w-4 text-white" />
                          </div>
                        ) : (
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-400 to-blue-500 flex items-center justify-center">
                            <Bell className="h-4 w-4 text-white" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        {item.type === 'employee_created' ? (
                          <>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium text-base text-gray-900">
                                New Employee Added
                              </h3>
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-gradient-to-r from-green-300 to-green-400 text-white">
                                {item.type}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {item.data.name}
                            </p>
                          </>
                        ) : (
                          <>
                            <div className="flex items-center gap-2 flex-wrap">
                              <h3 className="font-medium text-base text-gray-900">
                                {item.data.senderName}
                              </h3>
                              <span className="px-2 py-0.5 text-xs font-medium rounded-full bg-blue-400 text-white">
                                Message
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mt-0.5">
                              {item.data.content}
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                    <div className='flex items-center'>
                      <div className="flex items-center gap-1.5  text-xs text-gray-500">
                        <span>{getTimeAgo(item.createdAt)}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-7 w-7 items-center  text-gray-400 hover:text-red-600 hover:bg-red-50"
                        onClick={() => deleteNoti(item._id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
