import React from 'react';

import { cilEnvelopeOpen } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CAvatar,
  CBadge,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react-pro';

const AppHeaderDropdownMssg = () => {
  const itemsCount = 4;
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle className="c-header-nav-link" caret={false}>
        <CIcon icon={cilEnvelopeOpen} size="lg" className="my-1 mx-2" />
        <CBadge shape="rounded-pill" color="info-gradient" className="position-absolute top-0 end-0">
          {itemsCount}
        </CBadge>
      </CDropdownToggle>
      <CDropdownMenu className="pt-0">
        <CDropdownHeader className="bg-light dark:bg-white dark:bg-opacity-10">
          <strong>You have {itemsCount} messages</strong>
        </CDropdownHeader>
        <CDropdownItem href="#">
          <div className="message">
            <div className="pt-3 me-3 float-start">
              <CAvatar color="primary" textColor="white" status="success">
                User
              </CAvatar>
            </div>
            <div>
              <small className="text-medium-emphasis">John Doe</small>
              <small className="text-medium-emphasis float-end mt-1">Just now</small>
            </div>
            <div className="text-truncate font-weight-bold">
              <span className="fa fa-exclamation text-danger"></span> Important message
            </div>
            <div className="small text-medium-emphasis text-truncate">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
            </div>
          </div>
        </CDropdownItem>
        <CDropdownItem href="#" className="text-center border-top">
          <strong>View all messages</strong>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  );
};

export default AppHeaderDropdownMssg;
