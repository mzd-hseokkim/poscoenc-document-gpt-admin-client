import React from 'react';

export const CSmartTableNoItemLabel = ({ contentLength, isSearchPerformed }) => {
  if (isSearchPerformed && contentLength === 0) {
    return <div style={{ textAlign: 'center', width: '100%' }}>검색 결과가 없습니다.</div>;
  }
  return '';
};
