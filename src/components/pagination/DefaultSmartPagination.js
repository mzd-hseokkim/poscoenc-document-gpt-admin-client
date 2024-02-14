import { useState } from 'react';

import { CSmartPagination } from '@coreui/react-pro';
//TODO implements default pagination
export const DefaultSmartPagination = (pageable) => {
  const [currentPage, setCurrentPage] = useState(1);
  return <CSmartPagination size="lg" activePage={currentPage} pages={10} onActivePageChange={setCurrentPage} />;
};
