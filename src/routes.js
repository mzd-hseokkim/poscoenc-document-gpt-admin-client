import React from 'react';

const MenuManagement = React.lazy(() => import('./views/pages/menu/MenuManagement'));
const BoardMain = React.lazy(() => import('./views/pages/board/Board'));
const UserManagement = React.lazy(() => import('./views/pages/user/UserManagement'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/menus/management', exact: true, name: '메뉴 관리', element: MenuManagement },
  { path: '/boards', exact: true, name: 'Board', element: BoardMain },
  { path: '/user-accounts/management', exact: true, name: '사용자 관리', element: UserManagement },
  { path: '/user-account', exact: true, name: '사용자 관리', element: UserManagement },
];

export default routes;
