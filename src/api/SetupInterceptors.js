import { useEffect } from 'react';

import { setupInterceptors } from './Api';
import { useNavigation } from '../context/NavigationContext';

const SetupInterceptors = () => {
  const navigate = useNavigation();

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return null;
};

export default SetupInterceptors;
