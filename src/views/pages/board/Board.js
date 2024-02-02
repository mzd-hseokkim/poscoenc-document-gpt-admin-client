import { CContainer, CSmartTable } from '@coreui/react-pro';
import { useEffect, useState } from 'react';
import { getColumnDefinitions } from '../../../components/board/BoardColumnDefinitions';
import { getScopedColumns } from '../../../components/board/BoardScopedColumns';
import { getBoardList } from '../../../services/board/BoardService';

const Board = () => {
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
  //FIXME
  if (error) return <div>Error: {error.message}</div>;

  return (
    <CContainer>
      <CSmartTable
        pagination
        itemsPerPageLabel={'페이지당 글 개수'}
        itemsPerPageSelect
        itemsPerPage={5}
        activePage={1}
        clickableRows
        columns={columns}
        items={boardData}
        scopedColumns={getScopedColumns(getBadge)}
        selectable
        sorterValue={{ column: 'id', state: 'asc' }}
        tableProps={{
          className: 'add-this-class',
          responsive: true,
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
