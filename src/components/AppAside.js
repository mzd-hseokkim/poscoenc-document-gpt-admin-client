import React, { useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import {
  CAvatar,
  CCloseButton,
  CFormSwitch,
  CNav,
  CNavItem,
  CNavLink,
  CTabContent,
  CTabPane,
  CListGroup,
  CListGroupItem,
  CProgress,
  CSidebar,
  CSidebarHeader,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cibSkype,
  cilCalendar,
  cilHome,
  cilList,
  cilLocationPin,
  cilSettings,
  cilSpeech,
} from '@coreui/icons'

import avatar2 from './../assets/images/avatars/2.jpg'
import avatar3 from './../assets/images/avatars/3.jpg'
import avatar4 from './../assets/images/avatars/4.jpg'
import avatar5 from './../assets/images/avatars/5.jpg'
import avatar6 from './../assets/images/avatars/6.jpg'
import avatar7 from './../assets/images/avatars/7.jpg'
import avatar8 from './../assets/images/avatars/8.jpg'

const AppAside = () => {
  const dispatch = useDispatch()
  const asideShow = useSelector((state) => state.asideShow)

  const [activeKey, setActiveKey] = useState(1)

  return (
    <CSidebar
      colorScheme="light"
      size="lg"
      overlaid
      placement="end"
      visible={asideShow}
      onVisibleChange={(visible) => {
        dispatch({ type: 'set', asideShow: visible })
      }}
    >
      <CSidebarHeader className="bg-transparent p-0">
        <CNav variant="underline">
          <CNavItem>
            <CNavLink
              href="#"
              active={activeKey === 1}
              onClick={(e) => {
                e.preventDefault()
                setActiveKey(1)
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
                e.preventDefault()
                setActiveKey(2)
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
                e.preventDefault()
                setActiveKey(3)
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
              <CAvatar src={avatar7} size="lg" className="float-end" />
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
            <CListGroupItem href="#" className="border-start-4 border-start-info">
              <CAvatar src={avatar4} size="lg" className="float-end" />
              <div>
                Skype with <strong>Megan</strong>
              </div>
              <small className="text-medium-emphasis me-3">
                <CIcon icon={cilCalendar} /> 4 - 5pm
              </small>
              <small className="text-medium-emphasis">
                <CIcon icon={cibSkype} /> On-line
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
              <div className="/avatars-stack mt-2">
                <CAvatar src={avatar2} size="sm" />
                <CAvatar src={avatar3} size="sm" />
                <CAvatar src={avatar4} size="sm" />
                <CAvatar src={avatar5} size="sm" />
                <CAvatar src={avatar6} size="sm" />
              </div>
            </CListGroupItem>
            <CListGroupItem href="#" className="border-start-4 border-start-success">
              <div>
                <strong>#10 Startups.Garden</strong> Meetup
              </div>
              <small className="text-medium-emphasis me-3">
                <CIcon icon={cilCalendar} /> 1 - 3pm
              </small>
              <small className="text-medium-emphasis">
                <CIcon icon={cilLocationPin} /> Palo Alto, CA
              </small>
            </CListGroupItem>
            <CListGroupItem href="#" className="border-start-4 border-start-primary border-bottom">
              <div>
                <strong>Team meeting</strong>
              </div>
              <small className="text-medium-emphasis me-3">
                <CIcon icon={cilCalendar} /> 4 - 6pm
              </small>
              <small className="text-medium-emphasis">
                <CIcon icon={cilHome} /> creativeLabs HQ
              </small>
              <div className="/avatars-stack mt-2">
                <CAvatar src={avatar2} size="sm" />
                <CAvatar src={avatar3} size="sm" />
                <CAvatar src={avatar4} size="sm" />
                <CAvatar src={avatar5} size="sm" />
                <CAvatar src={avatar6} size="sm" />
                <CAvatar src={avatar7} size="sm" />
                <CAvatar src={avatar8} size="sm" />
              </div>
            </CListGroupItem>
          </CListGroup>
        </CTabPane>

        <CTabPane className="p-3" visible={activeKey === 2}>
          <div className="message">
            <div className="py-3 pb-5 me-3 float-start">
              <CAvatar src={avatar7} status="success" size="md" />
            </div>
            <div>
              <small className="text-medium-emphasis">Lukasz Holeczek</small>
              <small className="text-medium-emphasis float-end mt-1">1:52 PM</small>
            </div>
            <div className="text-truncate fw-semibold">Lorem ipsum dolor sit amet</div>
            <small className="text-medium-emphasis">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt...
            </small>
          </div>
          <hr />
          <div className="message">
            <div className="py-3 pb-5 me-3 float-start">
              <CAvatar src={avatar7} status="success" size="md" />
            </div>
            <div>
              <small className="text-medium-emphasis">Lukasz Holeczek</small>
              <small className="text-medium-emphasis float-end mt-1">1:52 PM</small>
            </div>
            <div className="text-truncate fw-semibold">Lorem ipsum dolor sit amet</div>
            <small className="text-medium-emphasis">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt...
            </small>
          </div>
          <hr />
          <div className="message">
            <div className="py-3 pb-5 me-3 float-start">
              <CAvatar src={avatar7} status="success" size="md" />
            </div>
            <div>
              <small className="text-medium-emphasis">Lukasz Holeczek</small>
              <small className="text-medium-emphasis float-end mt-1">1:52 PM</small>
            </div>
            <div className="text-truncate fw-semibold">Lorem ipsum dolor sit amet</div>
            <small className="text-medium-emphasis">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt...
            </small>
          </div>
          <hr />
          <div className="message">
            <div className="py-3 pb-5 me-3 float-start">
              <CAvatar src={avatar7} status="success" size="md" />
            </div>
            <div>
              <small className="text-medium-emphasis">Lukasz Holeczek</small>
              <small className="text-medium-emphasis float-end mt-1">1:52 PM</small>
            </div>
            <div className="text-truncate fw-semibold">Lorem ipsum dolor sit amet</div>
            <small className="text-medium-emphasis">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt...
            </small>
          </div>
          <hr />
          <div className="message">
            <div className="py-3 pb-5 me-3 float-start">
              <CAvatar src={avatar7} status="success" size="md" />
            </div>
            <div>
              <small className="text-medium-emphasis">Lukasz Holeczek</small>
              <small className="text-medium-emphasis float-end mt-1">1:52 PM</small>
            </div>
            <div className="text-truncate fw-semibold">Lorem ipsum dolor sit amet</div>
            <small className="text-medium-emphasis">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt...
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
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </small>
            </div>
          </div>
          <div>
            <div className="clearfix mt-3">
              <CFormSwitch size="lg" label="Option 2" id="fOption2" />
            </div>
            <div>
              <small className="text-medium-emphasis">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
                incididunt ut labore et dolore magna aliqua.
              </small>
            </div>
          </div>
          <div>
            <div className="clearfix mt-3">
              <CFormSwitch size="lg" label="Option 3" id="Option3" />
            </div>
          </div>
          <div>
            <div className="clearfix mt-3">
              <CFormSwitch size="lg" label="Option 4" id="Option4" defaultChecked />
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
          <div className="text-uppercase mb-1 mt-2">
            <small>
              <b>Memory Usage</b>
            </small>
          </div>
          <CProgress thin color="warning-gradient" value={70} />
          <small className="text-medium-emphasis">11444GB/16384MB</small>
          <div className="text-uppercase mb-1 mt-2">
            <small>
              <b>SSD 1 Usage</b>
            </small>
          </div>
          <CProgress thin color="danger-gradient" value={95} />
          <small className="text-medium-emphasis">243GB/256GB</small>
          <div className="text-uppercase mb-1 mt-2">
            <small>
              <b>SSD 2 Usage</b>
            </small>
          </div>
          <CProgress thin color="success-gradient" value={10} />
          <small className="text-medium-emphasis">25GB/256GB</small>
        </CTabPane>
      </CTabContent>
    </CSidebar>
  )
}

export default React.memo(AppAside)
