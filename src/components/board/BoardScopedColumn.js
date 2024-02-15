import { cilPaperclip } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { format } from 'date-fns';

import StatusBadge from './BoadStatusBadge';

export const getScopedColumns = (handleClickedRowId, openModal) => ({
  id: (item) => <td>{item.id}</td>,
  title: (item) => {
    return (
      <td
        style={{ cursor: 'pointer' }}
        onClick={() => {
          handleClickedRowId(item.id);
          openModal();
        }}
      >
        {item.title}
        {item.hasFiles ? <CIcon icon={cilPaperclip} size="sm" className="ms-2" /> : ''}
        {/*REMIND 댓글 여부도 아이콘 추가*/}
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
  viewCount: (item) => <td>{item.viewCount}</td>,
});
