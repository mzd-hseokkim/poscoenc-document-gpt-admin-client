import React from 'react';

const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
];

export default routes;
