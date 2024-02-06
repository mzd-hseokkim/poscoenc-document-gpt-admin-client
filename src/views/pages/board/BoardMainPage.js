import { CButton, CCard, CSmartTable } from '@coreui/react-pro';
import { useState } from 'react';
import { getColumnDefinitions } from '../../../utils/board/BoardColumnDefinitions';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import { useBoardPosts } from '../../../hooks/board/useBoardPosts';
import { fetchPostsDeletedOption } from '../../../services/board/BoardService';
import { useNavigate } from 'react-router-dom';

const BoardMainPage = () => {
  const tableFields = getColumnDefinitions();

  const [selectedRows, setSelectedRows] = useState([]);

  const { boardPosts, isLoading, fetchBoardData } = useBoardPosts();

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
  const navigate = useNavigate();
  const navigateToDetails = (itemId) => {
    navigate(`/boards/details/${itemId}`);
  };
  const scopedColumns = getScopedColumns(navigateToDetails);
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
        items={boardPosts} //훅
        columns={tableFields} // 유틸s 패키지 밑에
        selectable
        selected={selectedRows} // 기능 동작 후 체크박스 해제하기위함
        scopedColumns={scopedColumns} //REMIND clickable row 대신에 제목 칸에 css pointer 적용
        onSelectedItemsChange={() => handleSelectedRows} //REMIND DOMException 처리
        // 스타일
        tableProps={{
          responsive: true,
          hover: true,
        }}
      />
    </CCard>
  );
};

export default BoardMainPage;
