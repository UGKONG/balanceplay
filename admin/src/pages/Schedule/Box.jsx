import React, { useCallback, useEffect, useMemo } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';
import useStore from '%/useStore';

export default function 스케줄박스({ data, currentHourList }) {
  if (!data) return null;

  const colorList = useStore((x) => x?.colorList);
  const currentStartTime = useStore((x) => x?.setting?.START_TIME);
  const currentEndTime = useStore((x) => x?.setting?.END_TIME);
  const { START_TIME, END_TIME } = useMemo(
    () => ({
      START_TIME: data?.START?.split(' ')[1],
      END_TIME: data?.END?.split(' ')[1],
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

  const bg = useMemo(() => colorList[data?.ROOM_ID], [colorList, data]);

  const w = useMemo(
    () => (data?.GROUP_ID ? 100 / data?.GROUP_COUNT : 100),
    [data],
  );

  const left = useMemo(() => data?.GROUP_IDX * w, [w, data]);

  useEffect(
    () =>
      console.log({
        ID: data?.ID,
        GROUP_ID: data?.GROUP_ID,
        GROUP_IDX: data?.GROUP_IDX,
        GROUP_COUNT: data?.GROUP_COUNT,
        MOVE_COUNT: data?.MOVE_COUNT,
      }),
    [data],
  );

  return (
    <Container
      w={w}
      bg={bg}
      key={data?.ID}
      left={left}
      i={data?.GROUP_IDX}
      style={{ ...heightTop }}
    >
      <article>{data?.ID}</article>
    </Container>
  );
}

const Container = Styled.div`
  position: absolute;
  padding: 1px;
  overflow: hidden;
  min-height: 25px;
  transition: .2s;
  z-index: 3;
  min-width: 30px;
  filter: opacity(0.9);
  width: ${(x) => x?.w}%;
  left: ${(x) => x?.left}%;
  & > article {
    width: 100%;
    height: 100%;
    padding: 6px;
    color: #fff;
    font-size: 12px;
    border-radius: 3px;
    box-shadow: 1px 1px #55555555;
    cursor: zoom-in;
    background-color: ${(x) => x?.bg ?? '#555'};
  }
  &:hover {
    filter: opacity(1);
  }
`;
