import React from 'react';

import { flagSet } from '@coreui/icons';
import { CCard, CCardBody, CCardHeader, CRow } from '@coreui/react-pro';
import { DocsCallout } from 'src/components';
import { getIconsView } from 'views/icons/brands/Brands.js';

const CoreUIIcons = () => {
  return (
    <>
      <DocsCallout
        name="CoreUI Flag Icons"
        href="components/chart"
        content="CoreUI Flag Icons. CoreUI Icons package is delivered with more than 1500 icons in multiple formats SVG, PNG, and Webfonts. CoreUI Icons are beautifully crafted symbols for common actions and items. You can use them in your digital products for web or mobile app."
      />
      <CCard className="mb-4">
        <CCardHeader>Flag Icons</CCardHeader>
        <CCardBody>
          <CRow className="text-center">{getIconsView(flagSet)}</CRow>
        </CCardBody>
      </CCard>
    </>
  );
};

export default CoreUIIcons;
