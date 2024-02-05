import React from 'react';

const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const BoardMain = React.lazy(() => import('./views/pages/board/Board'));
const UserManagement = React.lazy(() => import('./views/pages/user/UserManagement'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/boards', exact: true, name: '게시판', element: BoardMain },
  { path: '/user-accounts/management', exact: true, name: '사용자 관리', element: UserManagement },
];

export default routes;
