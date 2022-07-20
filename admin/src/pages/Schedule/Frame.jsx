import React, { useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';

export default function 스케줄러_프레임({ date, i, currentHourList }) {
  const [now, setNow] = useState(useDate());

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

  const click = (date, time) => {
    console.log(date, time);
  };

  useEffect(getDate, []);

  return (
    <>
      {i === 0 && (
        <NowBar style={nowBarTop}>
          <span />
        </NowBar>
      )}
      {currentHourList?.map((time) => (
        <Box key={time}>
          <div onClick={() => click(date, time + ':00:00')} />
          <div onClick={() => click(date, time + ':15:00')} />
          <div onClick={() => click(date, time + ':30:00')} />
          <div onClick={() => click(date, time + ':45:00')} />
        </Box>
      ))}
    </>
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
  &:not(&:last-of-type) > div {
    width: 100%;
    height: 25%;
    background-color: transparent;
    border-bottom: 1px dashed #e8e6e6;
    cursor: pointer;
    position: relative;
    z-index: 2;
    &:last-of-type {
      border-bottom: none;
    }
    &:hover {
      background-color: #b9e1dc40;
    }
  }
`;
const NowBar = Styled.p`
  position: absolute;
  top: 0;
  right: calc(-600% - 12px);
  width: calc(700% + 12px);
  height: 2px;
  background-color: #ff000066;
  z-index: 2;

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
