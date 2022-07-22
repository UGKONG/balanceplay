import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import useStore from '%/useStore';
import useAxios from '%/useAxios';
import Tooltip from './Tooltip';

export default function 스케줄박스({ data, currentHourList }) {
  if (!data) return null;
  const [isTooltip, setIsTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [position, setPosition] = useState(null);
  const [userList, setUserList] = useState([]);
  const [zIndex, setZIndex] = useState(20);
  const colorList = useStore((x) => x?.colorList);
  const currentStartTime = useStore((x) => x?.setting?.START_TIME);
  const currentEndTime = useStore((x) => x?.setting?.END_TIME);

  const { DATE, START_TIME, END_TIME } = useMemo(
    () => ({
      DATE: data?.START?.split(' ')[0]?.split('-'),
      START_TIME: data?.START?.split(' ')[1]?.slice(0, 5),
      END_TIME: data?.END?.split(' ')[1]?.slice(0, 5),
    }),
    [data],
  );

  const getUser = useCallback(() => {
    setIsLoading(true);
    useAxios.get('/reservation/' + data?.ID).then(({ data }) => {
      setIsLoading(false);
      if (!data?.result || !data?.data) return setUserList([]);
      setUserList(data?.data);
    });
  }, [data, setIsLoading, setUserList]);

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

  const left = useMemo(() => data?.FINAL_IDX * w, [w, data]);

  const mouseOver = (e) => {
    setPosition(() => {
      let [boxW, boxY] = [e.target.clientWidth, e.target.clientHeight];
      let [screenW, screenH] = [window.innerWidth, window.innerHeight];
      let [mouseX, mouseY] = [e.pageX, e.pageY];
      let xOver = mouseX * 2 > screenW;
      let yOver = mouseY * 1.7 > screenH;

      if (!xOver && yOver) {
        return {
          translate: `0, calc(-100% + ${boxY}px)`,
        };
      }
      if (xOver && !yOver) {
        return {
          translate: `calc(-100% - ${boxW}px - 10px), 0`,
        };
      }
      if (xOver && yOver) {
        return {
          translate: `calc(-100% - ${boxW}px - 10px), calc(-100% + ${boxY}px)`,
        };
      }
      return null;
    });
    setIsTooltip(true);
    setZIndex(100);
  };
  const mouseLeave = (e) => {
    setIsTooltip(false);
    setZIndex(20);
  };

  useEffect(() => isTooltip && getUser(), [isTooltip]);

  return (
    <Container
      w={w}
      key={data?.ID}
      left={left}
      i={zIndex}
      style={{ ...heightTop }}
      onMouseEnter={mouseOver}
      onMouseLeave={mouseLeave}
    >
      <Wrap bg={bg}>
        <Info>
          <Title>{data?.TITLE}</Title>
        </Info>
        {isTooltip && (
          <Tooltip
            bg={bg}
            data={data}
            userList={userList}
            isLoading={isLoading}
            getUser={getUser}
            x={position?.x}
            y={position?.y}
            translate={position?.translate}
          />
        )}
      </Wrap>
    </Container>
  );
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
  background-color: ${(x) => x?.bg ?? '#555'};
`;
const Info = Styled.section`
  
`;
const Title = Styled.p`
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;
