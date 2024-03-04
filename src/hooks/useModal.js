import { useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    //REMIND 링크로 이동시 modal 창 열기 위한 로직
    const queryParams = new URLSearchParams(location.search);
    const id = queryParams.get('id');
    setIsOpen(!!id);
  }, [location]);
  const openModal = (path = '') => {
    setIsOpen(true);
    if (path) navigate(path, { replace: true });
  };
  const closeModal = () => {
    setIsOpen(false);
    navigate(location.pathname, { replace: true });
  };

  return { isOpen, openModal, closeModal };
};
//REMIND useDetailModal?
export default useModal;
