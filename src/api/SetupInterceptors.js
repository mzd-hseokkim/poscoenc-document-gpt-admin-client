import { useEffect } from 'react';

import { setupInterceptors } from './Api';
import { useNavigation } from '../context/NavigationContext';
import { useToast } from '../context/ToastContext';

const SetupInterceptors = () => {
  const navigate = useNavigation();
  const { addToast } = useToast();

  useEffect(() => {
    setupInterceptors({ navigate, addToast });
  }, [navigate, addToast]);

  return null;
};

export default SetupInterceptors;
