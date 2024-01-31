import { CSmartTable } from '@coreui/react-pro';
import { useState } from 'react';
import { BoardData } from './BoardData';
import { getColumnDefinitions } from './BoardColumnDefinitions';
import { getScopedColumns } from './BoardScopedColumns';

const BoardList = () => {
  const [details, setDetails] = useState([]);
  const columns = getColumnDefinitions();
  const getBadge = (status) => {
    switch (status) {
      case '답변 완료':
        return 'success';
      case '대기중':
        return 'secondary';
      case '진행중':
        return 'warning';
      case '삭제됨':
        return 'danger';
      default:
        return 'primary';
    }
  };
  const toggleDetails = (index) => {
    const position = details.indexOf(index);
    let newDetails = details.slice();
    if (position !== -1) {
      newDetails.splice(position, 1);
    } else {
      newDetails = [...details, index];
    }
    setDetails(newDetails);
  };

  return (
    <CSmartTable
      activePage={1}
      cleaner
      clickableRows
      columns={columns}
      columnFilter
      columnSorter
      footer
      items={BoardData}
      itemsPerPageSelect
      itemsPerPage={5}
      pagination
      scopedColumns={getScopedColumns(getBadge, toggleDetails, details)}
      selectable
      sorterValue={{ column: 'status', state: 'asc' }}
      tableFilter
      tableFilterLabel={'검색 :'}
      tableProps={{
        className: 'add-this-class',
        responsive: true,
        striped: true,
        hover: true,
      }}
      tableBodyProps={{
        className: 'align-middle',
      }}
    />
  );
};

export default BoardList;
