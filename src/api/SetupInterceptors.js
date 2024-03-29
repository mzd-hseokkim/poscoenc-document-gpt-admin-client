import { useEffect } from 'react';

import { useNavigation } from 'context/NavigationContext';
import { useToast } from 'context/ToastContext';

import { setupInterceptors } from './Api';

const SetupInterceptors = () => {
  const { navigate } = useNavigation();
  const { addToast } = useToast();

  useEffect(() => {
    setupInterceptors({ navigate, addToast });
  }, [navigate, addToast]);

  return null;
};

export default SetupInterceptors;
