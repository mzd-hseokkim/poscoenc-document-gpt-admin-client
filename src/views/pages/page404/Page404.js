import React from 'react';

import { cilHome } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCol, CContainer, CRow } from '@coreui/react-pro';
import { useNavigate } from 'react-router-dom';

const Page404 = () => {
  const navigate = useNavigate();

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={6}>
            <div className="clearfix">
              <h1 className="float-start display-3 me-4">404 ERROR</h1>
              <h4 className="pt-3">Page Not Found</h4>
              <p className="text-medium-emphasis float-start">요청하신 페이지를 찾을 수 없습니다.</p>
            </div>
            <CCol className="d-grid gap-2 d-md-flex justify-content-md-end">
              <CButton onClick={() => navigate('/')}>
                <CIcon icon={cilHome} /> 홈으로
              </CButton>
            </CCol>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  );
};

export default Page404;
