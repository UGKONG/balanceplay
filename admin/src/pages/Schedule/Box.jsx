import React, { useCallback, useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import useDate from '%/useDate';
import useStore from '%/useStore';
import useAxios from '%/useAxios';
import Loading from '@/pages/Common/Loading';
import ReservationUserItem from './ReservationUserItem';

export default function 스케줄박스({ data, idx, currentHourList }) {
  const [isTooltip, setIsTooltip] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState([]);
  if (!data) return null;
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

  const getUser = () => {
    setIsLoading(true);
    useAxios.get('/reservationUser/' + data?.ID).then(({ data }) => {
      setIsLoading(false);
      if (!data?.result || !data?.data) return setUserList([]);
      setUserList(data?.data);
    });
  };

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
      onMouseOver={mouseOver}
      onMouseLeave={mouseLeave}
    >
      <Wrap bg={bg}>
        {data?.ID}
        <Tooltip style={{ display: isTooltip ? 'block' : 'none' }}>
          <TooltipWrap bg={bg}>
            <Info>
              <Row>
                <Left>{data?.CALENDAR_NAME}</Left>
                <Right>{data?.ROOM_NAME}</Right>
              </Row>
              <Title>{data?.TITLE}</Title>
              <Row>
                날짜: {DATE[0]}년 {DATE[1]}월 {DATE[2]}일
              </Row>
              <Row>
                시간: {START_TIME} ~ {END_TIME}
              </Row>
              <Row>강사: {data?.TEACHER_NAME}</Row>
              <Row style={{ marginTop: 5 }}>{data?.CONTENTS ?? '-'}</Row>
            </Info>
            <ListTitle okCount={userList?.length}>예약 회원</ListTitle>
            <List>
              {isLoading ? (
                <Loading />
              ) : (
                userList?.map((item) => (
                  <ReservationUserItem key={item?.ID} data={item} />
                ))
              )}
            </List>
          </TooltipWrap>
        </Tooltip>
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
const Tooltip = Styled.article`
  display: none;
  position: absolute;
  left: calc(100% + 14px);
  top: 0;
  z-index: 9999;
`;
const TooltipWrap = Styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start !important;
  background-color: ${(x) => x?.bg ?? '#555'};
  border: 1px solid ${(x) => x?.bg ?? '#555'};
  border-radius: 5px;
  width: 100%;
  height: 100%;
  position: relative;
  min-width: 250px;
  max-width: 400px;
  min-height: 300px;
  max-height: 500px;
  color: #fff;
  padding: 3px 6px 6px;
  cursor: default;

  &::before {
    content: '';
    display: block;
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    right: 100%;
  }
  &::after {
    content: '';
    display: block;
    position: absolute;
    right: 100%;
    top: 10px;
    width: 0; 
    height: 0;
    border-style: solid;
    border-width: 8px 10px;
    border-color: transparent ${(x) => x?.bg ?? '#555'} transparent transparent;
  }
`;
const Info = Styled.section`
  width: 100%;
  border-bottom: 1px solid #ffffff30;
  padding-bottom: 10px;
  margin-bottom: 6px;
`;
const ListTitle = Styled.p`
  width: 100%;
  color: #fff;
  font-size: 13px;
  margin-bottom: 6px;
  position: relative;

  &::after {
    content: '${(x) => x?.okCount ?? 0}명';
    font-size: 12px;
    position: absolute;
    bottom: 0;
    right: 0;
  }
`;
const List = Styled.section`
  width: 100%;
  min-height: 150px;
  flex: 1;
  padding: 5px;
  overflow: auto;
  background-color: #ffffff50;
`;
const Title = Styled.div`
  padding: 5px 0;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 1px;
`;
const Row = Styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1px 0;
  & > div {
    width: 50%;
    white-space: nowrap;
  }
`;
const Left = Styled.div`
  
`;
const Right = Styled.div`
  justify-content: flex-end;
  
`;
