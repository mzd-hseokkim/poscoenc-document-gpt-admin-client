export const getColumnDefinitions = () => [
  {
    key: 'id',
    _style: { width: '5%' },
  },
  {
    key: 'title',
    _style: { width: '50%' },
  },
  {
    key: 'createdByName',
    _style: { width: '15%' },
  },
  {
    key: 'deleted',
    _style: { width: '14%' },
  },
  {
    key: 'createdAt',
    _style: { width: '10%' },
  },
  {
    key: 'show_content',
    label: '',
    _style: { width: '6%' },
    filter: false,
    sorter: false,
  },
  // TODO 일괄 삭제버튼 추가
];
