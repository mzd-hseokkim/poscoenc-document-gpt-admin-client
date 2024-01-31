import React from 'react';

const CoreUIIcons = React.lazy(() => import('./views/icons/coreui-icons/CoreUIIcons'));
const BoardMain = React.lazy(() => import('./views/pages/board/Board'));
const routes = [
  { path: '/', exact: true, name: 'Home' },
  { path: '/icons', exact: true, name: 'Icons', element: CoreUIIcons },
  { path: '/board-list', exact: true, name: 'Board', element: BoardMain },
];

export default routes;
