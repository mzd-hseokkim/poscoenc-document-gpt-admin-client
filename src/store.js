import { createStore } from 'redux';

//REMIND update to use Redux Toolkit
const initialState = {
  sidebarShow: true,
  asideShow: false,
  theme: 'default',
};

const changeState = (state = initialState, { type, ...rest }) => {
  switch (type) {
    case 'set':
      return { ...state, ...rest };
    default:
      return state;
  }
};

const store = createStore(changeState);
export default store;
