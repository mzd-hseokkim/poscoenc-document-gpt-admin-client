import React from 'react';

import { CBadge } from '@coreui/react-pro';

const translate = (deleted) => {
  if (deleted == null) {
    return 'No-Data';
  }
  return deleted ? 'Deleted' : '';
};
const getBadgeColor = (deleted) => {
  switch (deleted) {
    case true:
      return 'dark';
    default:
      return 'primary';
  }
};

const DeletionStatusBadge = ({ deleted }) => {
  return (
    <CBadge className="justify-content-center opacity-75" color={getBadgeColor(deleted)}>
      {translate(deleted)}
    </CBadge>
  );
};
export default DeletionStatusBadge;
