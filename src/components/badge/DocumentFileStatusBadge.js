import React from 'react';

import { CBadge } from '@coreui/react-pro';

const fileStatusArray = [
  { status: 'PENDING', color: 'secondary' },
  { status: 'INGESTING', color: 'warning' },
  { status: 'COMPLETED', color: 'success' },
  { status: 'FAILED', color: 'danger' },
];
const DocumentFileStatusBadge = ({ fileStatus }) => {
  const selectedColor = fileStatusArray.find((item) => item.status === fileStatus)?.color;

  return <CBadge color={selectedColor || 'primary'}>{fileStatus}</CBadge>;
};
export default DocumentFileStatusBadge;
