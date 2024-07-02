import React from 'react';

export const CSmartTableNoItemLabel = ({ contentLength, isSearchPerformed, isLoading, defaultMessage = '' }) => {
  if (isLoading) {
    return <div style={{ height: '1.5rem' }}></div>;
  }

  const message = isSearchPerformed && contentLength === 0 ? '검색 결과가 없습니다.' : defaultMessage;

  return <div style={{ textAlign: 'center', width: '100%' }}>{message}</div>;
};
