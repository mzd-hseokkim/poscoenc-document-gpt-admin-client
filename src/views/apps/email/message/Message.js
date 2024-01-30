import React from 'react'
import {
  CBadge,
  CButton,
  CButtonGroup,
  CButtonToolbar,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormTextarea,
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

const Message = () => {
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
        <CButtonGroup className="m3-1">
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
          <CDropdownToggle caret color="light">
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
      <div className="message">
        <div className="message-message-details flex-wrap pb-3">
          <div className="message-message-headers d-flex flex-wrap">
            <div className="message-headers-subject w-100 fs-5 fw-semibold">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit.
            </div>
            <div className="message-headers-from">
              Lukasz Holeczek<span className="text-medium-emphasis">(email@email.com)</span>
            </div>
            <div className="message-headers-date ms-auto">
              <CIcon icon={cilPaperclip} /> Today, 3:47 PM
            </div>
          </div>

          <hr />
          <div className="message-body">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </div>
          <hr />

          <div className="message-attachment">
            <CBadge color="danger-gradient" className="me-2">
              zip
            </CBadge>
            <b>bootstrap.zip</b> <i>(2,5MB)</i>
          </div>

          <div className="message-attachment">
            <CBadge color="info-gradient" className="me-2">
              txt
            </CBadge>
            <b>readme.txt</b> <i>(7KB)</i>
          </div>

          <div className="message-attachment">
            <CBadge color="success-gradient" className="me-2">
              xls
            </CBadge>
            <b>spreadsheet.xls</b> <i>(984KB)</i>
          </div>

          <CForm className="mt-3">
            <div className="mb-3">
              <CFormTextarea rows="12" placeholder="Click here to reply"></CFormTextarea>
            </div>
            <div>
              <CButton color="success" tabIndex="3-gradient" type="submit">
                Send message
              </CButton>
            </div>
          </CForm>
        </div>
      </div>
    </>
  )
}

export default Message
