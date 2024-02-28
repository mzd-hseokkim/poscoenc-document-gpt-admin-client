import { cilCommentBubble, cilPaperclip } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import StatusBadge from 'components/badge/StatusBadge';
import { format } from 'date-fns';

export const getBoardScopedColumns = (handleClickedRowId, openModal) => ({
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
        {item.comments ? <CIcon icon={cilCommentBubble} size="sm" className="ms-2" /> : ''}
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
