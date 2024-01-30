import React from 'react'
import {
  CButton,
  CCard,
  CCardHeader,
  CCardBody,
  CCol,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react-pro'
import CIcon from '@coreui/icons-react'
import { cilDollar, cilPrint, cilSave } from '@coreui/icons'

const Invoice = () => {
  const print = (e) => {
    e.preventDefault()
    window.print()
  }

  return (
    <CCard>
      <CCardHeader>
        Invoice <strong>#90-98792</strong>
        <CButton
          className="me-1 float-end"
          href=""
          tag="a"
          size="sm"
          color="secondary"
          onClick={print}
        >
          <CIcon icon={cilPrint} /> Print
        </CButton>
        <CButton className="me-1 float-end" href="" tag="a" size="sm" color="info">
          <CIcon icon={cilSave} /> Save
        </CButton>
      </CCardHeader>
      <CCardBody>
        <CRow className="mb-4">
          <CCol sm={4}>
            <h6 className="mb-3">From:</h6>
            <div>
              <strong>Your Great Company Inc.</strong>
            </div>
            <div>724 John Ave.</div>
            <div>Cupertino, CA 95014</div>
            <div>Email: email@your-great-company.com</div>
            <div>Phone: +1 123-456-7890</div>
          </CCol>
          <CCol sm={4}>
            <h6 className="mb-3">To:</h6>
            <div>
              <strong>Acme Inc.</strong>
            </div>
            <div>159 Manor Station Road</div>
            <div>San Diego, CA 92154</div>
            <div>Email: email@acme.com</div>
            <div>Phone: +1 123-456-7890</div>
          </CCol>
          <CCol sm={4}>
            <h6 className="mb-3">Details:</h6>
            <div>
              Invoice <strong>#90-98792</strong>
            </div>
            <div>March 30, 2020</div>
            <div>VAT: EU9877281777</div>
            <div>Account Name: ACME</div>
            <div>
              <strong>SWIFT code: 99 8888 7777 6666 5555</strong>
            </div>
          </CCol>
        </CRow>
        <CTable striped>
          <CTableHead>
            <CTableRow>
              <CTableHeaderCell className="text-center">#</CTableHeaderCell>
              <CTableHeaderCell>Item</CTableHeaderCell>
              <CTableHeaderCell>Description</CTableHeaderCell>
              <CTableHeaderCell className="text-center">Quantity</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Unit Cost</CTableHeaderCell>
              <CTableHeaderCell className="text-end">Total</CTableHeaderCell>
            </CTableRow>
          </CTableHead>
          <CTableBody>
            <CTableRow>
              <CTableDataCell className="text-center">1</CTableDataCell>
              <CTableDataCell className="text-start">Origin License</CTableDataCell>
              <CTableDataCell className="text-start">Extended License</CTableDataCell>
              <CTableDataCell className="text-center">1</CTableDataCell>
              <CTableDataCell className="text-end">$999,00</CTableDataCell>
              <CTableDataCell className="text-end">$999,00</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">2</CTableDataCell>
              <CTableDataCell className="text-start">Custom Services</CTableDataCell>
              <CTableDataCell className="text-start">
                Installation and Customization (per hour)
              </CTableDataCell>
              <CTableDataCell className="text-center">20</CTableDataCell>
              <CTableDataCell className="text-end">$150,00</CTableDataCell>
              <CTableDataCell className="text-end">$3.000,00</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">3</CTableDataCell>
              <CTableDataCell className="text-start">Hosting</CTableDataCell>
              <CTableDataCell className="text-start">1 year subscription</CTableDataCell>
              <CTableDataCell className="text-center">1</CTableDataCell>
              <CTableDataCell className="text-end">$499,00</CTableDataCell>
              <CTableDataCell className="text-end">$499,00</CTableDataCell>
            </CTableRow>
            <CTableRow>
              <CTableDataCell className="text-center">4</CTableDataCell>
              <CTableDataCell className="text-start">Platinum Support</CTableDataCell>
              <CTableDataCell className="text-start">1 year subscription 24/7</CTableDataCell>
              <CTableDataCell className="text-center">1</CTableDataCell>
              <CTableDataCell className="text-end">$3.999,00</CTableDataCell>
              <CTableDataCell className="text-end">$3.999,00</CTableDataCell>
            </CTableRow>
          </CTableBody>
        </CTable>
        <CRow>
          <CCol lg={4} sm={5}>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor
            incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
            exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure
            dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
          </CCol>
          <CCol lg={4} sm={5} className="ms-auto">
            <CTable>
              <CTableBody>
                <CTableRow>
                  <CTableDataCell className="text-start">
                    <strong>Subtotal</strong>
                  </CTableDataCell>
                  <CTableDataCell className="text-end">$8.497,00</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="text-start">
                    <strong>Discount (20%)</strong>
                  </CTableDataCell>
                  <CTableDataCell className="text-end">$1,699,40</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="text-start">
                    <strong>VAT (10%)</strong>
                  </CTableDataCell>
                  <CTableDataCell className="text-end">$679,76</CTableDataCell>
                </CTableRow>
                <CTableRow>
                  <CTableDataCell className="text-start">
                    <strong>Total</strong>
                  </CTableDataCell>
                  <CTableDataCell className="text-end">
                    <strong>$7.477,36</strong>
                  </CTableDataCell>
                </CTableRow>
              </CTableBody>
            </CTable>
            <CButton color="success">
              <CIcon icon={cilDollar} /> Proceed to Payment
            </CButton>
          </CCol>
        </CRow>
      </CCardBody>
    </CCard>
  )
}

export default Invoice
