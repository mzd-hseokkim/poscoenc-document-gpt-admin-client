import React from 'react';

import { CSpinner } from '@coreui/react-pro';

const AdminPageGlobalLoadingCover = () => {
  return (
    <div className="global-loading-cover-position">
      <CSpinner color="primary" variant="border" className="global-loading-cover" />
    </div>
  );
};

export default AdminPageGlobalLoadingCover;
