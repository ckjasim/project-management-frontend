import axios from 'axios';

console.log('111111111111111111111')
console.log(import.meta.env.VITE_BACKEND_URL,'sssssssssssssss')
console.log('2222222222222222222222222')
const authApi = axios.create({
  baseURL: import.meta.env.VITE_TASK_BASE_URL,
  withCredentials: true,
});

const taskApi = axios.create({
  baseURL: import.meta.env.VITE_TASK_BASE_URL,
  withCredentials: true,
});

authApi.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response &&
      error.response.status === 401 &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;

      try {
        await authApi.post('/api/refresh');

        return authApi(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);

        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { authApi, taskApi };
