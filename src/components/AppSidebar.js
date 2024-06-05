import React from 'react';

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react-pro';
import useSidebarItems from 'hooks/useSidebarItems';
import { useDispatch, useSelector } from 'react-redux';

import { AppSidebarNav } from './AppSidebarNav';

import 'simplebar/dist/simplebar.min.css';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);
  const { menuItems, refetchMenuList } = useSidebarItems();

  return (
    <CSidebar
      size="lg"
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img className="sidebar-brand-full " src="/images/logos/marle_cms_w.png" alt="Marl-E CMS Logo" />
        <img
          className="sidebar-brand-narrow"
          src="/images/logos/marle-logo.png"
          alt="Marl-E CMS Logo"
          style={{ width: '32px', height: '32px' }}
        />
      </CSidebarBrand>
      <CSidebarNav>
        <AppSidebarNav items={menuItems} refetchMenuList={refetchMenuList} />
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
