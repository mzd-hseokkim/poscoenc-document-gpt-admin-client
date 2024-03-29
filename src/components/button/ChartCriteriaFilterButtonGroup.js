import React from 'react';

import { CButton, CButtonGroup } from '@coreui/react-pro';

export const ChartCriteriaFilterButtonGroup = ({ selectedCriteria, setSelectedCriteria }) => {
  //REMIND criteria 필터는 대시보드에서 적용
  return (
    <CButtonGroup className="float-end me-3">
      {['createdBy', 'documentCollection'].map((value) => (
        <CButton
          color="outline-secondary"
          key={value}
          className="mx-0"
          active={value === selectedCriteria}
          onClick={() => setSelectedCriteria(value)} // 클릭 이벤트 핸들러
        >
          {value}
        </CButton>
      ))}
    </CButtonGroup>
  );
};
