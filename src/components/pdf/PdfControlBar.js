import React, { useEffect, useState } from 'react';

import { cilMagnifyingGlass, cilMinus, cilPlus } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CCol, CFormInput, CPopover } from '@coreui/react-pro';

const PdfControlBar = ({ scale, setScale, numPages, currentPage, setCurrentPage }) => {
  const [inputValue, setInputValue] = useState(currentPage || 1);
  const [popoverVisible, setPopoverVisible] = useState(false);
  const [popoverMessage, setPopoverMessage] = useState('');

  useEffect(() => {
    setInputValue(currentPage);

    let timer;
    if (popoverVisible) {
      timer = setTimeout(() => {
        setPopoverVisible(false);
      }, 2200);
    }
    return () => clearTimeout(timer);
  }, [currentPage, popoverVisible]);

  const zoomOut = () => {
    setScale((s) => (s <= 0.5 ? 0.5 : s - 0.25));
  };
  const zoomIn = () => {
    setScale((s) => (s >= 3.0 ? 3.0 : s + 0.25));
  };

  const magnification = scale * 100;

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleGoButtonClick = () => {
    setPopoverVisible(false);
    const pageNumber = parseInt(inputValue, 10);
    if (isNaN(pageNumber)) {
      setPopoverMessage(`숫자를 입력해주세요. 입력 값 : ${inputValue}`);
      setPopoverVisible(true);
    } else if (pageNumber < 1 || pageNumber > numPages) {
      setPopoverMessage(`입력한 페이지 번호가 범위를 초과했습니다. 입력 값 : ${inputValue}`);
      setPopoverVisible(true);
    } else {
      setCurrentPage(pageNumber);
    }
  };

  return (
    <>
      <CCol md={6} className="d-flex align-items-center">
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
        <CCol className="d-flex justify-content-end align-items-center bold ">
          <CFormInput
            className="form-control bold text-center"
            value={inputValue}
            onChange={handleInputChange}
            style={{ width: '60px', marginRight: '8px' }}
          />
          <span> of {`${numPages} p`}</span>
        </CCol>
        <CPopover
          content={popoverMessage}
          placement="bottom"
          //REMIND Using Popper.js props, not public in CoreUI
          trigger="manual"
          visible={popoverVisible}
        >
          <CButton className="pagination-btn" style={{ marginLeft: '8px' }} onClick={handleGoButtonClick}>
            <CIcon style={{ height: 20, width: 20, marginTop: 4 }} icon={cilMagnifyingGlass} />
          </CButton>
        </CPopover>
      </CCol>
    </>
  );
};

export default PdfControlBar;
