import React, { useState } from 'react'
import { CBadge, CCardBody, CFormCheck, CFormLabel, CSmartTable } from '@coreui/react-pro'

import data from './_data.js'

const SmartTableSelectableExample = () => {
  const [selected, setSelected] = useState([2, 3])
  const usersData = data.map((item, id) => {
    const _selected = selected.includes(id)
    return {
      ...item,
      id,
      _selected,
      _classes: [item._classes, _selected && 'table-selected'],
    }
  })

  const check = (e, id) => {
    if (e.target.checked) {
      setSelected([...selected, id])
    } else {
      setSelected(selected.filter((itemId) => itemId !== id))
    }
  }

  const getBadge = (status) => {
    switch (status) {
      case 'Active':
        return 'success'
      case 'Inactive':
        return 'secondary'
      case 'Pending':
        return 'warning'
      case 'Banned':
        return 'danger'
      default:
        return 'primary'
    }
  }

  return (
    <CCardBody>
      Selected: {JSON.stringify(selected)}
      <CSmartTable
        items={usersData}
        columns={[
          { key: 'select', label: '', filter: false, sorter: false },
          'name',
          'registered',
          'role',
          'status',
        ]}
        itemsPerPage={5}
        columnFilter
        columnSorter
        pagination
        scopedColumns={{
          select: (item) => {
            return (
              <td>
                <CFormCheck
                  id={`checkbox${item.id}`}
                  checked={item._selected}
                  onChange={(e) => check(e, item.id)}
                />
                <CFormLabel variant="custom-checkbox" htmlFor={`checkbox${item.id}`} />
              </td>
            )
          },
          status: (item) => (
            <td>
              <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
            </td>
          ),
        }}
        tableProps={{
          hover: true,
        }}
      />
    </CCardBody>
  )
}

export default SmartTableSelectableExample
