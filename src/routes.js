import React from 'react';

const BoardMainPage = React.lazy(() => import('./views/pages/board/BoardManagementPage'));
const UserManagement = React.lazy(() => import('./views/pages/user/UserManagementPage'));
const AdminManagementPage = React.lazy(() => import('./views/pages/admin/AdminManagementPage'));
const RoleManagementPage = React.lazy(() => import('./views/pages/role/RoleManagementPage'));
const MenuManagement = React.lazy(() => import('./views/pages/menu/MenuManagementPage'));
const DocumentCollectionManagementPage = React.lazy(() =>
  import('./views/pages/document-collection/DocumentCollectionManagementPage')
);

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/menus/management', exact: true, name: '메뉴 관리', element: MenuManagement },
  { path: '/boards/management', exact: true, name: '게시판', element: BoardMainPage },
  { path: '/admin-users/management', exact: true, name: '관리자 관리', element: AdminManagementPage },
  { path: '/roles/management', exact: true, name: '권한 관리', element: RoleManagementPage },
  { path: '/user-accounts/management', exact: true, name: '사용자 관리', element: UserManagement },
  {
    path: '/document-collections/management',
    exact: true,
    name: '문서 집합 관리',
    element: DocumentCollectionManagementPage,
  },
];

export default routes;
