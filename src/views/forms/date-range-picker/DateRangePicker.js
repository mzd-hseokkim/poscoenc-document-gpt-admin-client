import React from 'react'
import { CCard, CCardBody, CCardHeader, CCol, CDateRangePicker, CRow } from '@coreui/react-pro'
import { DocsExample } from 'src/components'

const DateRangePicker = () => {
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
        <CCol lg={5}>
          <CDateRangePicker
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

  const CustomRangesExample = () => {
    const customRanges = {
      Today: [new Date(), new Date()],
      Yesterday: [
        new Date(new Date().setDate(new Date().getDate() - 1)),
        new Date(new Date().setDate(new Date().getDate() - 1)),
      ],
      'Last 7 Days': [new Date(new Date().setDate(new Date().getDate() - 6)), new Date(new Date())],
      'Last 30 Days': [
        new Date(new Date().setDate(new Date().getDate() - 29)),
        new Date(new Date()),
      ],
      'This Month': [
        new Date(new Date().setDate(1)),
        new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0),
      ],
      'Last Month': [
        new Date(new Date().getFullYear(), new Date().getMonth() - 1, 1),
        new Date(new Date().getFullYear(), new Date().getMonth(), 0),
      ],
    }
    return (
      <div className="row">
        <div className="col-lg-5">
          <CDateRangePicker ranges={customRanges} />
        </div>
      </div>
    )
  }

  return (
    <CRow>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Range Picker</strong>
          </CCardHeader>
          <CCardBody>
            <DocsExample href="forms/date-range-picker/#example">
              <CRow>
                <CCol lg={5}>
                  <CDateRangePicker locale="en-US" />
                </CCol>
                <CCol lg={5}>
                  <CDateRangePicker startDate="2022/08/03" endDate="2022/08/17" locale="en-US" />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Range Picker</strong> <small>With timepicker</small>
          </CCardHeader>
          <CCardBody>
            <DocsExample href="forms/date-range-picker/#with-timepicker">
              <CRow>
                <CCol className="mb-4" lg={7}>
                  <CDateRangePicker locale="en-US" timepicker />
                </CCol>
                <CCol lg={7}>
                  <CDateRangePicker
                    startDate="2022/08/03 02:34:17 AM"
                    endDate="2022/09/17 11:29:41 PM"
                    locale="en-US"
                    timepicker
                  />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Range Picker</strong> <small>Sizing</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Set heights using <code>size</code> property like <code>size=&#34;lg&#34;</code> and{' '}
              <code>size=&#34;sm&#34;</code>.
            </p>
            <DocsExample href="forms/date-range-picker/#sizing">
              <CRow className="row mb-4">
                <CCol lg={6}>
                  <CDateRangePicker locale="en-US" size="lg" />
                </CCol>
              </CRow>
              <CRow className="row">
                <CCol lg={5}>
                  <CDateRangePicker locale="en-US" size="sm" />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Range Picker</strong> <small>Disabled</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Add the <code>disabled</code> boolean attribute on an input to give it a grayed out
              appearance and remove pointer events.
            </p>
            <DocsExample href="forms/date-range-picker/#disabled">
              <CRow>
                <CCol lg={5}>
                  <CDateRangePicker disabled locale="en-US" />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Range Picker</strong> <small>Readonly</small>
          </CCardHeader>
          <CCardBody>
            <p className="text-medium-emphasis small">
              Add the <code>inputReadOnly</code> boolean attribute to prevent modification of the
              input&#39;s value.
            </p>

            <DocsExample href="forms/date-range-picker/#readonly">
              <CRow>
                <CCol lg={5}>
                  <CDateRangePicker inputReadOnly locale="en-US" />
                </CCol>
              </CRow>
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Range Picker</strong> <small>Disabled dates</small>
          </CCardHeader>
          <CCardBody>
            <DocsExample href="forms/date-range-picker/#disabled-dates">
              <DisabledDatesExample />
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
      <CCol xs={12}>
        <CCard className="mb-4">
          <CCardHeader>
            <strong>CoreUI React Date Range Picker</strong> <small>Custom ranges</small>
          </CCardHeader>
          <CCardBody>
            <DocsExample href="forms/date-range-picker/#custom-ranges">
              <CustomRangesExample />
            </DocsExample>
          </CCardBody>
        </CCard>
      </CCol>
    </CRow>
  )
}

export default DateRangePicker
