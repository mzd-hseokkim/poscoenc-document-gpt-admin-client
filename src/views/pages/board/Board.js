import { CButton, CSmartTable } from '@coreui/react-pro';
import { useState } from 'react';
import { getColumnDefinitions } from '../../../components/board/BoardColumnDefinitions';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import { useBoardData } from '../../../hooks/board/useBoardData';
import { fetchPostsDeletedOption } from '../../../services/board/BoardService';
import BoardPostDetailsModal from '../../../components/board/BoardPostDetailsModal';

const Board = () => {
  const boardColumns = getColumnDefinitions();

  const [selectedRows, setSelectedRows] = useState([]);

  const { boardPosts, loadingFlag, fetchBoardData } = useBoardData();

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
  // Modal ---------------------------------------------------------------
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [clickedItem, setClickedItem] = useState(null);
  // 모달을 열고 선택된 아이템 ID를 설정하는 함수
  const handleOpenModal = (item) => {
    setClickedItem(item);
    setIsModalOpen(true);
  };

  // 모달을 닫는 함수
  const handleCloseModal = () => {
    setClickedItem(null);
    setIsModalOpen(false);
  };
  const scopedColumns = getScopedColumns(isModalOpen, handleOpenModal, clickedItem, handleCloseModal);
  // ---------------------------------------------------------------

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
        scopedColumns={scopedColumns}
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
      {clickedItem && (
        <BoardPostDetailsModal isModalOpen={isModalOpen} details={clickedItem} handleCloseModal={handleCloseModal} />
      )}
    </>
  );
};

export default Board;
