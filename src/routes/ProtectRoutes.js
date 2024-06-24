import { useEffect, useState } from 'react';

import { useToast } from 'context/ToastContext';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import MenuService from 'services/menu/MenuService';
import { uriUtil } from 'utils/common/uriUtil';

export const ProtectRoutes = () => {
  const [hasError, setHasError] = useState(false);
  const token = localStorage.getItem('token');
  const location = useLocation();
  const navigate = useNavigate();
  const { addToast } = useToast();
  useEffect(() => {
    const checkAuth = async () => {
      if (unprotectedPaths.includes(location.pathname)) {
        return;
      }

      if (!token) {
        navigate('/sign-in', { replace: true });
        return;
      }

      if (token && location.pathname !== '/' && !hasError) {
        try {
          await MenuService.postUri({ uri: uriUtil(location.pathname) });
          setHasError(false);
        } catch (error) {
          const status = error.response?.status;
          setHasError(true);
          if (status === 403) {
            navigate('/', { replace: true });
            addToast('접근 권한이 없습니다');
          } else if (status === 404) {
            navigate('/404', { replace: true });
          } else {
            // 다른 오류 처리
            console.error('Error:', error);
          }
        }
      }
    };

    void checkAuth();
  }, [token, location.pathname, navigate, addToast, hasError]);

  return <Outlet />;
};

//REMIND 추후 Dashboard 기획 후 수정
export const unprotectedPaths = ['/dashboard'];
