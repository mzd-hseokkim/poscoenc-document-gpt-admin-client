import { CContainer, CSmartTable } from '@coreui/react-pro';
import { useEffect, useState } from 'react';
import { getColumnDefinitions } from '../../../components/board/BoardColumnDefinitions';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import { getBoardList } from '../../../services/board/BoardService';

const Board = () => {
  const [content, setContent] = useState([]);
  const columns = getColumnDefinitions();
  const [boardData, setBoardData] = useState([]);

  //REMIND 구체적인 에러 핸들링 추가
  const [error, setError] = useState(null);

  useEffect(() => {
    (async () => {
      try {
        const data = await getBoardList();
        console.log(data);
        setBoardData(data);
      } catch (err) {
        setError(err);
      }
    })();
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

  //FIXME
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CContainer>
      <CSmartTable
        activePage={1}
        clickableRows
        columns={columns}
        items={boardData}
        itemsPerPageSelect
        itemsPerPage={5}
        pagination
        scopedColumns={getScopedColumns(getBadge, toggleContent, content)}
        selectable
        sorterValue={{ column: 'id', state: 'asc' }}
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
