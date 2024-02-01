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
  // {
  //   key: 'role',
  //   _style: { width: '5%' },
  // },
  {
    key: 'deleted',
    _style: { width: '14%' },
  },
  {
    key: 'createdAt',
    _style: { width: '10%' },
  },
  {
    // TODO 버튼말고 row 클릭시 detail
    key: 'show_content',
    label: '',
    _style: { width: '6%' },
    filter: false,
    sorter: false,
  },
  // TODO 일괄삭제추가
];
