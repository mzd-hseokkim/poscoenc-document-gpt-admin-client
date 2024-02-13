import React from 'react';

import { CBadge } from '@coreui/react-pro';

const getBadge = (deleted) => {
  switch (deleted) {
    case true:
      return 'danger';
    default:
      return 'primary';
  }
};
const translate = (deleted) => {
  if (deleted == null) return 'No-Data';
  return deleted ? 'Deleted' : '';
};

const StatusBadge = ({ deleted }) => {
  return <CBadge color={getBadge(deleted)}>{translate(deleted)}</CBadge>;
};
export default StatusBadge;
