export const documentChatHistoryColumnConfig = [
  {
    key: 'id',
    label: '아이디',
    _style: { width: '10%' },
  },
  {
    key: 'documentCollectionId',
    label: 'D-C id',
    _style: { width: '15%' },
  },
  {
    key: 'question',
    label: '질문',
    _style: { width: '25%' },
  },
  {
    key: 'answer',
    label: '답변',
    _style: { width: '25%' },
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
    label: '등록일',
    _style: { width: '14%' },
  },
];
//REMIND 100% 미만이어야 re-rendering 시에 컬럼 이둥이 없습니다.
