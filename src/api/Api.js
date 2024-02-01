import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

const api = axios.create({
  baseURL: SERVER_ENDPOINT,
});

export const setupInterceptors = (navigate) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp >= currentTime) {
        config.headers.Authorization = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        config.headers.Authorization = '';
        navigate('/sign-in');
      }
    } else {
      config.headers.Authorization = '';
    }
    return config;
  });
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 500) {
      }
    } else if (error.request) {
      console.error(error.request);
    } else {
      console.log('Error', error.message);
    }
    throw error;
  }
);

export default api;
