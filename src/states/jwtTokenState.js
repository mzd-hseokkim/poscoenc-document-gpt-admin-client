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
        return decoded.id;
      } catch (error) {
        console.error('JWT 디코딩 중 오류 발생', error);
        return undefined;
      }
    }
    return undefined;
  },
});
