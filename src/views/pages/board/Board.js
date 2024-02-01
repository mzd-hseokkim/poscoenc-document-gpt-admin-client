import { CContainer, CSmartTable } from '@coreui/react-pro';
import { useState } from 'react';
import { getColumnDefinitions } from '../../../components/board/BoardColumnDefinitions';
import { BoardData } from '../../../components/board/BoardData';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';

const Board = () => {
  const [details, setDetails] = useState([]);
  const columns = getColumnDefinitions();
  const getBadge = (status) => {
    switch (status) {
      case 'false':
        return 'success';
      case 'true':
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
    <CContainer>
      <CSmartTable
        activePage={1}
        cleaner
        clickableRows
        columns={columns}
        //소팅은 소팅 상태를 가지고 재검색하도록 구현, 소팅 컴포넌트 안씀.
        footer
        items={BoardData}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        scopedColumns={getScopedColumns(getBadge, toggleDetails, details)}
        selectable
        sorterValue={{ column: 'id', state: 'asc' }}
        tableFilter
        tableFilterLabel={'검색 :'}
        tableFilterPlaceholder={'...'}
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
    </CContainer>
  );
};

export default Board;
