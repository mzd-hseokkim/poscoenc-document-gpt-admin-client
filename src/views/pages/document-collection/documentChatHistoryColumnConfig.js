export const documentChatHistoryColumnConfig = [
  {
    key: 'id',
    label: '아이디',
    _style: { width: '10%' },
  },
  {
    key: 'documentCollectionId',
    label: '문서 집합 아이디',
    _style: { width: '16%' },
  },
  {
    key: 'answer',
    label: '답변',
    _style: { width: '15%' },
  },
  {
    key: 'question',
    label: '질문',
    _style: { width: '15%' },
  },
  {
    key: 'createdByName',
    label: '사용자',
    _style: { width: '9%' },
    //REMIND 데이터를 createdByName 으로 정렬 할 수 없어서 받아온 결과를 가지고 정렬하거나 못하게 해야 합니다.
    sorter: false,
  },
  {
    key: 'createdAt',
    label: '질문한 날짜',
    _style: { width: '12%' },
  },
];
