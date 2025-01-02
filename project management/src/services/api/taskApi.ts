import { baseURL } from "../interceptors/api"; 



export const getTasksByTeamApi = async (teamId:string | undefined,projectId:string | undefined) => {
  try {
    
    const response = await  baseURL.post('/task/getTaskByTeam',{teamId,projectId});
    const tasks = response?.data;
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const postTasksApi = async (data: any) => {
  try {
    const response = await  baseURL.post('/task/createTask', { data });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error adding tasks:", error);
    throw error;
  }
};

export const patchTaskStatusApi = async (taskId: any, status: any) => {
  try {
    const response = await  baseURL.patch('/task/updateStatus', { taskId, status });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const patchTaskApi = async (id: any, data: any) => {
  try {
    const response = await  baseURL.patch('/task/updateTask', { id, data });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTaskApi = async (id: any) => {
  try {
    const response = await  baseURL.delete('/task/deleteTask', {data:{ id} });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const getTasksByProjectApi = async (projectId:any) => {
  try {
    const response = await  baseURL.post('/task/taskByProjectId',projectId);
    const teams = response.data;
    return teams;  
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}

 //comments

 export const addCommentApi = async (data:any) => {
  try {
    const response = await baseURL.post('/task/comments',data);
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}