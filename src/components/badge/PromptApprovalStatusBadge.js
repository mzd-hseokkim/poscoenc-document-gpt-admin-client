import React from 'react';

import { CBadge } from '@coreui/react-pro';

const translate = (approved) => {
  if (approved == null) {
    return 'No-Data';
  }
  return approved ? 'Approved' : 'Rejected';
};
const getBadgeColor = (approved) => {
  switch (approved) {
    case true:
      return 'success';
    default:
      return 'danger';
  }
};
//REMIND approved 에 대한 기획 후에 수정 필요. 현재는 삭제 컬럼과 다를게 없는 것 같음.
const PromptApprovalStatusBadge = ({ approved, style }) => {
  return (
    <CBadge className="justify-content-center" color={getBadgeColor(approved)} style={style}>
      {translate(approved)}
    </CBadge>
  );
};
export default PromptApprovalStatusBadge;
