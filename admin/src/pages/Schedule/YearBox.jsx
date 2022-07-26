import React, { useMemo, useContext } from 'react';
import Styled from 'styled-components';
import { Store } from './Scheduler';

export default function 스케줄박스({ data }) {
  if (!data) return null;
  const { roomList, colorList, isTooltip, setIsTooltip, timeout } =
    useContext(Store);

  const bg = useMemo(() => {
    let idx = roomList?.findIndex((x) => x?.ID === Number(data?.ROOM_ID));
    return colorList[idx];
  }, [colorList, data]);

  const date = useMemo(() => {
    let _date = data?.START?.split(' ')[0];
    return _date?.split('-')[2];
  }, [data]);

  const onMouseEnter = (e) => {
    clearTimeout(timeout.current);
    let { pageX, pageY } = e;
    let { innerWidth, innerHeight } = window;
    let xOver = pageX * 2 >= innerWidth;
    let yOver = pageY * 2 >= innerHeight;
    let { left, top, translateX, translateY } = {
      left: `${pageX}px`,
      top: `${pageY}px`,
      translateX: `14px`,
      translateY: `14px`,
    };

    if (xOver) {
      translateX = `calc(-100% - 14px)`;
    }
    if (yOver) {
      translateY = `calc(-100% - 14px)`;
    }

    setIsTooltip({
      bool: true,
      info: data,
      left,
      top,
      translate: `${translateX}, ${translateY}`,
    });
  };

  const onMouseLeave = (e) => {
    clearTimeout(timeout.current);

    if (!isTooltip?.bool) return;
    timeout.current = setTimeout(() => {
      setIsTooltip((prev) => ({ ...prev, bool: false, info: null }));
    }, 500);
  };

  return (
    <Container
      key={data?.ID}
      bg={bg}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
    >
      <span>
        {date}일. {data?.TITLE}
      </span>
    </Container>
  );
}

const Container = Styled.div`
  padding: 6px;
  border-radius: 3px;
  background-color: #519a92;
  box-shadow: 1px 1px #55555555;
  margin-bottom: 5px;
  position: relative;
  background-color: ${(x) => x?.bg ?? '#555'};
  transition: .2s;
  cursor: zoom-in;
  filter: opacity(0.9);
  &:hover {
    filter: opacity(1);
  }
  &:last-of-type {
    margin-bottom: 0;
  }
  & > span {
    font-size: 12px;
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }
`;
