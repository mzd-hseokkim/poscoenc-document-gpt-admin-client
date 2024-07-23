import { configureStore, createSlice } from '@reduxjs/toolkit';

const layoutState = {
  sidebarShow: true,
  asideShow: false,
  theme: 'default',
};

const layoutSlice = createSlice({
  name: 'layout',
  initialState: layoutState,
  reducers: {
    set(state, action) {
      return { ...state, ...action.payload };
    },
  },
});

export const { set } = layoutSlice.actions;

const store = configureStore({
  reducer: {
    layout: layoutSlice.reducer,
  },
});

export default store;
