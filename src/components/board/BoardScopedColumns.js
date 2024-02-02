import { CBadge } from '@coreui/react-pro';

const translate = (deleted) => {
  return deleted === 'false' ? 'OnBoard' : 'Deleted';
};
export const getScopedColumns = (getBadge) => ({
  ID: (item) => <td>{item.id}</td>,
  제목: (item) => <td>{item.title}</td>,
  작성자: (item) => <td>{item.createdByName}</td>,
  상태: (item) => (
    <td>
      <CBadge color={getBadge(item.deleted)}>{translate(item.deleted)}</CBadge>
    </td>
  ),
  작성일: (item) => <td>{item.createdAt.substring(0, 10)}</td>,
  //REMIND fix icon for attachment
  첨부파일: (item) => <td>{item.hasAttachement ? 'icon' : 'X'}</td>,
  조회수: (item) => <td>{item.viewCount}</td>,
});
