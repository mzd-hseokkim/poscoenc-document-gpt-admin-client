import React from 'react';

import { CBadge } from '@coreui/react-pro';

const getBadge = (deleted) => {
  switch (deleted) {
    case false:
      return 'success';
    case true:
      return 'danger';
    default:
      return 'primary';
  }
};
const translate = (deleted) => {
  if (deleted == null) return 'No-Data';
  return deleted ? 'Deleted' : 'OnBoard';
};

const StatusBadge = ({ deleted }) => {
  return <CBadge color={getBadge(deleted)}>{translate(deleted)}</CBadge>;
};
export default StatusBadge;
