import { CSmartPagination } from '@coreui/react-pro';
import { useState } from 'react';

export const DefaultSmartPagination = (pageable) => {
  const [currentPage, setCurrentPage] = useState(1);
  return <CSmartPagination size="lg" activePage={currentPage} pages={10} onActivePageChange={setCurrentPage} />;
};
