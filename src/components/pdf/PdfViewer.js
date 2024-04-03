import React, { useMemo, useState } from 'react';

import { CElementCover, CHeader, CRow } from '@coreui/react-pro';
import PdfControlBar from 'components/pdf/PdfControlBar';
import { Document, Page, pdfjs } from 'react-pdf';
import { useRecoilValue } from 'recoil';
import { jwtTokenState } from 'states/jwtTokenState';

import 'components/pdf/pdf-style.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL('pdfjs-dist/build/pdf.worker.min.js', import.meta.url).toString();
const SERVER_ENDPOINT = process.env.REACT_APP_SERVER_ENDPOINT;
const PdfViewer = ({ file }) => {
  const [numPages, setNumPages] = useState(1);
  const [scale, setScale] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const token = useRecoilValue(jwtTokenState);

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
  };

  return (
    <>
      <div className="border-5">
        <CHeader>
          <PdfControlBar
            scale={scale}
            setScale={setScale}
            pageNumber={numPages}
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
              loading={<CElementCover />}
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
                loading={<CElementCover className="pdf-page-loading-cover" />}
                renderTextLayer={false}
                className="mt-1 border justify-content-center d-flex align-items-center"
                renderAnnotationLayer={false}
                width="656"
              />
            </Document>
          </CRow>
        </>
      </div>
    </>
  );
};
export default PdfViewer;
