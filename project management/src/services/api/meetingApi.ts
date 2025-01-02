import { baseURL } from "../interceptors/api"; 



    //------Meeting---------
    export const createMeetingApi = async (data: any) => {
      try {
        const response = await  baseURL.post('/meeting/meeting',{data});
        const teams = response.data;
        return teams;
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    }
    export const getMeetingsApi = async () => {
      try {
        const response = await baseURL.get('/meeting/meeting');
        const teams = response.data;
        return teams;
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    }
    export const deleteMeetingApi = async (meetingId: string) => {
      try {
        const response = await baseURL.delete('/meeting/meeting',{data:{meetingId}});
        const teams = response.data;
        return teams;
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    }
    export const updateMeetingApi = async () => {
      try {
        const response = await baseURL.get('/meeting/meeting');
        const teams = response.data;
        return teams;
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    }

    //filess

    export const getPremiumApi = async () => {
      try {
        const response = await baseURL.get('/meeting/payment');
        const teams = response.data;
        return teams;
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    }

    export const fetchDrivefilesApi = async () => {
      try {
        const response = await baseURL.get('/meeting/files');
        const teams = response.data;
        return teams;
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    }

// 
   
