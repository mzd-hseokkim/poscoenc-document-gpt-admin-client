export const uriUtil = (uri) => {
  const dynamicSegmentPattern = /\/(\d+|[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{4}-[0-9a-fA-F]{12})$/;
  return uri.replace(dynamicSegmentPattern, '');
};
