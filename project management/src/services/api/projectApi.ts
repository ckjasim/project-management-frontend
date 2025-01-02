

import { baseURL } from "../interceptors/api"; 

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
export const addTeamMemberApi = async (id:string,data: any) => {
  try {
    const response = await  baseURL.post('/project/project/addTeamMember',{id,data});
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
    const response = await  baseURL.delete('/project/project/delete',{data:{id}});
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