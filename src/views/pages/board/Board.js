import { CButton, CSmartTable } from '@coreui/react-pro';
import { useState } from 'react';
import { getColumnDefinitions } from '../../../components/board/BoardColumnDefinitions';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import { DefaultCSmartTable } from '../../../components/board/DefaultCSmartTable';
import { DefaultSmartPagination } from '../../../components/pagination/DefaultSmartPagination';
import { useBoardData } from '../../../hooks/board/useBoardData';
import { fetchPostsDeletedOption } from '../../../services/board/BoardService';

const Board = () => {
  const boardColumns = getColumnDefinitions();
  const { boardPosts, loadingFlag, fetchBoardData } = useBoardData();

  //TODO 페이지네이션 const [currentPage, setCurrentPage] = useState(1);
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowSelectedIds = (newSelectedRows) => {
    setSelectedRows(newSelectedRows);
  };

  const isDeletedRow = (selectedRows) => {
    return selectedRows.some((row) => row.deleted === true);
  };

  const togglePostStatus = async (shouldDelete) => {
    //TODO Start here. 삭제 후 재조회 로직 구성중
    const isSuccess = await fetchPostsDeletedOption(
      selectedRows.map((row) => row.id),
      shouldDelete
    );
    if (isSuccess) {
      await fetchBoardData();
      handleRowSelectedIds([]);
    }
    console.log('selected rows: ' + selectedRows.map((e) => e.toString()));
  };
  const getBadge = (deleted) => {
    //FIXME simplify case logic
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

  /*REMIND 일괄선택 시, 어떻게 처리할껀지...?  */

  return (
    //REMIND 컨테이너 빼버리면 컨테이너 디폴트 사이즈가 아니라 페이지 반응형 사이즈가 된다...
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
        //TODO pagination 직접 만들어서 전달하면 1페이지부터 생성 가능..?
        pagination={{
          external: true,
          pagination: DefaultSmartPagination,
        }}
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
      <DefaultCSmartTable />
    </>
  );
};

export default Board;
