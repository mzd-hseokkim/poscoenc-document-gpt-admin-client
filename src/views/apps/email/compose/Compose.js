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
  CForm,
  CFormInput,
  CFormLabel,
  CFormTextarea,
  CRow,
  CCol,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import {
  cilAlignCenter,
  cilAlignLeft,
  cilAlignRight,
  cilBold,
  cilIndentDecrease,
  cilIndentIncrease,
  cilItalic,
  cilJustifyCenter,
  cilList,
  cilListNumbered,
  cilPaperclip,
  cilTags,
  cilTrash,
  cilUnderline,
} from '@coreui/icons'

const Compose = () => {
  return (
    <>
      <CForm>
        <CRow form className="mb-3">
          <CFormLabel className="col-1" htmlFor="to">
            To:
          </CFormLabel>
          <CCol sm="11">
            <CFormInput id="to" type="email" placeholder="Type email" />
          </CCol>
        </CRow>
        <CRow form className="mb-3">
          <CFormLabel className="col-1" htmlFor="cc">
            CC:
          </CFormLabel>
          <CCol sm="11">
            <CFormInput id="cc" type="email" placeholder="Type email" />
          </CCol>
        </CRow>
        <CRow form className="mb-3">
          <CFormLabel className="col-1" htmlFor="bcc">
            BCC:
          </CFormLabel>
          <CCol sm="11">
            <CFormInput id="bcc" type="email" placeholder="Type email" />
          </CCol>
        </CRow>
      </CForm>
      <CRow>
        <CCol className="ms-auto" sm={11}>
          <CButtonToolbar>
            <CButtonGroup className="me-1">
              <CButton color="light">
                <CIcon icon={cilBold} />
              </CButton>
              <CButton color="light">
                <CIcon icon={cilItalic} />
              </CButton>
              <CButton color="light">
                <CIcon icon={cilUnderline} />
              </CButton>
            </CButtonGroup>{' '}
            <CButtonGroup className="me-1">
              <CButton color="light">
                <CIcon icon={cilAlignLeft} />
              </CButton>
              <CButton color="light">
                <CIcon icon={cilAlignRight} />
              </CButton>
              <CButton color="light">
                <CIcon icon={cilAlignCenter} />
              </CButton>
              <CButton color="light">
                <CIcon icon={cilJustifyCenter} />
              </CButton>
            </CButtonGroup>
            <CButtonGroup className="me-1">
              <CButton color="light">
                <CIcon icon={cilIndentIncrease} />
              </CButton>
              <CButton color="light">
                <CIcon icon={cilIndentDecrease} />
              </CButton>
            </CButtonGroup>
            <CButtonGroup className="me-1">
              <CButton color="light">
                <CIcon icon={cilList} />
              </CButton>
              <CButton color="light">
                <CIcon icon={cilListNumbered} />
              </CButton>
            </CButtonGroup>
            <CButton color="light" className="me-1">
              <CIcon icon={cilTrash} />
            </CButton>
            <CButton color="light" className="me-1">
              <CIcon icon={cilPaperclip} />
            </CButton>
            <CDropdown>
              <CDropdownToggle color="light">
                <CIcon icon={cilTags} />
              </CDropdownToggle>
              <CDropdownMenu>
                <CDropdownItem href="#">
                  add label<CBadge color="danger-gradient"> Home</CBadge>
                </CDropdownItem>
                <CDropdownItem href="#">
                  add label<CBadge color="info-gradient"> Job</CBadge>
                </CDropdownItem>
                <CDropdownItem href="#">
                  add label<CBadge color="success-gradient"> Clients</CBadge>
                </CDropdownItem>
                <CDropdownItem href="#">
                  add label<CBadge color="warning-gradient"> News</CBadge>
                </CDropdownItem>
              </CDropdownMenu>
            </CDropdown>
          </CButtonToolbar>
          <div className="mb-3 mt-4">
            <CFormTextarea rows="12" placeholder="Message content"></CFormTextarea>
          </div>
          <div>
            <CButton color="success" type="submit">
              Send
            </CButton>{' '}
            <CButton color="light" type="submit">
              Draft
            </CButton>{' '}
            <CButton color="danger" type="submit">
              Discard
            </CButton>
          </div>
        </CCol>
      </CRow>
    </>
  )
}

export default Compose
