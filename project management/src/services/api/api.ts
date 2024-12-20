import { baseURL } from "../interceptors/api"; 

export const adminLoginApi = async (data:any) => {
  try {

    const response = await baseURL.post('/auth/adminLogin',data);
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
export const employeeLoginApi = async (data:any) => {
  try {

    const response = await baseURL.post('/auth/employeeLogin',data);
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
export const employeeSignupApi = async (data:any) => {
  try {

    const response = await baseURL.post('/auth/employeeRegister',data);
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
export const userSignupApi = async (data:any) => {
  try {

    const response = await baseURL.post('/auth/userRegister',data);

    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
export const userLoginApi = async (data:any) => {
  try {

    const response = await baseURL.post('/auth/userLogin',data);

    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
export const otpApi = async (data:any) => {
  try {

    const response = await baseURL.post('/auth/otp',data);
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
export const resendOtpApi = async () => {
  try {
    const response = await baseURL.post('/auth/resendOtp');
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};
export const logoutApi = async () => {
  try {

    const response = await baseURL.post('/auth/logout');
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
};

export const addEmployeeInvitationApi = async (data:any) => {
  try {
    const response = await  baseURL.post('/auth/employeeInvitation',data);
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error invitation out:", error);
    throw error;
  }
};
export const verifyInvitationApi = async (token:string) => {
  try {
    const response = await  baseURL.post('/auth/verifyInvitation',token);
    const tasks = response.data;
    return tasks;
  } catch (error) {
    console.error("Error invitation out:", error);
    throw error;
  }
};

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
    const response = await  baseURL.patch('/task/deleteTask', { id });
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
    const response = await  baseURL.get('/auth/usersList');
    const users = response.data;
    return users;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getAllEmployeesApi = async () => {
  try {
    const response = await  baseURL.get('/auth/employeesList');
    const employees = response.data;
    return employees;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const userManageApi = async (email:string) => {
  try {
    const response = await  baseURL.post('/auth/userManage',{email});
    const status = response.data;
    return status;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const employeeManageApi = async (email:string) => {
  try {
    const response = await  baseURL.post('/auth/employeeManage',{email});
    const status = response.data;
    return status;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getEmployeesByOrganizationApi = async () => {
  try {
    const response = await  baseURL.get('/auth/employeesByOrg');
    console.log(response,'gdjksahdflsaghfsadhfio;saehfliusadhflisadgfilsaghdilwaugilausfliusaisuf')
    const employees = response
    return employees;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getTeamsApi = async () => {
  try {
    const response = await baseURL.get('/project/project/teamList');
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getTeamsByProject = async (projectId:string |undefined) => {
  try {
    const response = await  baseURL.post('/project/project/teamsByProject',projectId);
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const createTeamApi = async (data: any) => {
  try {
    const response = await  baseURL.post('/project/project/createTeam',{data});
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const createProjectApi = async (data: any) => {
  try {
    const response = await  baseURL.post('/project/project',{data});
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getAllProjectApi = async () => {
  try {
    const response = await baseURL.get('/project/project');
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const editProjectApi = async (id:string | undefined,data: any) => {
  try {
    const response = await  baseURL.patch('/project/project',{id,data});
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const deleteProjectApi = async (id: string) => {
  try {
    const response = await  baseURL.patch('/project/project/delete',{id});
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
//export to employee projects
export const getProjectByTeamApi = async () => {
  try {
    const response = await baseURL.get('/task/projectByTeam');
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
export const getTeamMembersByTeamIdApi = async (teamId:string) => {
  try {
    const response = await  baseURL.post('/project/project/teamMembers',teamId);
    const teams = response.data;
    return teams;
  } catch (error) {
    console.error("Error logging out:", error);
    throw error;
  }
}
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

//------------chat service------------------


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

    //notification service

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

    export const deleteNotificationApi = async (id:string) => {
      try {
        const response = await  baseURL.post('/notification/deleteNotification',id);
        const chats = response.data;
        return chats;
      } catch (error) {
        console.error("Error logging out:", error);
        throw error;
      }
    }