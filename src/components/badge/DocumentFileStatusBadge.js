import React from 'react';

import { CBadge } from '@coreui/react-pro';

const fileStatusArray = [
  { status: 'PENDING', color: 'secondary' },
  { status: 'INGESTING', color: 'warning' },
  { status: 'COMPLETED', color: 'success' },
  { status: 'FAILED', color: 'danger' },
];
const DocumentFileStatusBadge = ({ status }) => {
  const selectedColor = fileStatusArray.find((item) => item.status === status)?.color;

  return <CBadge color={selectedColor || 'primary'}>{status}</CBadge>;
};
export default DocumentFileStatusBadge;
