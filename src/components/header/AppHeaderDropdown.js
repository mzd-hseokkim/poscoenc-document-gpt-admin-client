import React from 'react';

import { cilAccountLogout, cilBell, cilUser } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro';
import { useNavigate } from 'react-router-dom';
import { useResetRecoilState } from 'recoil';
import { jwtTokenState } from 'states/jwtTokenState';

const AppHeaderDropdown = () => {
  const resetJwtToken = useResetRecoilState(jwtTokenState);
  const navigate = useNavigate();

  const handleSignOut = () => {
    localStorage.removeItem('token');
    resetJwtToken();
    navigate('/sign-in');
  };

  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar color="primary" textColor="white" size="md">
          <CIcon icon={cilUser} size="lg" />
        </CAvatar>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-light dark:bg-white dark:bg-opacity-10 fw-semibold py-2">
          Account
        </CDropdownHeader>
        <CDropdownItem href="#">
          <CIcon icon={cilBell} className="me-2" />
          Updates
          <CBadge color="info-gradient" className="ms-2">
            42
          </CBadge>
        </CDropdownItem>
        <CDropdownHeader className="bg-light dark:bg-white dark:bg-opacity-10 fw-semibold py-2">
          Settings
        </CDropdownHeader>
        <CDropdownDivider />
        <CDropdownItem onClick={handleSignOut}>
          <CIcon icon={cilAccountLogout} className="me-2" />
          로그아웃
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdown;
