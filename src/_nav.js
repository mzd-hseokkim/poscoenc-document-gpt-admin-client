import React from 'react';
import CIcon from '@coreui/icons-react';
import { cilGroup, cilList, cilNotes, cilSpeedometer, cilUser } from '@coreui/icons';
import { CNavGroup, CNavItem, CNavTitle } from '@coreui/react-pro';

const _nav = [
  {
    component: CNavItem,
    name: '대시보드',
    to: '/dashboard',
    icon: <CIcon icon={cilSpeedometer} customClassName="nav-icon" />,
    badge: {
      color: 'info-gradient',
      text: 'NEW',
    },
  },
  {
    component: CNavTitle,
    name: '즐겨찾기',
  },
  {
    component: CNavItem,
    name: '게시판',
    to: '/boards',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavTitle,
    name: '메뉴',
  },
  {
    component: CNavItem,
    name: '게시판',
    to: '/boards',
    icon: <CIcon icon={cilList} customClassName="nav-icon" />,
  },
  {
    component: CNavItem,
    name: '사용자 관리',
    to: '/user-accounts/management',
    icon: <CIcon icon={cilUser} customClassName="nav-icon" />,
  },
  {
    component: CNavGroup,
    name: '관리자 및 권한 관리',
    icon: <CIcon icon={cilGroup} customClassName="nav-icon" />,
    items: [
      {
        component: CNavItem,
        name: '관리자 관리',
        to: '/',
      },
      {
        component: CNavItem,
        name: '권한 관리',
        to: '/',
      },
    ],
  },
  {
    component: CNavItem,
    name: '메뉴 관리',
    to: '/icons',
    icon: <CIcon icon={cilNotes} customClassName="nav-icon" />,
  },
];

export default _nav;
