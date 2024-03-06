import React from 'react';

import { cilBell, cilUserFollow } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CBadge,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress,
} from '@coreui/react-pro';

const AppHeaderDropdownNotif = () => {
  const itemsCount = 5;
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false}>
        <CIcon icon={cilBell} size="lg" className="my-1 mx-2" />
        <CBadge shape="rounded-pill" color="danger-gradient" className="position-absolute top-0 end-0">
          {itemsCount}
        </CBadge>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-light dark:bg-white dark:bg-opacity-10">
          <strong>You have {itemsCount} notifications</strong>
        </CDropdownHeader>
        <CDropdownItem>
          <CIcon icon={cilUserFollow} className="me-2 text-success" /> New user registered
        </CDropdownItem>
        <CDropdownHeader className="bg-light dark:bg-white dark:bg-opacity-10">
          <strong>Server</strong>
        </CDropdownHeader>
        <CDropdownItem className="d-block">
          <div className="text-uppercase mb-1">
            <small>
              <b>CPU Usage</b>
            </small>
          </div>
          <CProgress thin color="info-gradient" value={25} />
          <small className="text-medium-emphasis">348 Processes. 1/4 Cores.</small>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdownNotif;
