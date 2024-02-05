import { CBadge } from '@coreui/react-pro';
import { format } from 'date-fns';

const translate = (deleted) => {
  return deleted ? 'Deleted' : 'OnBoard';
};
export const getScopedColumns = (getBadge) => ({
  ID: (item) => <td>{item.id}</td>,
  title: (item) => <td>{item.title}</td>,
  createdByName: (item) => <td>{item.createdByName}</td>,
  deleted: (item) => (
    <td>
      <CBadge color={getBadge(item.deleted)}>{translate(item.deleted)}</CBadge>
    </td>
  ),
  createdAt: (item) => <td>{format(new Date(item.createdAt), 'yyyy/MM/dd')}</td>,
  hasAttachment: (item) => <td>{item.hasFiles ? 'icon' : 'X'}</td>,
  viewCount: (item) => <td>{item.viewCount}</td>,
});
