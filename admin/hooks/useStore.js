import create from "zustand";

const store = create(set => ({
  temp: null,
  isLogin: null,
  setting: null,
  surveySendData: [],
  isFullPage: false,
  setState: (type, payload) => set(state => {
    if (!type) return console.warn('type is not found!!');
    if (typeof (type) !== 'string') return console.warn('type is not string!!');
    return state[type] = payload;
  })
}));

export default store;