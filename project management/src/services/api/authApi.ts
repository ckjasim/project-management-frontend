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

export const checkPremiumApi = async () => {
  try {
    const response = await baseURL.get('/auth/checkPremium');
    const teams = response.data;
    return teams;
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
