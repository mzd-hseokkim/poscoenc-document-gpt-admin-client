import { CContainer, CSmartTable } from '@coreui/react-pro';
import { useEffect, useState } from 'react';
import { getColumnDefinitions } from '../../../components/board/BoardColumnDefinitions';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import BoardService from '../../../services/board/BoardService';

const Board = () => {
  const [content, setContent] = useState([]);
  const columns = getColumnDefinitions();
  const [boardData, setBoardData] = useState([]);

  //REMIND remove below two code
  const [loading, setLoading] = useState(true); // 로딩 상태 초기화
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBoardData = async () => {
      try {
        const data = await BoardService.getBoardList(); // 데이터 가져오기
        console.log(data);
        setBoardData(data); // 상태 업데이트
        setLoading(false); // 로딩 상태 업데이트
      } catch (err) {
        setError(err); // 에러 상태 업데이트
        setLoading(false);
      }
    };
    fetchBoardData();
  }, []);
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
  const toggleContent = (index) => {
    const position = content.indexOf(index);
    let newContent = content.slice();
    if (position !== -1) {
      newContent.splice(position, 1);
    } else {
      newContent = [...content, index];
    }
    setContent(newContent);
  };
  //fixme
  if (loading) return <div>Loading...</div>;
  //fixme
  if (error) return <div>Error: {error.message}</div>;
  return (
    <CContainer>
      <CSmartTable
        activePage={1}
        cleaner
        clickableRows
        columns={columns}
        //소팅은 소팅 상태를 가지고 재검색하도록 구현, 소팅 컴포넌트 안씀.
        // footer
        items={boardData}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        scopedColumns={getScopedColumns(getBadge, toggleContent, content)}
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
