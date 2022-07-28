import React, { useRef, useEffect, useMemo, useState, useContext } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';
import { Store } from './Scheduler';
import FrameSmallBox from './FrameSmallBox';

export default function 스케줄러_프레임({ date, i, dayCount }) {
  const sBoxList = useRef([
    { id: 1, ms: ':00:00' },
    { id: 2, ms: ':15:00' },
    { id: 3, ms: ':30:00' },
    { id: 4, ms: ':45:00' },
  ]);
  const [now, setNow] = useState(useDate());
  const { active, currentHourList } = useContext(Store);
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [moveRange, setMoveRange] = useState(null);

  const getDate = () => {
    if (i !== 0) return;
    let interval;
    interval = setInterval(() => setNow(useDate()), 1000 * 1);
    return () => clearInterval(interval);
  };

  const nowBarTop = useMemo(() => {
    let time = now?.split(' ')[1];
    let [h, m] = time?.split(':')?.map((t) => Number(t));
    let idxH = currentHourList?.findIndex((x) => x == h);
    h = idxH * 100;
    m = ((m / 60) * 100) / currentHourList?.length;
    return { top: `calc(${h}px + ${m}%)` };
  }, [now, currentHourList]);

  const mouseLeave = () => {
    setIsMouseDown(false);
    setMoveRange(null);
  };

  useEffect(getDate, []);

  return (
    <article onMouseLeave={mouseLeave}>
      {i === 0 && (
        <NowBar w={dayCount} style={nowBarTop} view={active?.view}>
          <span />
        </NowBar>
      )}
      {currentHourList?.map((time, ii) => (
        <Box key={time}>
          {sBoxList?.current?.map((item) => (
            <FrameSmallBox
              key={item?.id}
              item={item}
              date={date}
              time={time}
              isMouseDown={isMouseDown}
              setIsMouseDown={setIsMouseDown}
              moveRange={moveRange}
              setMoveRange={setMoveRange}
              isFinish={currentHourList?.length === ii + 1}
            />
          ))}
        </Box>
      ))}
    </article>
  );
}

const Box = Styled.article`
  height: 100px;
  font-size: 12px;
  color: #555;
  border-bottom: 1px solid #b9e1dc99;
  &:last-of-type {
    border-bottom: none;
    background-color: #e1dfdf59;
  }
`;
const NowBar = Styled.p`
  position: absolute;
  top: 0;
  right: calc(${(x) => (x?.view === 4 ? 0 : -600)}% - 12px);
  width: calc(${(x) => x?.w} * 100% + 12px);
  height: 2px;
  background-color: #ff000030;
  z-index: 10;

  span {
    position: relative;
    display: block;
    width: 100%;
    height: 100%;

    &::after {
      content: '';
      position: absolute;
      top: 50%;
      right: 100%;
      transform: translateY(-50%);
      width: 7px;
      height: 7px;
      background-color: #ff000066;
      border-radius: 20px;
      color: #fff;
    }
  }
`;
