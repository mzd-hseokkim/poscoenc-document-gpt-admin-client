import React, { useState } from 'react'
import { CCardBody, CButton, CSmartTable } from '@coreui/react-pro'
import data from './_data.js'

const SmartTableDownloadableExample = () => {
  const [currentItems, setCurrentItems] = useState(data)

  const csvContent = currentItems.map((item) => Object.values(item).join(',')).join('\n')

  const csvCode = 'data:text/csv;charset=utf-8,SEP=,%0A' + encodeURIComponent(csvContent)

  return (
    <CCardBody>
      <CButton
        color="primary"
        className="mb-2"
        href={csvCode}
        download="coreui-table-data.csv"
        target="_blank"
      >
        Download current items (.csv)
      </CButton>
      <CSmartTable
        columnFilter
        columnSorter
        items={data}
        itemsPerPage={5}
        onFilteredItemsChange={setCurrentItems}
        pagination
      />
    </CCardBody>
  )
}

export default SmartTableDownloadableExample
