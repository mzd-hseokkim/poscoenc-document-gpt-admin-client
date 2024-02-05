import { CBadge } from '@coreui/react-pro';
import React from 'react';

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
  return deleted ? 'Deleted' : 'OnBoard';
};

const StatusBadge = ({ deleted }) => {
  return <CBadge color={getBadge(deleted)}>{translate(deleted)}</CBadge>;
};
export default StatusBadge;
