// 리액트 라우터 페이지 전환 애니메이션 함수
import React, { useEffect, useMemo, useRef } from "react";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import useStore from '%/useStore';

export default function PageAnimate (props) {
  const dispatch = useStore(x => x.setState);
  const scroll = useStore(x => x.scroll);
  const location = useLocation();
  if (!props.children) return <main></main>;
  let duration = props.duration || .3;
  let name = props.name;
  let style = props?.style ?? null;
  let _in, _out;
  let _ref = useRef(null);

  useEffect(() => dispatch('activePageRef', (props?.el ?? _ref)?.current), []);
  useEffect(() => dispatch('scroll', 0), [location]);

  switch (name) {
    case 'fade':
      _in = { opacity: 1 }
      _out = { opacity: 0 }
      break;
    case 'slide-left':
      _in = { x: 0, opacity: 1 }
      _out = { x: 20, opacity: 0 }
      break;
    case 'slide-right':
      _in = { x: 0, opacity: 1 }
      _out = { x: -20, opacity: 0 }
      break;
    case 'slide-up':
      _in = { y: 0, opacity: 1 }
      _out = { y: 20, opacity: 0 }
      break;
    case 'slide-down':
      _in = { y: 0, opacity: 1 }
      _out = { y: -20, opacity: 0 }
      break;
    case 'scale':
      _in = { transform: 'scale(1)' }
      _out = { transform: 'scale(0)' }
      break;
    case 'scale-rotate':
      _in = { transform: 'scale(1) rotate(0deg)' }
      _out = { transform: 'scale(0) rotate(360deg)' }
      break;
    default:
      _in = { opacity: 1 }
      _out = { opacity: 0 }
  }

  const onScroll = e => dispatch('scroll', e.target?.scrollTop ?? 0);

  return (
    <motion.main
      ref={props?.el ?? _ref}
      initial={_out}
      animate={_in}
      exit={_out}
      transition={{ duration }}
      style={style}
      onScroll={onScroll}
      className='main'
    >
      {props.children}
    </motion.main>
  )
}