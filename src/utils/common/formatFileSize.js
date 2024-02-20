export const formatFileSize = (bytes, decimals = 2) => {
  if (bytes === 0) {
    return '0 bytes';
  }

  const kilobyte = 1024;
  const decimalPlaces = decimals < 0 ? 0 : decimals;
  const sizeUnit = ['Bytes', 'KB', 'MB', 'GB'];
  const unitIndex = Math.floor(Math.log(bytes) / Math.log(kilobyte));

  return `${parseFloat((bytes / Math.pow(kilobyte, unitIndex)).toFixed(decimalPlaces))} ${sizeUnit[unitIndex]}`;
};
