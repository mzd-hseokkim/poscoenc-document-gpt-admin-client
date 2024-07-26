import { configureStore, createSlice } from '@reduxjs/toolkit';

const serverStatusSlice = createSlice({
  name: 'serverStatus',
  initialState: { isServerDown: false },
  reducers: {
    setServerDown(state, action) {
      return { ...state, isServerDown: action.payload };
    },
  },
});

export const { setServerDown } = serverStatusSlice.actions;

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
    serverStatus: serverStatusSlice.reducer,
  },
});

export default store;
