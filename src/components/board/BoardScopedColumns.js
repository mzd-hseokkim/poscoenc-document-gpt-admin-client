import { format } from 'date-fns';
import StatusBadge from './BoadStatusBadge';

export const getScopedColumns = (handleClickedRowId, openModal) => ({
  id: (item) => <td>{item.id}</td>,
  title: (item) => {
    //remind 아래 제목에 포인터 추가
    return (
      <td
        onClick={() => {
          handleClickedRowId(item.id);
          openModal();
        }}
      >
        {item.title}
      </td>
    );
  },
  createdByName: (item) => <td>{item.createdByName}</td>,
  deleted: (item) => (
    <td>
      <StatusBadge deleted={item.deleted} />
    </td>
  ),
  createdAt: (item) => <td>{format(new Date(item.createdAt), 'yyyy/MM/dd')}</td>,
  hasFiles: (item) => <td>{item.hasFiles ? 'icon' : 'X'}</td>,
  viewCount: (item) => <td>{item.viewCount}</td>,
});
