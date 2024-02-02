export const getColumnDefinitions = () => [
  {
    key: 'ID',
    _style: { width: '5%' },
  },
  {
    key: '제목',
    _style: { width: '43%' },
  },
  {
    key: '작성자',
    _style: { width: '15%' },
  },
  {
    key: '상태',
    _style: { width: '14%' },
  },
  {
    key: '작성일',
    _style: { width: '10%' },
  },
  {
    key: '첨부파일',
    _style: { width: '110px' },
  },
  {
    key: '조회수',
    _style: { width: '90px' },
  },
  // TODO 일괄 삭제버튼 추가
];
