import { useCallback, useState } from 'react';

import { format } from 'date-fns';

export const useSearchForm = (createInitialSearchFormData) => {
  const [isPickTime, setIsPickTime] = useState(false);
  const [stagedSearchFormData, setStagedSearchFormData] = useState(createInitialSearchFormData);

  const handleDateChange = useCallback(
    ({ id, newDate, isStartDate = true }) => {
      const fieldMap = {
        createdAt: isStartDate ? 'fromCreatedAt' : 'toCreatedAt',
      };
      const fieldToUpdate = fieldMap[id];

      if (!fieldToUpdate) {
        return;
      }

      const newFormattedDate = newDate
        ? isPickTime
          ? format(new Date(newDate), "yyyy-MM-dd'T'23:59")
          : format(new Date(newDate), "yyyy-MM-dd'T'23:59")
        : null;

      const formattedDate = isStartDate ? format(new Date(newDate), "yyyy-MM-dd'T'00:00") : newFormattedDate;
      setStagedSearchFormData((prev) => ({ ...prev, [fieldToUpdate]: formattedDate }));
    },
    [isPickTime]
  );

  const handleTimePickerCheck = useCallback((e) => {
    setIsPickTime(e.target.checked);
    setStagedSearchFormData((prev) => ({
      ...prev,
      fromCreatedAt: format(new Date(prev.fromCreatedAt), "yyyy-MM-dd'T'00:00"),
      toCreatedAt: format(new Date(prev.toCreatedAt), "yyyy-MM-dd'T'23:59"),
    }));
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
