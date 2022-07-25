import React, { useContext, useMemo } from 'react';
import Styled from 'styled-components';
import { Store } from './Scheduler';

export default function 스케줄박스({ data }) {
  if (!data) return null;
  const { colorList, isTooltip, setIsTooltip, timeout } = useContext(Store);

  const bg = useMemo(() => colorList[data?.ROOM_ID], [colorList, data]);

  const hour = useMemo(() => {
    let time = data?.START?.split(' ')[1];
    return time?.split(':')[0];
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
        {hour}시. {data?.TITLE}
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
    display: block;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    color: #fff;
  }
`;
