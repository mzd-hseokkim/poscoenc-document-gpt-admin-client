import React from 'react';

import { CElementCover, CSpinner } from '@coreui/react-pro';

const FormLoadingCover = ({ isLoading }) =>
  isLoading ? (
    <CElementCover>
      <CSpinner variant="grow" color="primary" />
    </CElementCover>
  ) : null;
export default FormLoadingCover;
