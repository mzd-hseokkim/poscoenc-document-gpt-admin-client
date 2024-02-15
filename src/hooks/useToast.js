import { useSetRecoilState } from 'recoil';

import { toastState } from '../states/toastState';

const useToast = () => {
  const setToasts = useSetRecoilState(toastState);

  return ({ message, color = 'danger' }) => {
    setToasts({ message, color, key: Date.now() });
  };
};

export default useToast;
