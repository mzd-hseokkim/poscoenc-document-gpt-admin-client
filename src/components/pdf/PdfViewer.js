import React, { useEffect, useMemo, useRef, useState } from 'react';

import { cilArrowCircleLeft, cilArrowCircleRight } from '@coreui/icons';
import CIcon from '@coreui/icons-react';
import { CButton, CHeader, CRow, CSpinner } from '@coreui/react-pro';
import PdfControlBar from 'components/pdf/PdfControlBar';
import { Document, Page, pdfjs } from 'react-pdf';
import { useRecoilValue } from 'recoil';
import { jwtTokenState } from 'states/jwtTokenState';

import 'components/pdf/pdf-style.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;
const PdfViewer = ({ file, visible }) => {
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const token = useRecoilValue(jwtTokenState);
  const [pageHeight, setPageHeight] = useState('100px');
  const options = useMemo(
    () => ({
      httpHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);

    if (scrollToViewer.current && visible) {
      setTimeout(() => {
        scrollToViewer.current.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 300);
    }
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage < numPages ? currentPage + 1 : numPages);
  };

  const scrollToViewer = useRef(null);

  useEffect(() => {
    if (visible) {
      const canvasElement = document.querySelector('.react-pdf__Page__canvas');
      if (canvasElement) {
        setPageHeight(`${canvasElement.offsetHeight}px`);
      }
    }
  }, [currentPage, visible]);
  if (!visible) return;

  return (
    <>
      <div className="border-5">
        <CHeader>
          <PdfControlBar
            scale={scale}
            setScale={setScale}
            numPages={numPages}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
          />
        </CHeader>
        <>
          <CRow className="justify-content-center">
            <Document
              className="pdf-viewer-document"
              file={`${SERVER_ENDPOINT}/admin/document-collection-files/download/${file.id}`}
              onLoadSuccess={onDocumentLoadSuccess}
              loading={
                <div style={{ minHeight: '100px', minWidth: '100px' }} className="pdf-page-loading-cover">
                  <CSpinner variant={'grow'} color={'primary'} />
                </div>
              }
              error={
                <div className="d-flex justify-content-center bold">{'PDF 파일을 로딩하는 데에 실패하였습니다.'}</div>
              }
              renderMode="canvas"
              options={options}
              externalLinkTarget="_blank"
            >
              <Page
                pageNumber={currentPage}
                scale={scale}
                error="PDF 파일을 로딩하는 데에 실패하였습니다."
                loading={
                  <div style={{ minHeight: pageHeight, minWidth: '100px' }} className="pdf-page-loading-cover">
                    <CSpinner variant={'border'} color={'primary'} />
                  </div>
                }
                renderTextLayer={false}
                className="d-flex mt-2  justify-content-center align-items-center border"
                renderAnnotationLayer={false}
                width={656}
              />
            </Document>
            <CRow ref={scrollToViewer} className="mt-2 d-flex justify-content-center">
              <CButton className="pagination-btn me-2" onClick={goToPreviousPage}>
                <CIcon style={{ height: 20, width: 20, marginTop: 4 }} icon={cilArrowCircleLeft} />
              </CButton>
              <CButton className="pagination-btn" onClick={goToNextPage}>
                <CIcon style={{ height: 20, width: 20, marginTop: 4 }} icon={cilArrowCircleRight} />
              </CButton>
            </CRow>
          </CRow>
        </>
      </div>
    </>
  );
};
export default PdfViewer;
