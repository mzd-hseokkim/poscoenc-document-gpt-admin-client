export const getColumnDefinitions = () => [
  'title',
  {
    key: 'author',
    _style: { width: '15%' },
  },
  {
    key: 'role',
    _style: { width: '5%' },
  },
  {
    key: 'status',
    _style: { width: '7%' },
  },
  {
    key: 'registered',
    _style: { width: '10%' },
  },
  {
    key: 'show_details',
    label: '',
    _style: { width: '1%' },
    filter: false,
    sorter: false,
  },
];
