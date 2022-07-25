import create from 'zustand';

const store = create((set) => ({
  temp: null,
  isLogin: null,
  setting: null,
  surveySendData: [],
  confirmInfo: null,
  // {
  //   mainTitle: '',
  //   subTitle: '',
  //   yesFn: () => {},
  //   setState: () => {},
  // },
  colorList: [
    '#666',
    '#f05a5a',
    '#f0905a',
    '#c0a90d',
    '#33a07f',
    '#2b51ad',
    '#792bad',
    '#c023aa',
  ],
  isFullPage: false,
  setState: (type, payload) =>
    set((state) => {
      if (!type) return console.warn('type is not found!!');
      if (typeof type !== 'string') return console.warn('type is not string!!');
      return (state[type] = payload);
    }),
}));

export default store;
