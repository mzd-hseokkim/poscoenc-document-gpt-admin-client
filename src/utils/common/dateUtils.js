import { format, isToday } from 'date-fns';

export const getCurrentDate = () => {
  return format(new Date(), "yyyy-MM-dd'T'23:59");
};

export const getOneYearAgoDate = () => {
  return format(new Date(new Date().setFullYear(new Date().getFullYear() - 1)), "yyyy-MM-dd'T'00:00");
};

export const formatToYMD = (newDate) => {
  if (!newDate) {
    return null;
  }
  const date = new Date(newDate);
  if (isToday(date)) {
    return format(date, 'HH : mm');
  }

  return format(new Date(newDate), 'yyyy/MM/dd');
};

export const formatToIsoStartDate = (newDate) => {
  if (!newDate) {
    return null;
  }
  return format(new Date(newDate), "yyyy-MM-dd'T'HH:mm");
};

export const formatToIsoEndDate = (newDate) => {
  if (!newDate) {
    return null;
  }
  return format(new Date(newDate), "yyyy-MM-dd'T'HH:mm");
};
