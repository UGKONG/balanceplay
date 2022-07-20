import React, { useEffect, useRef, useState } from 'react';
import Styled from 'styled-components';
import { FiArrowLeft, FiArrowRight } from 'react-icons/fi';
import useDate from '%/useDate';
import { MdOutlineRefresh } from 'react-icons/md';

export default function 스케줄해더({ active, setActive, getSchedule }) {
  const viewTypeList = useRef([
    { id: 1, name: '년' },
    { id: 2, name: '월' },
    { id: 3, name: '주' },
    { id: 4, name: '일' },
  ]);

  const prev = () => {
    let start = new Date(active?.start);
    let end = new Date(active?.end);

    if (active?.view === 1) {
      // 년
      let y = start.getFullYear() - 1;
      start.setFullYear(y);
      start.setMonth(0);
      start.setDate(1);
      end.setFullYear(y);
      end.setMonth(11);
      end.setDate(31);
    }

    if (active?.view === 2) {
      // 월
      start.setDate(start.getDate() - 1);
      start.setDate(1);
      end.setDate(start.getDate() - 1);
    }

    if (active?.view === 3) {
      // 주
      start.setDate(start.getDate() - 7);
      end.setDate(end.getDate() - 7);
    }

    if (active?.view === 4) {
      // 일
      start.setDate(start.getDate() - 1);
      end.setDate(end.getDate() - 1);
    }

    setActive((prev) => ({ ...prev, start: useDate(start, 'date') }));
    setActive((prev) => ({ ...prev, end: useDate(end, 'date') }));
  };

  const next = () => {
    let start = new Date(active?.start);
    let end = new Date(active?.end);

    if (active?.view === 1) {
      let y = start.getFullYear() + 1;
      start.setFullYear(y);
      start.setMonth(0);
      start.setDate(1);
      end.setFullYear(y);
      end.setMonth(11);
      end.setDate(31);
    }

    if (active?.view === 2) {
      // 월
      start.setDate(end.getDate() + 1);
      end.setDate(end.getDate() + 1);
      end.setMonth(end.getMonth() + 1);
      end.setDate(1);
      end.setDate(end.getDate() - 1);
    }

    if (active?.view === 3) {
      // 주
      start.setDate(start.getDate() + 7);
      end.setDate(end.getDate() + 7);
    }

    if (active?.view === 4) {
      // 일
      start.setDate(start.getDate() + 1);
      end.setDate(end.getDate() + 1);
    }

    setActive((prev) => ({ ...prev, start: useDate(start, 'date') }));
    setActive((prev) => ({ ...prev, end: useDate(end, 'date') }));
  };

  return (
    <Container>
      <Left>
        <LeftArrow onClick={prev} />
        <span>
          {active?.start?.split('-')[0]}년 {active?.start?.split('-')[1]}월{' '}
          {active?.start?.split('-')[2]}일
        </span>
        <span>~</span>
        <span>
          {active?.end?.split('-')[0]}년 {active?.end?.split('-')[1]}월{' '}
          {active?.end?.split('-')[2]}일
        </span>
        <RightArrow onClick={next} />
      </Left>
      <Right>
        <ReloadBtn onClick={getSchedule} />
        {viewTypeList?.current?.map((item) => (
          <ViewItem
            key={item?.id}
            className={active?.view === item?.id ? 'active' : ''}
            onClick={() => setActive((prev) => ({ ...prev, view: item?.id }))}
          >
            {item?.name}
          </ViewItem>
        ))}
      </Right>
    </Container>
  );
}

const Container = Styled.article`
  height: 35px;
  border-bottom: 1px solid #b9e1dc;
  display: flex;
  align-items: center;
  justify-content: space-between;
  overflow: hidden;
  padding: 0 3px 0 8px;
`;
const Left = Styled.div`
  span {
    coor: #949897;
    font-size: 14px;
    font-weight: 500;
    display: inline-block;
    margin-right: 5px;
  }
`;
const LeftArrow = Styled(FiArrowLeft)`
  color: #555;
  font-size: 18px;
  margin-right: 5px;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;
const RightArrow = Styled(FiArrowRight)`
  color: #555;
  font-size: 18px;
  cursor: pointer;
  &:hover {
    color: #000;
  }
`;
const Right = Styled.ul`
  display: flex;
  position: relative;
`;
const ViewItem = Styled.li`
  width: 28px;
  height: 28px;
  border-left: 1px solid #b9e1dc;
  font-size: 13px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  border: 1px solid #c9ebe7;
  color: #949897;
  margin-left: 3px;
  cursor: pointer;

  &:hover {
    background-color: #def0ee;
  }
  &.active {
    color: #fff;
    background-color: #00ada9;
  }
`;
const ReloadBtn = Styled(MdOutlineRefresh)`
  width: 28px;
  height: 28px;
  padding: 2px;
  font-weight: 900;
  margin-right: 10px;
  color: #888;
  cursor: pointer;
  &:hover {
    color: #00918e;
  }
`;
