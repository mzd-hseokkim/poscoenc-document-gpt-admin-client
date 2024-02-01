import { CBadge } from '@coreui/react-pro';

const translate = (deleted) => {
  return deleted === 'false' ? 'OnBoard' : 'Deleted';
};
export const getScopedColumns = (getBadge, toggleContent, content) => ({
  title: (item) => (
    <td
      onClick={() => {
        toggleContent(item.id);
      }}
    >
      {item.title}
    </td>
  ),
  deleted: (item) => (
    <td>
      <CBadge color={getBadge(item.deleted)}>{translate(item.deleted)}</CBadge>
    </td>
  ),
});
