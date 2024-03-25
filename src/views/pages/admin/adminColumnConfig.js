export const adminColumnConfig = [
  {
    key: 'id',
    label: '아이디',
    _style: { width: '10%' },
  },
  {
    key: 'email',
    label: '이메일',
    _style: { width: '22%' },
  },
  {
    key: 'name',
    label: '이름',
    _style: { width: '18%' },
  },
  // FIXME 권한 반환 수정 후 추가
  // {
  //   key: 'role',
  //   label: '권한',
  //   _style: { width: '12%' },
  // },
  {
    key: 'lastLoggedInAt',
    label: '최근 로그인',
    _style: { width: '21%' },
  },
  {
    key: 'failedCnt',
    label: '로그인 실패 횟수',
    _style: { width: '18%' },
  },
  {
    key: 'deleted',
    label: '삭제',
    _style: { width: '12%' },
  },
];
