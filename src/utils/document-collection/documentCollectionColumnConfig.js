export const documentCollectionColumnConfig = [
  {
    key: 'id',
    label: '아이디',
    _style: { width: '10%' },
  },
  {
    key: 'displayName',
    label: '표시명',
    _style: { width: '53%' },
  },
  {
    key: 'createdByName',
    label: '게시자',
    _style: { width: '10%' },
    //REMIND 데이터를 createdByName 으로 정렬 할 수 없어서 받아온 결과를 가지고 정렬하거나 못하게 해야 합니다.
    sorter: false,
  },
  {
    key: 'createdAt',
    label: '게시일',
    _style: { width: '10%' },
  },
  {
    key: 'deleted',
    label: '삭제여부',
    _style: { width: '12%' },
  },
];
