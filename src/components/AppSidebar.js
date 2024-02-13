import React from 'react';

import CIcon from '@coreui/icons-react';
import { CSidebar, CSidebarBrand, CSidebarNav, CSidebarToggler } from '@coreui/react-pro';
import { useDispatch, useSelector } from 'react-redux';
import SimpleBar from 'simplebar-react';
import { logoNegative } from 'src/assets/brand/logo-negative';
import { sygnet } from 'src/assets/brand/sygnet';

import { AppSidebarNav } from './AppSidebarNav';
import 'simplebar/dist/simplebar.min.css';
import navigation from '../_nav';

const AppSidebar = () => {
  const dispatch = useDispatch();
  const unfoldable = useSelector((state) => state.sidebarUnfoldable);
  const sidebarShow = useSelector((state) => state.sidebarShow);

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
        <CIcon className="sidebar-brand-full" icon={logoNegative} height={35} />
        <CIcon className="sidebar-brand-narrow" icon={sygnet} height={35} />
      </CSidebarBrand>
      <CSidebarNav>
        <SimpleBar>
          <AppSidebarNav items={navigation} />
        </SimpleBar>
      </CSidebarNav>
      <CSidebarToggler
        className="d-none d-lg-flex"
        onClick={() => dispatch({ type: 'set', sidebarUnfoldable: !unfoldable })}
      />
    </CSidebar>
  );
};

export default React.memo(AppSidebar);
