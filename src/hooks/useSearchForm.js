import { useCallback, useState } from 'react';

import { format } from 'date-fns';
import { formatToIsoEndDate } from 'utils/common/dateUtils';

export const useSearchForm = (createInitialSearchFormData) => {
  const [isPickTime, setIsPickTime] = useState(false);
  const [stagedSearchFormData, setStagedSearchFormData] = useState(createInitialSearchFormData);

  const handleDateChange = useCallback(
    ({ id, newDate, isStartDate = true }) => {
      const fieldMap = {
        from: `from${id.charAt(0).toUpperCase() + id.slice(1)}`,
        to: `to${id.charAt(0).toUpperCase() + id.slice(1)}`,
      };

      const fieldToUpdate = isStartDate ? fieldMap.from : fieldMap.to;

      if (!fieldToUpdate) {
        return;
      }

      const newFormattedDate = newDate
        ? isPickTime
          ? formatToIsoEndDate(newDate)
          : format(new Date(newDate), "yyyy-MM-dd'T'23:59")
        : null;

      const formattedDate = isStartDate ? format(new Date(newDate), "yyyy-MM-dd'T'00:00") : newFormattedDate;
      setStagedSearchFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
    },
    [isPickTime]
  );

  /**
   * handleTimePickerCheck 함수는 체크박스 상태에 따라 시간 필터링을 설정하거나 초기화합니다.
   *
   * @function
   * @param {Object} e - 이벤트 객체. 체크박스의 체크 상태를 가져오는 데 사용됩니다.
   * @param {string[]} [fields=['createdAt']] - 업데이트할 필드의 배열. 기본값은 ['createdAt']입니다.
   * @returns {void}
   *
   * @description
   * 이 함수는 체크박스의 상태에 따라 시간 필터링 기능을 설정하거나 해제합니다. 체크박스를 체크하면,
   * 선택한 시간 범위를 설정하고, 체크를 해제하면 기존의 설정된 시간 값을 초기화(지정 하지 않음)합니다.
   * 이 과정에서 `from{Field}`와 `to{Field}` 형태의 필드 값을 업데이트합니다.
   *
   * - Param: e - 이벤트 객체. 체크박스의 체크 상태를 가져오는 데 사용됩니다.
   * - Param: string[] - 업데이트할 CDateRangePicker를 사용하는 필드의 배열. 기본값은 ['createdAt']입니다.
   */
  const handleTimePickerCheck = useCallback((e, fields = ['createdAt']) => {
    setIsPickTime(e.target.checked);

    setStagedSearchFormData((prev) => {
      const updatedData = { ...prev };

      fields.forEach((id) => {
        const fromField = `from${id.charAt(0).toUpperCase() + id.slice(1)}`;
        const toField = `to${id.charAt(0).toUpperCase() + id.slice(1)}`;

        if (updatedData[fromField]) {
          updatedData[fromField] = format(new Date(updatedData[fromField]), "yyyy-MM-dd'T'00:00");
        }
        if (updatedData[toField]) {
          updatedData[toField] = format(new Date(updatedData[toField]), "yyyy-MM-dd'T'23:59");
        }
      });

      return updatedData;
    });
  }, []);

  const handleSearchFormChange = useCallback(({ target: { id, value } }) => {
    setStagedSearchFormData((prev) => ({ ...prev, [id]: value }));
  }, []);

  const handleSearchFormReset = useCallback(() => {
    setStagedSearchFormData(createInitialSearchFormData);
    setIsPickTime(false);
  }, [createInitialSearchFormData]);

  return {
    isPickTime,
    stagedSearchFormData,
    handleDateChange,
    handleTimePickerCheck,
    handleSearchFormChange,
    handleSearchFormReset,
  };
};
