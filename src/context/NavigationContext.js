import { createContext, useContext, useEffect, useState } from 'react';

import { useLocation, useNavigate } from 'react-router-dom';

export const NavigationContext = createContext();

export const NavigationProvider = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [activePage, setActivePage] = useState(location.pathname);

  useEffect(() => {
    setActivePage(location.pathname);
  }, [location.pathname]);

  const contextValue = {
    navigate,
    activePage,
    setActivePage,
  };
  return <NavigationContext.Provider value={contextValue}>{children}</NavigationContext.Provider>;
};

export const useNavigation = () => useContext(NavigationContext);
