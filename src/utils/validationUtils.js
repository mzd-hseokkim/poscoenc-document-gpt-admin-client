const userEmailPartPattern = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@/;
const userDomainPartPattern = /((\[\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
export const emailValidationPattern = new RegExp(userEmailPartPattern.source + userDomainPartPattern.source);

export const nameValidationPattern = /^[^\n\r\t]*$/;

export const passwordValidationPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/;

export const menuNameValidationPattern = /^[가-힣A-Za-z0-9\s]*$/;
