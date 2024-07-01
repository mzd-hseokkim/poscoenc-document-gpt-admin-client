import React from 'react';

import { CWidgetStatsB } from '@coreui/react-pro';

export const OperationRateWidget = () => {
  /*REMIND 사용률에 따른 색 변화 구현*/
  return (
    <CWidgetStatsB
      className="mb-3"
      color="success"
      inverse
      progress={{ value: 89.9 }}
      text="쓸만큼 쓰셨군요! 다음달에도 만나요~"
      title="Rate of CMS operation"
      value="89.9%"
      style={{ height: '90%' }}
    />
  );
};
