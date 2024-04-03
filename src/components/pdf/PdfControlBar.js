import React from 'react';

import { cilArrowCircleLeft, cilArrowCircleRight, cilMinus, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCol, CRow } from '@coreui/react-pro';

const PdfControlBar = ({ scale, setScale, pageNumber, currentPage, setCurrentPage }) => {
  const goToPreviousPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage < pageNumber ? currentPage + 1 : pageNumber);
  };

  const zoomOut = () => {
    setScale((s) => (s <= 0.5 ? 0.5 : s - 0.25));
  };
  const zoomIn = () => {
    setScale((s) => (s >= 3.0 ? 3.0 : s + 0.25));
  };

  const magnification = scale * 100;

  return (
    <>
      <CRow className="d-flex">
        <CCol md={6} className="d-flex justify-content-start align-items-center">
          <CButton onClick={zoomIn} className="m-2">
            <CIcon icon={cilPlus} />
          </CButton>
          <div className="border rounded" style={{ width: '70px' }}>
            <div className="m-2 fw-bold text-center">{`${magnification}%`}</div>
          </div>
          <CButton onClick={zoomOut} className="m-2">
            <CIcon icon={cilMinus} />
          </CButton>
        </CCol>
        <CCol md={6} className="d-flex justify-content-end align-items-center">
          <CButton className="pagination-btn me-2" onClick={goToPreviousPage}>
            <CIcon style={{ height: 20, width: 20, marginTop: 4 }} icon={cilArrowCircleLeft} />
          </CButton>
          <div className="border rounded me-2 justify-content-center">
            <div className="m-2 fw-bold text-center" style={{ width: '100px' }}>
              {`${currentPage}p`}
            </div>
          </div>
          <CButton className="pagination-btn" onClick={goToNextPage}>
            <CIcon
              style={{ height: 20, width: 20, marginTop: 4 }}
              className="pagination-btn-icon"
              icon={cilArrowCircleRight}
            />
          </CButton>
        </CCol>
      </CRow>
    </>
  );
};

export default PdfControlBar;
