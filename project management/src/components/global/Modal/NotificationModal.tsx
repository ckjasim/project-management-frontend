import { RootState } from '@/redux/store';
import { deleteNotificationApi, getNotification } from '@/services/api/api';
import { X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';


export const NotificationModal= ({ onClose }) => {
  const { userInfo } = useSelector((state: RootState) => state.Auth);

  const [notifications, setNotifications] = useState<any>([]);
  useEffect(() => {
    const fetchNotification = async () => {
      const res = await getNotification(userInfo?._id);
      setNotifications(res?.notifications);
      console.log(res, 'resssssssssssooooooooooooo');
    };
    fetchNotification();
  });

  const deleteNoti=async (id:string)=>{
    await deleteNotificationApi(id)
  }
  return (
    <div className="absolute top-14 right-12 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-[100]">
      <div className="flex justify-between items-center p-4 border-b">
        <h2 className="text-lg font-semibold">Notifications</h2>
        <button
          onClick={onClose}
          className="p-2 hover:bg-gray-100 rounded-full"
        >
          <X size={20} />
        </button>
      </div>

      <div className="max-h-[400px] overflow-y-auto">
        {notifications.map((item:any) => (
          <div
            key={item._id}
            className="p-4 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer flex justify-between"
          >
            <div >
            {item.type === 'employee_created' ? (
              <>
                <p className="font-medium">{item.type}</p>
                <p className="text-sm text-gray-600">{item.data.name}</p>
              </>
            ) : (
              <>
                <p className="font-medium">{item.data.senderName}</p>
                <p className="text-sm text-gray-600">{item.data.content}</p>
              </>
            )}
            <span className="text-xs text-gray-500 mt-1">
              {new Date(item.createdAt).toLocaleString()}
            </span>
            </div>
            <X size={13} className='mr-2' onClick={()=>{deleteNoti(item._id)}}/>
          </div>
        ))}
      </div>
    </div>
  );
};
