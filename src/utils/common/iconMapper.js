import React from 'react';

import * as CoreUiIcons from '@coreui/icons';
import CIcon from '@coreui/icons-react';

export const iconMapper = ({ iconName, type }) => {
  if (!iconName) {
    return null;
  }
  const icon = CoreUiIcons[iconName];
  const className = type === 'nav' ? 'nav-icon' : '';

  return <CIcon icon={icon} customClassName={className} />;
};
