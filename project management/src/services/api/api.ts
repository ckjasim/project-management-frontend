import axios from "axios";
import { AUTH_BASE_URL, TASK_BASE_URL } from "@/lib/config";
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
export const patchTaskStatusApi = async (taskId:any,status:any) => {
  try {
    console.log('sssssssssssssssssssssssssssssssss')
    const response = await axios.patch(`${TASK_BASE_URL}/task/updateStatus`,{taskId,status},{
      withCredentials: true,
    });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error adding tasks:", error);
    throw error;
  }
};
export const patchTaskApi = async (id:any,data:any) => {
  try {
    console.log('111111111111111111111')
    const response = await axios.patch(`${TASK_BASE_URL}/task/updateTask`,{id,data},{
      withCredentials: true,
    });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error updating tasks:", error);
    throw error;
  }
};
export const deleteTaskApi = async (id:any) => {
  try {
    console.log('222222222222222')
    const response = await axios.patch(`${TASK_BASE_URL}/task/deleteTask`,{id},{
      withCredentials: true,
    });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error deleting tasks:", error);
    throw error;
  }
};
export const logoutApi = async () => {
  try {
    console.log('444444444444444444')
    const response = await axios.post(`${AUTH_BASE_URL}/auth/logout`,{
      withCredentials: true,
    });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error deleting tasks:", error);
    throw error;
  }
};
