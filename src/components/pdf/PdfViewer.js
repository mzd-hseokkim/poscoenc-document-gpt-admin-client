import React, { useMemo, useRef, useState } from 'react';

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
  const pageCanvasRef = useRef(null);

  const options = useMemo(
    () => ({
      httpHeaders: {
        Authorization: `Bearer ${token}`,
      },
    }),
    [token]
  );

  const [pageLoadingIconClassName, setPageLoadingIconClassName] = useState('horizontal-doc');
  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
  };

  const goToPreviousPage = () => {
    setCurrentPage(currentPage > 1 ? currentPage - 1 : 1);
  };

  const goToNextPage = () => {
    setCurrentPage(currentPage < numPages ? currentPage + 1 : numPages);
  };

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
              loading={<CSpinner variant={'grow'} className={`${pageLoadingIconClassName}`} />}
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
                loading={<CSpinner variant={'grow'} className={`pdf-page-loading-cover ${pageLoadingIconClassName}`} />}
                renderTextLayer={false}
                className="d-flex mt-2  justify-content-center align-items-center"
                renderAnnotationLayer={false}
                width={656}
                canvasRef={pageCanvasRef}
              />
            </Document>
            <CButton className="pagination-btn me-2" onClick={goToPreviousPage}>
              <CIcon style={{ height: 20, width: 20, marginTop: 4 }} icon={cilArrowCircleLeft} />
            </CButton>
            <CButton className="pagination-btn" onClick={goToNextPage}>
              <CIcon style={{ height: 20, width: 20, marginTop: 4 }} icon={cilArrowCircleRight} />
            </CButton>
          </CRow>
        </>
      </div>
    </>
  );
};
export default PdfViewer;
