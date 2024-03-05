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
    const token = get(jwtTokenState);
    if (!token) {
      return undefined;
    }
    const decoded = decodeJwt(token);
    return decoded.id;
  },
});

export const userRoleSelector = selector({
  key: 'userRoleSelector',
  get: ({ get }) => {
    const token = get(jwtTokenState);
    if (!token) {
      return undefined;
    }
    const decodedToken = decodeJwt(token);
    return decodedToken.roles;
  },
});
