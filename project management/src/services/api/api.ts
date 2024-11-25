import { taskApi, authApi, projectApi } from "../interceptors/api"; 

export const logoutApi = async () => {
  try {
    const response = await authApi.post('/auth/logout');
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const getTasksApi = async () => {
  try {
    const response = await taskApi.get('/task/getTask');
    const tasks = response?.data;
    return tasks;
  } catch (error) {
    console.error("Error fetching tasks:", error);
    throw error;
  }
};

export const postTasksApi = async (data: any) => {
  try {
    const response = await taskApi.post('/task/createTask', { data });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error adding tasks:", error);
    throw error;
  }
};

export const patchTaskStatusApi = async (taskId: any, status: any) => {
  try {
    const response = await taskApi.patch('/task/updateStatus', { taskId, status });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error updating task status:", error);
    throw error;
  }
};

export const patchTaskApi = async (id: any, data: any) => {
  try {
    const response = await taskApi.patch('/task/updateTask', { id, data });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error updating task:", error);
    throw error;
  }
};

export const deleteTaskApi = async (id: any) => {
  try {
    const response = await taskApi.patch('/task/deleteTask', { id });
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error deleting task:", error);
    throw error;
  }
};

export const getAllUsersApi = async () => {
  try {
    console.log('kkkkkwwwwww')
    const response = await authApi.get('/usersList');
    const users = response.data;
    return users;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getAllEmployeesApi = async () => {
  try {
    const response = await authApi.get('/employeesList');
    const employees = response.data;
    return employees;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const userManageApi = async (email:string) => {
  try {
    const response = await authApi.post('/userManage',{email});
    const status = response.data;
    return status;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const employeeManageApi = async (email:string) => {
  try {
    const response = await authApi.post('/employeeManage',{email});
    const status = response.data;
    return status;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getEmployeesByOrganizationApi = async () => {
  try {
    const response = await authApi.get('/employeesByOrg');
    const employees = response.data;
    return employees;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getTeamsApi = async () => {
  try {
    const response = await projectApi.get('/project/teamList');
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const createTeamApi = async (data: any) => {
  try {
    const response = await projectApi.post('/project/createTeam',{data});
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const createProjectApi = async (data: any) => {
  try {
    const response = await projectApi.post('/project',{data});
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getAllProjectApi = async () => {
  try {
    const response = await projectApi.get('/project');
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const editProjectApi = async (id:string | undefined,data: any) => {
  try {
    const response = await projectApi.patch('/project',{id,data});
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const deleteProjectApi = async (id: string) => {
  try {
    const response = await projectApi.patch('/project/delete',{id});
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getProjectByProjectCodeApi = async () => {
  try {
    const response = await projectApi.get('/project/singleProject');
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getTeamMembersByProjectCodeApi = async () => {
  try {
    const response = await projectApi.get('/project/teamMembers');
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}


