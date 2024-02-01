import { useEffect } from 'react';
import { useNavigation } from '../context/NavigationContext';
import { setupInterceptors } from './Api';

const SetupInterceptors = () => {
  const navigate = useNavigation();

  useEffect(() => {
    setupInterceptors(navigate);
  }, [navigate]);

  return null;
};

export default SetupInterceptors;
