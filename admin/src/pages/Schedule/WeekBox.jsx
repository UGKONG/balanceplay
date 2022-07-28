import React, { useMemo, useState, useContext } from 'react';
import Styled from 'styled-components';
import useStore from '%/useStore';
import { Store } from './Scheduler';

export default function 스케줄박스({ data }) {
  if (!data) return null;
  const [zIndex, setZIndex] = useState(20);
  const currentStartTime = useStore((x) => x?.setting?.START_TIME);
  const SCHEDULE_COLOR_TYPE = useStore((x) => x?.setting?.SCHEDULE_COLOR_TYPE);
  const {
    teacherList,
    roomList,
    currentHourList,
    colorList,
    isTooltip,
    setIsTooltip,
    timeout,
  } = useContext(Store);

  const { DATE, START_TIME, END_TIME } = useMemo(
    () => ({
      DATE: data?.START?.split(' ')[0]?.split('-'),
      START_TIME: data?.START?.split(' ')[1]?.slice(0, 5),
      END_TIME: data?.END?.split(' ')[1]?.slice(0, 5),
    }),
    [data],
  );

  const heightTop = useMemo(() => {
    let rowCount = currentHourList?.length;
    let [currentH, currentM] = currentStartTime?.split(':');
    [currentH, currentM] = [currentH, currentM]?.map((x) => Number(x));
    let [startH, startM] = START_TIME?.split(':')?.map((x) => Number(x));
    let [endH, endM] = END_TIME?.split(':')?.map((x) => Number(x));
    let startHCalc = (startH - currentH) * 100;
    let startMCalc = (((startM - currentM) / 60) * 100) / rowCount;
    let endHCalc = (endH - startH - (startM > endM ? 1 : 0)) * 100;
    let mCalc = endM - startM;
    mCalc = (mCalc >= 0 ? mCalc : 60 - Math.abs(mCalc)) / 60;
    let endMCalc = (mCalc * 100) / rowCount;

    return {
      top: `calc(${startHCalc}px + ${startMCalc}%)`,
      height: `calc(${endHCalc}px + ${endMCalc}%)`,
    };
  }, [data]);

  const bg = useMemo(() => {
    let idx;
    if (SCHEDULE_COLOR_TYPE === 2) {
      idx = teacherList?.findIndex((x) => x?.ID === Number(data?.TEACHER_ID));
      idx = Math.round(((idx / teacherList?.length) * 100) / 10);
    } else {
      idx = roomList?.findIndex((x) => x?.ID === Number(data?.ROOM_ID));
      idx = Math.round(((idx / roomList?.length) * 100) / 10);
    }

    return colorList[idx];
  }, [colorList, teacherList, roomList, data]);

  const w = useMemo(() => {
    if (!data?.GROUP_ID || !data?.GROUP_COUNT) return 100;
    let result = 100 / data?.GROUP_COUNT - 10 / data?.GROUP_COUNT;
    return result;
  }, [data]);

  const left = useMemo(() => data?.FINAL_IDX * w, [w, data]);

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
    setZIndex(100);
  };
  const onMouseLeave = (e) => {
    clearTimeout(timeout.current);

    if (!isTooltip?.bool) return;
    timeout.current = setTimeout(() => {
      setIsTooltip((prev) => ({ ...prev, bool: false, info: null }));
    }, 500);
    setZIndex(20);
  };

  const JSX = useMemo(
    () => (
      <Container
        w={w}
        key={data?.ID}
        left={left}
        i={zIndex}
        style={{ ...heightTop }}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <Wrap bg={bg}>
          <Info>
            <Head>
              <Count>
                {data?.RESERVATION_COUNT ?? '0'}/{data?.COUNT}명
              </Count>
              <Title>{data?.TITLE}</Title>
            </Head>
          </Info>
        </Wrap>
      </Container>
    ),
    [w, data, bg, zIndex, heightTop],
  );

  return JSX;
}

const Container = Styled.div`
  position: absolute;
  padding: 1px;
  min-height: 25px;
  transition: .2s;
  z-index: ${(x) => x?.i ?? 20};
  min-width: 30px;
  filter: opacity(0.9);
  width: ${(x) => x?.w ?? 100}%;
  left: ${(x) => x?.left}%;
  &:hover {
    filter: opacity(1);
  }
`;
const Wrap = Styled.div`
  display: block !important;
  position: relative;
  width: 100%;
  height: 100%;
  padding: 6px;
  color: #fff;
  font-size: 12px;
  border-radius: 3px;
  box-shadow: 1px 1px #55555555;
  cursor: zoom-in;
  overflow: hidden;
  background-color: ${(x) => x?.bg ?? '#555'};
`;
const Info = Styled.section`
  
`;
const Head = Styled.p`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
const Count = Styled.span`
  font-size: 13px;
  font-weight: 500;
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Title = Styled.span`
  display: block;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
