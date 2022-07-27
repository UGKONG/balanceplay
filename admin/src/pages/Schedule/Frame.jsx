import React, { useEffect, useMemo, useState, useContext } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';
import useAlert from '%/useAlert';
import { Store } from './Scheduler';

export default function 스케줄러_프레임({ date, i, dayCount }) {
  const [now, setNow] = useState(useDate());
  const { active, currentHourList, setWriteInfo, calendarList } =
    useContext(Store);

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
    if (active?.calendar === 0) {
      return useAlert.info('알림', '캘린더를 선택해주세요.');
    }

    let defaultEndTime = new Date(date + ' ' + time);
    defaultEndTime?.setHours(defaultEndTime?.getHours() + 1);
    defaultEndTime = useDate(defaultEndTime, 'time');
    let calendarFind = calendarList?.find((x) => x?.ID === active?.calendar);
    calendarFind = calendarFind ? calendarFind?.TYPE : 0;
    setWriteInfo({
      CALENDAR_ID: active?.calendar,
      CALENDAR_TYPE: calendarFind,
      START_DATE: date,
      END_DATE: date,
      START_TIME: time,
      END_TIME: defaultEndTime,
    });
  };

  useEffect(getDate, []);

  return (
    <>
      {i === 0 && (
        <NowBar w={dayCount} style={nowBarTop}>
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
