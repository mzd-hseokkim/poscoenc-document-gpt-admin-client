export const statisticsUserColumnConfig = [
  {
    key: 'collectionDisplayName',
    label: '문서 표시명',
    _style: { width: '20%' },
  },
  {
    key: 'inputTokens',
    label: '인풋 토큰',
    _style: { width: '30%' },
  },
  {
    key: 'outputTokens',
    label: '아웃풋 토큰',
    _style: { width: '30%' },
    //REMIND 데이터를 createdByName 으로 정렬 할 수 없어서 받아온 결과를 가지고 정렬하거나 못하게 해야 합니다.
  },
  {
    key: 'total',
    label: '총 사용량',
    _style: { width: '20%' },
  },
];
