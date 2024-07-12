/**
 *
 * @param data 연-월 속성을 가진 데이터들의 배열을 받습니다. ex. [ { aggregationKey: "2022-11", value: 40 }, ...]
 * @param prop data 내부의 연-월 속성을 가진 prop name 을 받습니다. ex. aggragationKey
 * @returns 연-월 순으로 정렬된 data를 반환합니다.
 *
 * @description
 * Chart 를 그리기 위해 월 기준으로 정렬하는 함수입니다.
 */
const sortByPropertyKey = function (data, prop) {
  return data.sort((a, b) => {
    const [yearA, monthA] = a[prop].split('-').map(Number);
    const [yearB, monthB] = b[prop].split('-').map(Number);

    if (yearA !== yearB) {
      return yearA - yearB;
    } else {
      return monthA - monthB;
    }
  });
};

export default sortByPropertyKey;
