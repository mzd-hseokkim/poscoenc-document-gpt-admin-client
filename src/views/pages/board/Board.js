import { CContainer, CSmartTable } from '@coreui/react-pro';
import { useState } from 'react';
import { getColumnDefinitions } from '../../../components/board/BoardColumnDefinitions';
import BoardService from '../../../services/board/BoardService';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';

const Board = async () => {
  const [contents, setContents] = useState([]);
  const columns = getColumnDefinitions();
  const boardData = await BoardService.getBoardList();
  const getBadge = (deleted) => {
    switch (deleted) {
      case 'false':
        return 'success';
      case 'true':
        return 'danger';
      default:
        return 'primary';
    }
  };
  const toggleContents = (index) => {
    const position = contents.indexOf(index);
    let newContents = contents.slice();
    if (position !== -1) {
      newContents.splice(position, 1);
    } else {
      newContents = [...contents, index];
    }
    setContents(newContents);
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
        items={boardData}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        scopedColumns={getScopedColumns(getBadge, toggleContents, contents)}
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
