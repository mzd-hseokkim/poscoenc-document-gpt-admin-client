import React from 'react'
import {
  CBadge,
  CDropdown,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CProgress,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilList } from '@coreui/icons'

const AppHeaderDropdownTasks = () => {
  const itemsCount = 5
  return (
    <CDropdown variant="nav-item" alignment="end">
      <CDropdownToggle caret={false}>
        <CIcon icon={cilList} size="lg" className="my-1 mx-2" />
        <CBadge
          shape="rounded-pill"
          color="warning-gradient"
          className="position-absolute top-0 end-0"
        >
          {itemsCount}
        </CBadge>
      </CDropdownToggle>
      <CDropdownMenu placement="bottom-end" className="pt-0">
        <CDropdownHeader className="bg-light dark:bg-white dark:bg-opacity-10">
          <strong>You have {itemsCount} pending tasks</strong>
        </CDropdownHeader>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            Upgrade NPM &amp; Bower{' '}
            <span className="float-end">
              <strong>0%</strong>
            </span>
          </div>
          <CProgress thin color="info-gradient" value={0} />
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            ReactJS Version{' '}
            <span className="float-end">
              <strong>25%</strong>
            </span>
          </div>
          <CProgress thin color="danger-gradient" value={25} />
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            VueJS Version{' '}
            <span className="float-end">
              <strong>50%</strong>
            </span>
          </div>
          <CProgress thin color="warning-gradient" value={50} />
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            Add new layouts{' '}
            <span className="float-end">
              <strong>75%</strong>
            </span>
          </div>
          <CProgress thin color="info-gradient" value={75} />
        </CDropdownItem>
        <CDropdownItem className="d-block">
          <div className="small mb-1">
            Angular 2 Cli Version{' '}
            <span className="float-end">
              <strong>100%</strong>
            </span>
          </div>
          <CProgress thin color="success-gradient" value={100} />
        </CDropdownItem>
        <CDropdownItem className="text-center border-top">
          <strong>View all tasks</strong>
        </CDropdownItem>
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdownTasks
