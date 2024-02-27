import { useEffect } from 'react';

import { Outlet, useLocation, useNavigate } from 'react-router-dom';

import { useToast } from '../context/ToastContext';
import MenuService from '../services/menu/MenuService';
import { uriUtil } from '../utils/common/uriUtil';

export const ProtectRoutes = () => {
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();

  useEffect(() => {
    if (!token) {
      navigate('/sign-in', { replace: true });
      return;
    }
    if (token && location.pathname !== '/') {
      getUriPermission();
    }
  }, [token, location.pathname]);

  const getUriPermission = async () => {
    try {
      await MenuService.postUri({ uri: uriUtil(location.pathname) });
    } catch (error) {
      handleErrors(error);
    }
  };

  const handleErrors = (error) => {
    const status = error.response?.status;
    if (status === 401) {
      navigate('/sign-in', { replace: true });
      localStorage.removeItem('token');
      addToast({ message: '세션이 만료되었습니다. 다시 로그인 해주세요.' });
    } else if (status === 403) {
      navigate('/', { replace: true });
      addToast('접근 권한이 없습니다');
    } else if (status === 404) {
      navigate('/404', { replace: true });
    }
  };

  return <Outlet />;
};
