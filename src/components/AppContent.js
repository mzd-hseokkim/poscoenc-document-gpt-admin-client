import React, { Suspense } from 'react';

import { CContainer } from '@coreui/react-pro';
import AdminPageGlobalLoadingCover from 'components/cover/AdminPageGlobalLoadingCover';
import { Route, Routes } from 'react-router-dom';
import routes from 'routes';

const AppContent = () => {
  return (
    <CContainer lg>
      <Suspense fallback={<AdminPageGlobalLoadingCover />}>
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
