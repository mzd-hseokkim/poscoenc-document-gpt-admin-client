import React from 'react'
import {
  CButtonToolbar,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
  CBadge,
  CButton,
  CButtonGroup,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilBookmark,
  cilChevronLeft,
  cilChevronRight,
  cilEnvelopeClosed,
  cilPaperclip,
  cilShare,
  cilShareAll,
  cilShareBoxed,
  cilStar,
  cilTags,
  cilTrash,
} from '@coreui/icons'

const Inbox = () => {
  return (
    <>
      <CButtonToolbar className="mb-4">
        <CButtonGroup className="me-1">
          <CButton color="light">
            <CIcon icon={cilEnvelopeClosed} />
          </CButton>
          <CButton color="light">
            <CIcon icon={cilStar} />
          </CButton>
          <CButton color="light">
            <CIcon icon={cilBookmark} />
          </CButton>
        </CButtonGroup>
        <CButtonGroup className="me-1">
          <CButton color="light">
            <CIcon icon={cilShare} />
          </CButton>
          <CButton color="light">
            <CIcon icon={cilShareAll} />
          </CButton>
          <CButton color="light">
            <CIcon icon={cilShareBoxed} />
          </CButton>
        </CButtonGroup>
        <CButton color="light" className="me-1">
          <CIcon icon={cilTrash} />
        </CButton>
        <CDropdown>
          <CDropdownToggle color="light">
            <CIcon icon={cilTags} />
          </CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem>
              add label <CBadge color="danger-gradient">Home</CBadge>
            </CDropdownItem>
            <CDropdownItem>
              add label <CBadge color="info-gradient">Job</CBadge>
            </CDropdownItem>
            <CDropdownItem>
              add label <CBadge color="success-gradient">Clients</CBadge>
            </CDropdownItem>
            <CDropdownItem>
              add label <CBadge color="warning-gradient">News</CBadge>
            </CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <CButtonGroup className="ms-auto">
          <CButton color="light">
            <CIcon icon={cilChevronLeft} />
          </CButton>
          <CButton color="light">
            <CIcon icon={cilChevronRight} />
          </CButton>
        </CButtonGroup>
      </CButtonToolbar>

      <div className="messages">
        <a
          className="message d-flex mb-3 text-high-emphasis text-decoration-none"
          href="#/apps/email/message"
        >
          <div className="message-actions me-3">
            <CIcon icon={cilStar} />
          </div>
          <div className="message-details flex-wrap pb-3 border-bottom">
            <div className="message-headers d-flex flex-wrap">
              <div className="message-headers-from">Lukasz Holeczek</div>
              <div className="message-headers-date ms-auto">
                <CIcon icon={cilPaperclip} /> Today, 3:47 PM
              </div>
              <div className="message-headers-subject w-100 fs-5 fw-semibold">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </div>
            </div>
            <div className="message-body">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
          </div>
        </a>
        <a
          className="message d-flex mb-3 text-medium-emphasis text-decoration-none"
          href="#/apps/email/message"
        >
          <div className="message-actions me-3">
            <CIcon icon={cilStar} />
          </div>
          <div className="message-details flex-wrap pb-3 border-bottom">
            <div className="message-headers d-flex flex-wrap">
              <div className="message-headers-from">Lukasz Holeczek</div>
              <div className="message-headers-date ms-auto">
                <CIcon icon={cilPaperclip} /> Today, 3:47 PM
              </div>
              <div className="message-headers-subject w-100 fs-5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </div>
            </div>
            <div className="message-body">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
          </div>
        </a>
        <a
          className="message d-flex mb-3 text-high-emphasis text-decoration-none message-read"
          href="#/apps/email/message"
        >
          <div className="message-actions me-3">
            <CIcon icon={cilStar} />
          </div>
          <div className="message-details flex-wrap pb-3 border-bottom">
            <div className="message-headers d-flex flex-wrap">
              <div className="message-headers-from">Lukasz Holeczek</div>
              <div className="message-headers-date ms-auto">
                <CIcon icon={cilPaperclip} /> Today, 3:47 PM
              </div>
              <div className="message-headers-subject w-100 fs-5 fw-semibold">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </div>
            </div>
            <div className="message-body">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
          </div>
        </a>
        <a
          className="message d-flex mb-3 text-medium-emphasis text-decoration-none"
          href="#/apps/email/message"
        >
          <div className="message-actions me-3">
            <CIcon icon={cilStar} />
          </div>
          <div className="message-details flex-wrap pb-3 border-bottom">
            <div className="message-headers d-flex flex-wrap">
              <div className="message-headers-from">Lukasz Holeczek</div>
              <div className="message-headers-date ms-auto">
                <CIcon icon={cilPaperclip} /> Today, 3:47 PM
              </div>
              <div className="message-headers-subject w-100 fs-5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </div>
            </div>
            <div className="message-body">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
          </div>
        </a>
        <a
          className="message d-flex mb-3 text-medium-emphasis text-decoration-none"
          href="#/apps/email/message"
        >
          <div className="message-actions me-3">
            <CIcon icon={cilStar} />
          </div>
          <div className="message-details flex-wrap pb-3 border-bottom">
            <div className="message-headers d-flex flex-wrap">
              <div className="message-headers-from">Lukasz Holeczek</div>
              <div className="message-headers-date ms-auto">
                <CIcon icon={cilPaperclip} /> Today, 3:47 PM
              </div>
              <div className="message-headers-subject w-100 fs-5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </div>
            </div>
            <div className="message-body">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
          </div>
        </a>
        <a
          className="message d-flex mb-3 text-medium-emphasis text-decoration-none"
          href="#/apps/email/message"
        >
          <div className="message-actions me-3">
            <CIcon icon={cilStar} />
          </div>
          <div className="message-details flex-wrap pb-3 border-bottom">
            <div className="message-headers d-flex flex-wrap">
              <div className="message-headers-from">Lukasz Holeczek</div>
              <div className="message-headers-date ms-auto">
                <CIcon icon={cilPaperclip} /> Today, 3:47 PM
              </div>
              <div className="message-headers-subject w-100 fs-5">
                Lorem ipsum dolor sit amet, consectetur adipisicing elit.
              </div>
            </div>
            <div className="message-body">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
              incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
              exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
              dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
            </div>
          </div>
        </a>
      </div>
    </>
  )
}

export default Inbox
