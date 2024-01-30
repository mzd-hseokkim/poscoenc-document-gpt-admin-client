import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CDatePicker, CRow } from '@coreui/react-pro'
import { DocsExample } from 'src/components'

const DatePicker = () => {
  const DisabledDatesExample = () => {
    const calendarDate = new Date(2022, 2, 1)
    const disabledDates = [
      [new Date(2022, 2, 4), new Date(2022, 2, 7)],
      new Date(2022, 2, 16),
      new Date(2022, 3, 16),
      [new Date(2022, 4, 2), new Date(2022, 4, 8)],
    ]
    const maxDate = new Date(2022, 5, 0)
    const minDate = new Date(2022, 1, 1)
    return (
      <CRow>
        <CCol lg={4}>
          <CDatePicker
            calendarDate={calendarDate}
            disabledDates={disabledDates}
            locale="en-US"
            maxDate={maxDate}
            minDate={minDate}
          />
        </CCol>
      </CRow>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Picker</strong>
          </CCardHeader>
          <CCardBody>
            <DocsExample href="forms/date-picker/#example">
              <CRow>
                <CCol lg={4}>
                  <CDatePicker locale="en-US" />
                </CCol>
                <CCol lg={4}>
                  <CDatePicker date="2022/2/16" locale="en-US" />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Picker</strong> <small>With timepicker</small>
          </CCardHeader>
          <CCardBody>
            <DocsExample href="forms/date-picker/#with-timepicker">
              <CRow>
                <CCol lg={4}>
                  <CDatePicker locale="en-US" timepicker />
                </CCol>
                <CCol lg={4}>
                  <CDatePicker date="2023/03/15 02:22:13 PM" locale="en-US" timepicker />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Picker</strong> <small>Sizing</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Set heights using <code>size</code> property like <code>size=&#34;lg&#34;</code> and{' '}
              <code>size=&#34;sm&#34;</code>.
            </p>
            <DocsExample href="forms/date-picker/#sizing">
              <CRow className="row mb-4">
                <CCol lg={4}>
                  <CDatePicker locale="en-US" size="lg" />
                </CCol>
              </CRow>
              <CRow className="row">
                <CCol lg={3}>
                  <CDatePicker locale="en-US" size="sm" />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Picker</strong> <small>Disabled</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Add the <code>disabled</code> boolean attribute on an input to give it a grayed out
              appearance and remove pointer events.
            </p>
            <DocsExample href="forms/date-picker/#disabled">
              <CRow>
                <CCol lg={4}>
                  <CDatePicker disabled locale="en-US" />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Picker</strong> <small>Readonly</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Add the <code>inputReadOnly</code> boolean attribute to prevent modification of the
              input&#39;s value.
            </p>

            <DocsExample href="forms/date-picker/#readonly">
              <CRow>
                <CCol lg={4}>
                  <CDatePicker inputReadOnly locale="en-US" />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Picker</strong> <small>Disabled dates</small>
          </CCardHeader>
          <CCardBody>
            <DocsExample href="forms/date-picker/#disabled-dates">
              <DisabledDatesExample />
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DatePicker
