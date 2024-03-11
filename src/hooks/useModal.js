import { useEffect, useState } from 'react';

import { useSearchParams } from 'react-router-dom';

const useModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const id = searchParams.get('id');
    setIsOpen(!!id);
  }, [searchParams]);
  const openModal = (id) => {
    setIsOpen(true);
    if (!searchParams.get('id')) {
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
