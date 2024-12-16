import axios from 'axios';

const baseURL = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  withCredentials: true,
});

const addAuthToken = (config: any) => {
  const userString = window.localStorage.getItem('user');
  const user = userString ? JSON.parse(userString) : null;
  const token = user?.token;
  console.log(user, 'token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
};

const handleTokenRefresh = async () => {
  try {
    const response = await baseURL.post('/auth/refresh');
    console.log(response,'jassssssssssssiiiiiiiiiiiiiiiiiiiii')
    const newToken = response.data;

    const userString = window.localStorage.getItem('user');
    const user = userString ? JSON.parse(userString) : {};
    user.token = newToken;
    window.localStorage.setItem('user', JSON.stringify(user));

    return newToken;
  } catch (error) {
    console.error('Error refreshing token:', error);
    throw error;
  }
};

baseURL.interceptors.request.use(addAuthToken, (error) =>
  Promise.reject(error)
);

baseURL.interceptors.response.use(
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
        const newToken = await handleTokenRefresh();

        originalRequest.headers['Authorization'] = `Bearer ${newToken}`;

        return baseURL(originalRequest);
      } catch (refreshError) {
        console.error('Error refreshing token:', refreshError);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export { baseURL };
