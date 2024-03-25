import React from 'react';

import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react-pro';
import SideBarFullLogo from 'assets/images/pocEnglishFullLogo.png';
import SideBarLogo from 'assets/images/poscoenclogo.jpg';
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
      position="fixed"
      unfoldable={unfoldable}
      visible={sidebarShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', sidebarShow: visible });
      }}
    >
      <CSidebarBrand className="d-none d-md-flex" to="/">
        <img
          className="sidebar-brand-full "
          src={SideBarFullLogo}
          alt="POSCO E&C Full Logo"
          style={{ width: '256px', height: '64px' }}
        />
        <img
          className="sidebar-brand-narrow"
          src={SideBarLogo}
          alt="POSOC E&C Logo"
          style={{ width: '64px', height: '64px' }}
        />
      </CSidebarBrand>
      <CSidebarNav>
        {/*<SimpleBar>*/}
        <AppSidebarNav items={menuItems} refetchMenuList={refetchMenuList} />
        {/*</SimpleBar>*/}
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
