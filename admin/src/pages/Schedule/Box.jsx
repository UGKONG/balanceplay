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

  const w = useMemo(() => {
    if (!data?.GROUP_ID || !data?.GROUP_COUNT) return 100;
    let result = 100 / data?.GROUP_COUNT - 10 / data?.GROUP_COUNT;
    return result;
  }, [data]);

  const left = useMemo(() => data?.PREV_IDX * w, [w, data]);

  return (
    <Container
      w={w}
      key={data?.ID}
      left={left}
      i={data?.NEXT_IDX}
      style={{ ...heightTop }}
    >
      <Wrap bg={bg}>
        {data?.ID}
        <Tooltip>
          <TooltipWrap>툴팁</TooltipWrap>
        </Tooltip>
      </Wrap>
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
  background-color: ${(x) => x?.bg ?? '#555'};
  &:hover {
    & > article {
      display: block;
    }
  }
`;
const Tooltip = Styled.article`
  display: none;
  position: absolute;
  left: 100%;
  top: 10%;
  z-index: 9999;
`;
const TooltipWrap = Styled.div`
  display: block !important;
  background-color: #fff;
  width: 100%;
  height: 100%;
  position: relative;
  min-width: 200px;
  min-height: 100px;
`;
