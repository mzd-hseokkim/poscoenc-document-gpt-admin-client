import React, { Component, Suspense } from 'react';

import { HashRouter, Route, Routes } from 'react-router-dom';

import './scss/style.scss';
import SetupInterceptors from './api/SetupInterceptors';
import SimpleToastContainer from './components/toast/SimpleToastContainer';
import { NavigationProvider } from './context/NavigationContext';

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

class App extends Component {
  render() {
    return (
      <HashRouter>
        <NavigationProvider>
          <SetupInterceptors />
          <Suspense fallback={loading}>
            <Routes>
              <Route exact path="/sign-in" name="Sign-In Page" element={<SignIn />} />
              <Route exact path="/register" name="Register Page" element={<Register />} />
              <Route exact path="/404" name="Page 404" element={<Page404 />} />
              <Route exact path="/500" name="Page 500" element={<Page500 />} />
              <Route path="*" name="Home" element={<DefaultLayout />} />
            </Routes>
            <SimpleToastContainer />
          </Suspense>
        </NavigationProvider>
      </HashRouter>
    );
  }
}

export default App;
