import { jwtDecode as decodeJwt } from 'jwt-decode';
import { atom, selector } from 'recoil';

export const jwtTokenState = atom({
  key: 'JwtTokenState',
  default: undefined,
});

export const isSignedInSelector = selector({
  key: 'isSignedInSelector',
  get: ({ get }) => !!get(jwtTokenState),
});

export const userIdSelector = selector({
  key: 'UserIdSelector',
  get: ({ get }) => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decoded = decodeJwt(token);
        //REMIND 테스트용으로 name 넣어둠. 추후 id 로 변경
        return decoded.name; // 토큰에 따라 'sub' 또는 다른 필드일 수 있음
      } catch (error) {
        console.error('JWT 디코딩 중 오류 발생', error);
        return undefined;
      }
    }
    return undefined;
  },
});
