import React from 'react';

import { CBadge } from '@coreui/react-pro';

const translate = (deleted) => {
  if (deleted == null) return 'No-Data';
  return deleted ? 'Deleted' : '';
};
const getBadgeColor = (deleted) => {
  switch (deleted) {
    case true:
      return 'danger';
    default:
      return 'primary';
  }
};

const StatusBadge = ({ deleted }) => {
  return <CBadge color={getBadgeColor(deleted)}>{translate(deleted)}</CBadge>;
};
export default StatusBadge;
