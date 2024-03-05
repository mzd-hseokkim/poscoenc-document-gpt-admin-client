import React, { Suspense, useEffect } from 'react';

import './scss/style.scss';
import { NavigationProvider } from 'context/NavigationContext';
import { ToastProvider } from 'context/ToastContext';
import { HashRouter, Route, Routes } from 'react-router-dom';
import { useSetRecoilState } from 'recoil';
import { ProtectRoutes } from 'routes/ProtectRoutes';
import { jwtTokenState } from 'states/jwtTokenState';

import SetupInterceptors from './api/SetupInterceptors';

const loading = (
  <div className="pt-3 text-center">
    <div className="sk-spinner sk-spinner-pulse"></div>
  </div>
);

// Containers
const DefaultLayout = React.lazy(() => import('./layout/DefaultLayout'));

// Pages
const SignIn = React.lazy(() => import('./views/pages/signin/SignIn'));
const Register = React.lazy(() => import('./views/pages/register/Register'));
const Page404 = React.lazy(() => import('./views/pages/page404/Page404'));
const Page500 = React.lazy(() => import('./views/pages/page500/Page500'));

// eslint-disable-next-line func-style
function App() {
  const setAccessToken = useSetRecoilState(jwtTokenState);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setAccessToken(token);
    }
    console.log(token);
  });

  return (
    <HashRouter>
      <NavigationProvider>
        <ToastProvider>
          <SetupInterceptors />
          <Suspense fallback={loading}>
            <Routes>
              <Route element={<ProtectRoutes />}>
                <Route exact path="/sign-in" name="Sign-In Page" element={<SignIn />} />
                <Route exact path="/register" name="Register Page" element={<Register />} />
                <Route exact path="/404" name="Page 404" element={<Page404 />} />
                <Route exact path="/500" name="Page 500" element={<Page500 />} />
                <Route path="*" name="Home" element={<DefaultLayout />} />
              </Route>
            </Routes>
          </Suspense>
        </ToastProvider>
      </NavigationProvider>
    </HashRouter>
  );
}

export default App;
