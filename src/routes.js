import React from 'react';

const DashBoard = React.lazy(() => import('views/pages/dashboard/DashboardPage'));
const BoardManagement = React.lazy(() => import('views/pages/board/BoardManagementPage'));
const UserManagement = React.lazy(() => import('views/pages/user/UserManagementPage'));
const AdminManagement = React.lazy(() => import('views/pages/admin/AdminManagementPage'));
const RoleManagement = React.lazy(() => import('views/pages/role/RoleManagementPage'));
const MenuManagement = React.lazy(() => import('views/pages/menu/MenuManagementPage'));
const DocumentCollectionManagement = React.lazy(() =>
  import('views/pages/document-collection/DocumentCollectionManagementPage')
);
const ChatHistoryManagementPage = React.lazy(() =>
  import('views/pages/document-collection/chat-history/DocumentChatHistoryManagementPage')
);
const StandardContractDocumentPage = React.lazy(() =>
  import('views/pages/document-collection/standard-contract/StandardContractDocumentManagementPage')
);
const StatisticsUserManagement = React.lazy(() => import('views/pages/statistics/StatisticsUserManagementPage'));
const StatisticsDocumentCollectionManagement = React.lazy(() =>
  import('views/pages/statistics/StatisticsDocumentCollectionManagementPage')
);
const PredefinedPromptManagement = React.lazy(() =>
  import('views/pages/predefined-prompt/PredefinedPromptManagementPage')
);

const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/dashboard', exact: true, name: '대시 보드', element: DashBoard },
  { path: '/menus/management', exact: true, name: '메뉴 관리', element: MenuManagement },
  { path: '/boards/management', exact: true, name: '게시판', element: BoardManagement },
  { path: '/admin-users/management', exact: true, name: '관리자 관리', element: AdminManagement },
  { path: '/roles/management', exact: true, name: '권한 관리', element: RoleManagement },
  { path: '/user-accounts/management', exact: true, name: '사용자 관리', element: UserManagement },
  {
    path: '/document-collections/management',
    exact: true,
    name: '문서 집합 관리',
    element: DocumentCollectionManagement,
  },
  {
    path: '/document-collections-chat-history/management',
    exact: true,
    name: '채팅 이력 관리',
    element: ChatHistoryManagementPage,
  },
  {
    path: '/standard-contract-documents/management',
    exact: true,
    name: '표준 계약서 관리',
    element: StandardContractDocumentPage,
  },
  { path: '/statistics/user/management', exact: true, name: '월별 토큰 사용량 U', element: StatisticsUserManagement },
  {
    path: '/statistics/document-collection/management',
    exact: true,
    name: '월별 토큰 사용량 DC',
    element: StatisticsDocumentCollectionManagement,
  },
  {
    path: '/predefined-prompts/management',
    exact: true,
    name: '프롬프트 관리',
    element: PredefinedPromptManagement,
  },
];

export default routes;
