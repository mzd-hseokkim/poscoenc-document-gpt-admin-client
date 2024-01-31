import { useSetRecoilState } from 'recoil';
import { toastState } from '../states/toastState';

const useToast = () => {
  const setToasts = useSetRecoilState(toastState);

  const addToast = (toast) => {
    setToasts((oldToasts) => [...oldToasts, { ...toast, id: Date.now() }]);
  };

  return addToast;
};

export default useToast;
