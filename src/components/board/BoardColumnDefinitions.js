export const getColumnDefinitions = () => [
  {
    key: 'id',
    label: 'ID',
    _style: { width: '5%' },
  },
  {
    key: 'title',
    label: '제목',
    _style: { width: '43%' },
  },
  {
    key: 'createdByName',
    label: '작성자',
    _style: { width: '15%' },
  },
  {
    key: 'createdAt',
    label: '작성일',
    _style: { width: '10%' },
  },
  {
    key: 'hasFiles',
    label: '첨부파일',
    _style: { width: '110px' },
  },
  {
    key: 'viewCount',
    label: '조회수',
    _style: { width: '90px' },
  },
  {
    key: 'deleted',
    label: '상태',
    _style: { width: '14%' },
  },
  // TODO 일괄 삭제버튼 추가
];
