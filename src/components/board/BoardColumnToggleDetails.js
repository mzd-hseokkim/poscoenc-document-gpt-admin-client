import { useCallback } from 'react';

export const useToggleDetails = (details, setDetails) => {
  return useCallback(
    (id) => {
      const position = details.indexOf(id);
      let newDetails = [...details]; // 새 배열 생성
      if (position !== -1) {
        newDetails.splice(position, 1); // id 제거
      } else {
        newDetails.push(id); // id 추가
      }
      setDetails(newDetails); // 상태 업데이트
    },
    [details, setDetails]
  );
};
