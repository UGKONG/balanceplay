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
  // },
  colorList: [
    '#f0905a',
    '#b19b0b',
    '#33a07f',
    '#3f9fbc',
    '#76462b',
    '#2b51ad',
    '#792bad',
    '#c023aa',
    '#297e42',
    '#7e295a',
    '#6e762b',
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
