import React, { useContext } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';
import useAlert from '%/useAlert';
import { Store } from './Scheduler';
import { useMemo } from 'react';

export default function 프레임내부박스({
  date,
  time,
  item,
  isMouseDown,
  setIsMouseDown,
  moveRange,
  setMoveRange,
  isFinish,
}) {
  const { active, setWriteInfo, calendarList } = useContext(Store);

  const id = useMemo(() => {
    let d = date?.replaceAll('-', '');
    let t = (time + item?.ms)?.replaceAll(':', '');
    return Number(d + t);
  }, [date, time, item?.id]);

  const mouseDown = () => {
    if (isFinish) return;
    if (active?.calendar === 0) {
      return useAlert.info('알림', '캘린더를 선택해주세요.');
    }
    setIsMouseDown(true);
    setMoveRange({ start: id, end: id });
  };

  const mouseUp = () => {
    if (isFinish || !moveRange || !isMouseDown) return;
    let { start: s, end: e } = moveRange;
    s = String(s);
    e = String(e);

    let d = `${s?.slice(0, 4)}-${s?.slice(4, 6)}-${s?.slice(6, 8)}`;
    let t1 = `${s?.slice(8, 10)}:${s?.slice(10, 12)}:${s?.slice(12, 14)}`;
    let t2 = `${e?.slice(8, 10)}:${e?.slice(10, 12)}:${e?.slice(12, 14)}`;

    let end = new Date(d + ' ' + t2);
    end.setMinutes(end.getMinutes() + 15);
    t2 = useDate(end, 'time');

    let calendarFind = calendarList?.find((x) => x?.ID === active?.calendar);
    calendarFind = calendarFind ? calendarFind?.TYPE : 0;

    setWriteInfo({
      CALENDAR_ID: active?.calendar,
      CALENDAR_TYPE: calendarFind,
      START_DATE: d,
      END_DATE: d,
      START_TIME: t1,
      END_TIME: t2,
    });

    setMoveRange(null);
    setIsMouseDown(false);
  };

  const mouseMove = (e) => {
    if (
      isFinish ||
      !isMouseDown ||
      !moveRange?.start ||
      id === moveRange?.end
    ) {
      return;
    }

    if (id < moveRange?.start) {
      setMoveRange(null);
      setIsMouseDown(false);
      return;
    }
    setMoveRange((prev) => ({ ...prev, end: id }));
  };

  const dragStyle = useMemo(() => {
    if (!moveRange) return null;
    let { start, end } = moveRange;
    let validate1 = start <= id;
    let validate2 = id <= end;

    let result = validate1 && validate2 ? '#b9e1dc40' : 'transparent';
    return { backgroundColor: result };
  }, [moveRange, id]);

  return (
    <Container
      onMouseDown={mouseDown}
      onMouseUp={mouseUp}
      onMouseMove={mouseMove}
      className={isFinish ? 'finish' : 'not-finish'}
      style={dragStyle}
    />
  );
}

const Container = Styled.div`
  &.not-finish {
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
      background-color: #b9e1dc40 !important;
    }
  }
`;
