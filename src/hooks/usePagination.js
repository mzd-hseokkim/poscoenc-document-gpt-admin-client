import { useState } from 'react';

const usePagination = (totalItems) => {
  const [pageableData, setPageableData] = useState({
    page: 0,
    size: 10,
    sort: 'id,asc',
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
      page: 0, // 크기가 변경되면 페이지를 초기화합니다.
    }));
  };

  const handlePageSortChange = (sorterValue) => {
    const newSort = `${sorterValue.column},${sorterValue.state}`;
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
