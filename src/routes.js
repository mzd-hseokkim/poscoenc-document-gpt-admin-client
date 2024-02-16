import React from 'react';

const BoardMainPage = React.lazy(() => import('./views/pages/board/BoardMainPage'));
const BoardPostDetailsPage = React.lazy(() => import('./views/pages/board/BoardPostDetailsPage'));
const UserManagement = React.lazy(() => import('./views/pages/user/UserManagementPage'));
const MenuManagement = React.lazy(() => import('./views/pages/menu/MenuManagementPage'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/menus/management', exact: true, name: '메뉴 관리', element: MenuManagement },
  { path: '/boards', exact: true, name: '게시판', element: BoardMainPage },
  { path: '/boards/details/:id', exact: true, name: '게시판/게시글', element: BoardPostDetailsPage },
  { path: '/user-accounts/management', exact: true, name: '사용자 관리', element: UserManagement },
];

export default routes;
