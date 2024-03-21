import { CButton } from '@coreui/react-pro';

const ExcelDownloadCButton = ({ downloadFunction, searchFormData, hasSearchResults }) => {
  const handleDownload = async () => {
    await downloadFunction(searchFormData);
  };

  return (
    <CButton onClick={handleDownload} disabled={!hasSearchResults}>
      엑셀 다운로드
    </CButton>
  );
};

export default ExcelDownloadCButton;
