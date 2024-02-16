import React from 'react';

const AdminManagementPage = React.lazy(() => import('./views/pages/admin/AdminManagementPage'));
const BoardMainPage = React.lazy(() => import('./views/pages/board/BoardManagementPage'));
const UserManagement = React.lazy(() => import('./views/pages/user/UserManagementPage'));
const MenuManagement = React.lazy(() => import('./views/pages/menu/MenuManagementPage'));

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/menus/management', exact: true, name: '메뉴 관리', element: MenuManagement },
  { path: '/boards/management', exact: true, name: '게시판', element: BoardMainPage },
  { path: '/admin-users/management', exact: true, name: '관리자 관리', element: AdminManagementPage },
  { path: '/user-accounts/management', exact: true, name: '사용자 관리', element: UserManagement },
];

export default routes;
