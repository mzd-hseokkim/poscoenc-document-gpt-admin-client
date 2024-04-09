import { useState } from 'react';

const usePagination = (totalItems, defaultSort) => {
  const [pageableData, setPageableData] = useState({
    page: 0,
    size: 10,
    sort: defaultSort || 'id,desc',
  });

  const handlePageChange = (newPage) => {
    setPageableData((prev) => ({
      ...prev,
      page: newPage - 1,
    }));
  };

  const handlePageSizeChange = (newSize) => {
    setPageableData((prev) => ({
      ...prev,
      size: newSize,
      page: 0,
    }));
  };

  const handlePageSortChange = ({ column, state }) => {
    const newSort = `${column},${state}`;
    setPageableData((prev) => ({
      ...prev,
      sort: newSort,
    }));
  };

  const smartPaginationProps = {
    activePage: pageableData.page + 1,
    pages: Math.ceil(totalItems / pageableData.size) || 1,
    onActivePageChange: handlePageChange,
  };

  return {
    pageableData,
    handlePageSizeChange,
    handlePageSortChange,
    smartPaginationProps,
  };
};

export default usePagination;
