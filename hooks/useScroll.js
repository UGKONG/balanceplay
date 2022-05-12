import { useState, useEffect } from "react";

export default function useScroll(ref) {
  const [state, setState] = useState(0);
  const onScroll = () => setState(window.scrollY);
  useEffect(() => {
    ref?.current && ref?.current.addEventListener('scroll', onScroll);
    return () => ref?.current && ref?.current.removeEventListener('scroll', onScroll);
  }, []);
  
  return state;
}