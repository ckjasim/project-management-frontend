import { baseURL } from "../interceptors/api"; 


export const getTeamByEmployeeApi = async () => {
  try {
    const response = await  baseURL.get('/chat/teamListByEmployee');
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getChats = async () => {
  try {
    const response = await  baseURL.get('/chat/getChats',);
    const chats = response.data;
    return chats;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const markMessagesAsReadApi = async (messageIds: string[]) => {
  try {
    const response = await  baseURL.post('/chat/markRead',{ messageIds });
    const chats = response.data;
    return  chats
  } catch (error) {
    console.error('Error marking messages as read:', error);
    throw error;
  }
};