import axios from "axios";
import { TASK_BASE_URL } from "@/lib/config";
console.log(TASK_BASE_URL)

export const getTasksApi = async () => {
  try {
    const response = await axios.get(`${TASK_BASE_URL}/task/getTask`, {
      withCredentials: true
    });
    
    const tasks = response?.data;
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;  
  }
};
export const postTasksApi = async (data:any) => {
  try {
    const response = await axios.post(`${TASK_BASE_URL}/task/createTask`,{data},{
      withCredentials: true,
    });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error adding tasks:", error);
    throw error;
  }
};
