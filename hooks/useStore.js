import create from "zustand";
import useAxios from '%/useAxios';
import { useNavigate } from "react-router-dom";

const store = create(set => ({
  temp: null,
  activeSideMneu: false,
  scroll: 0,
  isLogin: null,
  setState: (type, payload) => set(state => {
    if (!type) return console.warn('type is not found!!');
    if (typeof(type) !== 'string') return console.warn('type is not string!!');
    return state[type] = payload;
  })
}));

export default store;