import { CButton, CSmartTable } from '@coreui/react-pro';
import { useState } from 'react';
import { getColumnDefinitions } from '../../../components/board/BoardColumnDefinitions';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import { useBoardData } from '../../../hooks/board/useBoardData';
import { fetchPostsDeletedOption } from '../../../services/board/BoardService';

const Board = () => {
  const boardColumns = getColumnDefinitions();
  const { boardPosts, loadingFlag, fetchBoardData } = useBoardData();

  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelectedIds = (newSelectedRows) => {
    setSelectedRows(newSelectedRows);
  };

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const togglePostStatus = async (shouldDelete) => {
    const isSuccess = await fetchPostsDeletedOption(
      selectedRows.map((row) => row.id),
      shouldDelete
    );
    if (isSuccess) {
      await fetchBoardData();
      handleRowSelectedIds([]);
    }
  };
  const getBadge = (deleted) => {
    switch (deleted) {
      case false:
        return 'success';
      case true:
        return 'danger';
      default:
        return 'primary';
    }
  };

  //REMIND 구체적인 에러 핸들링 추가
  const [error, setError] = useState(null);
  if (error) return <div>Error: {error.message}</div>;

  return (
    <>
      <CButton
        disabled={selectedRows.length === 0 || isDeletedRow(selectedRows)}
        onClick={() => togglePostStatus(true)}
      >
        {'삭제'}
      </CButton>
      <CButton
        disabled={selectedRows.length === 0 || !isDeletedRow(selectedRows)}
        onClick={() => togglePostStatus(false)}
      >
        {'복구'}
      </CButton>
      <CSmartTable
        // Functional Flags
        pagination
        selectable
        clickableRows
        loading={loadingFlag}
        // Data and Data Handling
        items={boardPosts}
        columns={boardColumns}
        scopedColumns={getScopedColumns(getBadge)}
        sorterValue={{ column: 'id', state: 'asc' }}
        selected={selectedRows}
        onSelectedItemsChange={handleRowSelectedIds}
        // Pagination Controls
        itemsPerPage={5}
        activePage={1}
        itemsPerPageLabel={'페이지당 글 개수'}
        itemsPerPageSelect
        // Styling and Class Names
        tableProps={{
          className: 'add-this-class',
          responsive: true,
          hover: true,
        }}
        tableBodyProps={{
          className: 'align-middle',
        }}
      />
    </>
  );
};

export default Board;
