const DocumentChunkColumnConfig = [
  {
    key: 'chunkSeq',
    label: '청크 아이디',
    _style: { width: '17%' },
  },
  {
    key: 'documentCollectionId',
    label: '문서 집합 아이디',
    _style: { width: '22%' },
  },
  {
    key: 'documentCollectionFileNameOrg',
    label: '문서 집합 파일 이름',
    _style: { width: '24%' },
  },
  {
    key: 'pageId',
    label: '문서 페이지',
    _style: { width: '16%' },
  },
  {
    key: 'createdByName',
    label: '게시자',
    _style: { width: '9%' },
    //REMIND 데이터를 createdByName 으로 정렬 할 수 없어서 받아온 결과를 가지고 정렬하거나 못하게 해야 합니다.
    sorter: false,
  },
  {
    key: 'createdAt',
    label: '게시일',
    _style: { width: '12%' },
  },
];

//REMIND ColumnConfig 들 전부 util 에서 빼버리기
export default DocumentChunkColumnConfig;
