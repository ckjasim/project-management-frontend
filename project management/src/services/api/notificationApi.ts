import { baseURL } from "../interceptors/api"; 


    export const getNotification = async (id:string) => {
      try {
        const response = await  baseURL.post('/notification/getNotification',id);
        const chats = response.data;
        return chats;
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    }

    export const deleteNotificationApi = async (id: string) => {
      try {
        const response = await baseURL.delete('/notification/deleteNotification', {
          data: { id },  
        });
        return response.data;
      } catch (error) {
        console.error("Error deleting notification:", error);
        throw error;
      }
    };
    
