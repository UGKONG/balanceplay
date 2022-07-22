import React, { useEffect, useMemo } from 'react';
import Styled from 'styled-components';
import Loading from '@/pages/Common/Loading';
import ReservationUserItem from './ReservationUserItem';

export default function 툴팁({
  bg,
  data,
  isLoading,
  userList,
  getUser,
  x,
  y,
  translate,
}) {
  const { DATE, START_TIME, END_TIME } = useMemo(
    () => ({
      DATE: data?.START?.split(' ')[0]?.split('-'),
      START_TIME: data?.START?.split(' ')[1]?.slice(0, 5),
      END_TIME: data?.END?.split(' ')[1]?.slice(0, 5),
    }),
    [data],
  );

  return (
    <Container x={x} y={y} translate={translate}>
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
          ) : userList?.length === 0 ? (
            <NotItem>예약회원이 없습니다.</NotItem>
          ) : (
            userList?.map((item) => (
              <ReservationUserItem
                key={item?.ID}
                data={item}
                getUser={getUser}
              />
            ))
          )}
        </List>
      </TooltipWrap>
    </Container>
  );
}

const Container = Styled.article`
  position: absolute;
  z-index: 9999;
  left: ${(a) => a?.x ?? 'calc(100% + 6px)'};
  top: ${(a) => a?.y ?? 0};
  ${(a) => a?.translate && `transform: translate(${a?.translate})`}
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
    width: 20px;
    height: 100%;
    position: absolute;
    top: 0;
    left: 100%;
  }
  /* &::after {
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
  } */
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
  background-color: #ffffff90;
  border-radius: 5px;
  position: relative;
`;
const NotItem = Styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  justify-content: center;
  font-size: 12px;
  color: #888;
`;
const Title = Styled.div`
  padding: 5px 0;
  font-size: 17px;
  font-weight: 500;
  letter-spacing: 1px;
  width: 100%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
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
