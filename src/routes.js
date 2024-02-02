import React from 'react';

const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const UserManagement = React.lazy(() => import('./views/pages/user/UserManagement'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/user-accounts/management', exact: true, name: '사용자 관리', element: UserManagement },
];

export default routes;
