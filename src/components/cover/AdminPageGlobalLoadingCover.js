import React from 'react';

import { CSpinner } from '@coreui/react-pro';

const spinnerDivStyle = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  position: 'relative',
  transform: 'translateY(-20%)',
};

const spinnerStyle = { width: '4rem', height: '4rem', '--cui-spinner-border-width': '10px' };
const AdminPageGlobalLoadingCover = () => {
  return (
    <div style={spinnerDivStyle}>
      <CSpinner color="primary" variant="border" style={spinnerStyle} />
    </div>
  );
};

export default AdminPageGlobalLoadingCover;
