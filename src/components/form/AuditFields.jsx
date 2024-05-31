import React, { useState } from 'react';

import { cilChevronBottom, cilChevronTop } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CCard, CCardBody, CCardHeader, CCol, CCollapse } from '@coreui/react-pro';
import FormInputGrid from 'components/input/FormInputGrid';
import { getAuditFields } from 'utils/common/auditFieldUtils';

/**
 * Common Foldable Auditinfo
 *
 * @param formMode
 * for audit fields type, [create , update]
 * @param formData
 * fetched data for audit fields
 * @param isReadMode
 * current form mode
 */
export const AuditFields = ({ formMode, formData, isReadMode }) => {
  const [auditVisible, setAuditVisible] = useState(true);

  return (
    <CCard className="g-3 mb-3">
      <CCardHeader className="h5">
        <CCol sm={5}>
          Audit Info
          <CIcon
            onClick={() => setAuditVisible((prev) => !prev)}
            style={{ cursor: 'pointer' }}
            icon={!auditVisible ? cilChevronBottom : cilChevronTop}
            className="ms-2 icon-lg"
          />
        </CCol>
      </CCardHeader>
      <CCollapse visible={auditVisible}>
        <CCardBody>
          <FormInputGrid fields={getAuditFields(formMode)} formData={formData} isReadMode={isReadMode} col={2} />
        </CCardBody>
      </CCollapse>
    </CCard>
  );
};
