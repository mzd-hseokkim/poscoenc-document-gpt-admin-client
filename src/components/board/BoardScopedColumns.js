import { CAvatar, CBadge, CButton, CCardBody, CCollapse } from '@coreui/react-pro';

export const getScopedColumns = (getBadge, toggleDetails, details) => ({
  avatar: (item) => (
    <td>
      <CAvatar src={`/images/avatars/${item.avatar}`} />
    </td>
  ),
  status: (item) => (
    <td>
      <CBadge color={getBadge(item.status)}>{item.status}</CBadge>
    </td>
  ),
  show_details: (item) => (
    <td className="py-2">
      <CButton
        color="primary"
        variant="outline"
        shape="square"
        size="sm"
        onClick={() => {
          toggleDetails(item.id);
        }}
      >
        {details.includes(item.id) ? 'Hide' : 'Show'}
      </CButton>
    </td>
  ),
  details: (item) => (
    <CCollapse visible={details.includes(item.id)}>
      <CCardBody className="p-3">
        <h4>{item.username}</h4>
        <p className="text-muted">{item.content}</p>
        <CButton size="sm" color="info">
          수정
        </CButton>
        <CButton size="sm" color="danger" className="ml-1">
          삭제
        </CButton>
      </CCardBody>
    </CCollapse>
  ),
});
