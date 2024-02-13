import { useState } from 'react';

import { CButton, CCard, CSmartTable } from '@coreui/react-pro';

import BoardPostDetailsForm from '../../../components/board/BoardPostDetailsForm';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import ModalContainer from '../../../components/modal/ModalContainer';
import { useBoardPosts } from '../../../hooks/board/useBoardPosts';
import UseModal from '../../../hooks/useModal';
import { fetchPostsDeletedOption } from '../../../services/board/BoardService';
import { getColumnDefinitions } from '../../../utils/board/BoardColumnDefinitions';

const BoardMainPage = () => {
  const tableFields = getColumnDefinitions();

  const [selectedRows, setSelectedRows] = useState([]);

  const { boardPosts, isLoading, fetchBoardData } = useBoardPosts();

  const modal = UseModal();

  const handleSelectedRows = (newSelectedRows) => {
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
      handleSelectedRows([]);
    }
  };
  // Modal 사용 --------------------------------------------------------------
  const [clickedRowId, setClickedRowId] = useState(null);
  const handleClickedRowId = (newClickedRowId) => {
    setClickedRowId(newClickedRowId);
  };
  const scopedColumns = getScopedColumns(handleClickedRowId, modal.openModal);
  // ---------------------------------------------------------------

  //REMIND 구체적인 에러 핸들링 추가
  const [error, setError] = useState(null);
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CCard>
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
        // 페이징
        //REMIND 페이지네이션 컴포넌트 구현
        pagination
        activePage={1}
        itemsPerPageSelect
        itemsPerPage={10}
        itemsPerPageLabel={'페이지당 글 개수'}
        // 스피너
        loading={isLoading}
        // 정렬
        //REMIND 커스텀 소터 구현
        columnSorter
        sorterValue={{ column: 'id', state: 'asc' }}
        // 컬럼
        items={boardPosts}
        columns={tableFields}
        selectable
        selected={selectedRows}
        //REMIND clickable row 대신에 제목 칸에 css pointer 적용
        scopedColumns={scopedColumns}
        //REMIND DOMException 처리
        onSelectedItemsChange={() => handleSelectedRows}
        // 스타일
        tableProps={{
          responsive: true,
          hover: true,
        }}
      />
      <ModalContainer visible={modal.isOpen} title="게시글" onClose={modal.closeModal}>
        <BoardPostDetailsForm selectedId={clickedRowId}></BoardPostDetailsForm>
      </ModalContainer>
    </CCard>
  );
};

export default BoardMainPage;
