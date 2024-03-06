import React, { useState } from 'react';

import { cilCalendar, cilHome, cilList, cilLocationPin, cilSettings, cilSpeech } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import {
  CCloseButton,
  CFormSwitch,
  CListGroup,
  CListGroupItem,
  CNav,
  CNavItem,
  CNavLink,
  CProgress,
  CSidebar,
  CSidebarHeader,
  CTabContent,
  CTabPane,
} from '@coreui/react-pro';
import { useDispatch, useSelector } from 'react-redux';

const AppAside = () => {
  const dispatch = useDispatch();
  const asideShow = useSelector((state) => state.asideShow);

  const [activeKey, setActiveKey] = useState(1);

  return (
    <CSidebar
      colorScheme="light"
      size="lg"
      overlaid
      placement="end"
      visible={asideShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', asideShow: visible });
      }}
    >
      <CSidebarHeader className="bg-transparent p-0">
        <CNav variant="underline">
          <CNavItem>
            <CNavLink
              href="#"
              active={activeKey === 1}
              onClick={(e) => {
                e.preventDefault();
                setActiveKey(1);
              }}
            >
              <CIcon icon={cilList} alt="CoreUI Icons List" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              href="#"
              active={activeKey === 2}
              onClick={(e) => {
                e.preventDefault();
                setActiveKey(2);
              }}
            >
              <CIcon icon={cilSpeech} alt="CoreUI Icons Speech" />
            </CNavLink>
          </CNavItem>
          <CNavItem>
            <CNavLink
              href="#"
              active={activeKey === 3}
              onClick={(e) => {
                e.preventDefault();
                setActiveKey(3);
              }}
            >
              <CIcon icon={cilSettings} alt="CoreUI Icons Settings" />
            </CNavLink>
          </CNavItem>
          <CNavItem className="ms-auto me-2 d-flex align-items-center">
            <CCloseButton onClick={() => dispatch({ type: 'set', asideShow: false })} />
          </CNavItem>
        </CNav>
      </CSidebarHeader>
      <CTabContent>
        <CTabPane visible={activeKey === 1}>
          <CListGroup flush>
            <CListGroupItem className="list-group-item border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">
              Today
            </CListGroupItem>
            <CListGroupItem href="#" className="border-start-4 border-start-warning">
              <div>
                Meeting with <strong>Lucas</strong>
              </div>
              <small className="text-medium-emphasis me-3">
                <CIcon icon={cilCalendar} /> 1 - 3pm
              </small>
              <small className="text-medium-emphasis">
                <CIcon icon={cilLocationPin} /> Palo Alto, CA
              </small>
            </CListGroupItem>
            <CListGroupItem className="border-start-4 border-start-secondary bg-light dark:bg-white dark:bg-opacity-10 dark:text-medium-emphasis text-center fw-bold text-medium-emphasis text-uppercase small">
              Tomorrow
            </CListGroupItem>
            <CListGroupItem accent="danger" href="#" className="border-start-4 border-start-danger">
              <div>
                New UI Project - <strong>deadline</strong>
              </div>
              <small className="text-medium-emphasis me-3">
                <CIcon icon={cilCalendar} /> 10 - 11pm
              </small>
              <small className="text-medium-emphasis">
                <CIcon icon={cilHome} /> creativeLabs HQ
              </small>
            </CListGroupItem>
          </CListGroup>
        </CTabPane>
        <CTabPane className="p-3" visible={activeKey === 2}>
          <div className="message">
            <div>
              <small className="text-medium-emphasis">Lukasz Holeczek</small>
              <small className="text-medium-emphasis float-end mt-1">1:52 PM</small>
            </div>
            <div className="text-truncate fw-semibold">Lorem ipsum dolor sit amet</div>
            <small className="text-medium-emphasis">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt...
            </small>
          </div>
        </CTabPane>
        <CTabPane className="p-3" visible={activeKey === 3}>
          <h6>Settings</h6>
          <div>
            <div className="clearfix mt-4">
              <CFormSwitch size="lg" label="Option 1" id="Option1" defaultChecked />
            </div>
            <div>
              <small className="text-medium-emphasis">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua.
              </small>
            </div>
          </div>
          <hr />
          <h6>System Utilization</h6>
          <div className="text-uppercase mb-1 mt-4">
            <small>
              <b>CPU Usage</b>
            </small>
          </div>
          <CProgress thin color="info-gradient" value={25} />
          <small className="text-medium-emphasis">348 Processes. 1/4 Cores.</small>
        </CTabPane>
      </CTabContent>
    </CSidebar>
  );
};

export default React.memo(AppAside);
