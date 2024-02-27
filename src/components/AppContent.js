import React, { Suspense } from 'react';

import { CContainer, CSpinner } from '@coreui/react-pro';
import { Route, Routes } from 'react-router-dom';

// routes config
import routes from '../routes';

const spinnerDivStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  position: 'relative',
  transform: 'translateY(-20%)',
};

const spinnerStyle = { width: '4rem', height: '4rem', '--cui-spinner-border-width': '10px' };
const LoadingFallback = () => (
  <div style={spinnerDivStyle}>
    <CSpinner color="primary" variant="border" style={spinnerStyle} />
  </div>
);
const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense fallback={<LoadingFallback />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element && (
                <Route key={idx} path={route.path} exact={route.exact} name={route.name} element={<route.element />} />
              )
            );
          })}
        </Routes>
      </Suspense>
    </CContainer>
  );
};

export default React.memo(AppContent);
