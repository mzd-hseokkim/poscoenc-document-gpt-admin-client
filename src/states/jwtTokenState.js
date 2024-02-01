import { atom, selector } from 'recoil';

export const jwtTokenState = atom({
  key: 'JwtTokenState',
  default: undefined,
});

export const isSignedInSelector = selector({
  key: 'isSignedInSelector',
  get: ({ get }) => !!get(jwtTokenState),
});
