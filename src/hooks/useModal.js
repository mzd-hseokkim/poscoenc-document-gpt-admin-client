import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    setIsOpen(!!id);
  }, [searchParams]);

  //REMIND handle with create mode ... 하아니.. 해결한줄알았드만 폼모드 초기화 안해주면 다시 열때, create 모드로 상세정보 다보임
  const openModal = (id) => {
    setIsOpen(true);
    if (id && !searchParams.get('id')) {
      searchParams.set('id', id);
      setSearchParams(searchParams, { replace: true });
    }
  };
  const closeModal = () => {
    setIsOpen(false);
    if (searchParams.get('id')) {
      setSearchParams((params) => {
        params.delete('id');
        return params;
      });
    }
  };

  return { isOpen, openModal, closeModal };
};
//REMIND useDetailModal?
export default useModal;
