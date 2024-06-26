import axios from 'axios';
import { jwtDecode } from 'jwt-decode';

const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;

const api = axios.create({
  baseURL: SERVER_ENDPOINT,
});

export const setupInterceptors = ({ navigate, addToast }) => {
  api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    let newConfig = {
      ...config,
      headers: {
        ...config.headers,
      },
    };

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp >= currentTime) {
        newConfig.headers.Authorization = `Bearer ${token}`;
      } else {
        localStorage.removeItem('token');
        newConfig.headers.Authorization = '';
        addToast({ message: '세션이 만료되었습니다. 다시 로그인 해주세요. log:Api.js' }, false);
        navigate('/sign-in');
      }
    } else {
      newConfig.headers.Authorization = '';
    }
    return newConfig;
  });

  api.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response) {
        const status = error.response.status;
        switch (status) {
          case 500:
            addToast({ message: '서버에서 오류가 발생하였습니다. 관리자에게 문의해 주세요.' });
            break;
          case 409:
            addToast({ message: '이미 존재하는 값입니다. 입력값을 다시 확인해 주세요.' });
            break;
          case 403:
            addToast({ message: '접근 권한이 없습니다.' });
            break;
          default:
            break;
        }
      } else if (error.request) {
        addToast({ message: '서버에서 응답이 없습니다. 잠시 후 다시 시도해 주세요.' }, false);
        console.error(error.request);
      } else {
        addToast({ message: '알 수 없는 오류가 발생하였습니다. 잠시 후 다시 시도해 주세요.' });
      }
      console.log('Api.js Error', error.message);
      throw error;
    }
  );
};

export default api;
