import { CBadge, CButton, CCardBody, CCollapse } from '@coreui/react-pro';

const translate = (deleted) => {
  return deleted === 'false' ? 'Active' : 'Deleted';
};
export const getScopedColumns = (getBadge, toggleContents, contents) => ({
  title: (item) => (
    <td
      onClick={() => {
        toggleContents(item.id);
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
  show_contents: (item) => (
    <td className="py-2">
      <CButton
        color="primary"
        variant="outline"
        shape="square"
        size="sm"
        onClick={() => {
          toggleContents(item.id);
        }}
      >
        {contents.includes(item.id) ? 'Hide' : 'Show'}
      </CButton>
    </td>
  ),
  contents: (item) => (
    <CCollapse visible={contents.includes(item.id)}>
      <CCardBody className="p-3">
        <h4>{item.username}</h4>
        <p className="text-muted">{item.content}</p>

        <CButton size="sm" color="info">
          이동예정
        </CButton>
        <CButton size="sm" color="danger" className="ml-1">
          이동예정
        </CButton>
      </CCardBody>
    </CCollapse>
  ),
});
