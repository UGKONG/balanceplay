import React, { useContext, useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import Loading from '@/pages/Common/Loading';
import ReservationUserItem from './ReservationUserItem';
import useAxios from '%/useAxios';
import { Store } from './Scheduler';

export default function 툴팁() {
  const { colorList, isTooltip, setIsTooltip, timeout } = useContext(Store);
  const [isLoading, setIsLoading] = useState(true);
  const [userList, setUserList] = useState([]);

  const data = useMemo(() => isTooltip?.info, [isTooltip?.info]);
  const isOn = useMemo(() => isTooltip?.bool, [isTooltip?.bool]);
  if (!data || !isOn) return null;

  const { DATE, START_TIME, END_TIME } = useMemo(() => {
    if (!isTooltip?.info) {
      return { DATE: null, START_TIME: null, END_TIME: null };
    }
    return {
      DATE: data?.START?.split(' ')[0]?.split('-'),
      START_TIME: data?.START?.split(' ')[1]?.slice(0, 5),
      END_TIME: data?.END?.split(' ')[1]?.slice(0, 5),
    };
  }, [data]);

  const bgColor = useMemo(
    () => colorList[data?.ROOM_ID] || null,
    [colorList, data],
  );

  const positionStyle = useMemo(() => {
    let { left, top, translate } = isTooltip;
    return { left, top, translate };
  }, [isTooltip?.left, isTooltip?.top, isTooltip?.translate]);

  const getUser = () => {
    setIsLoading(true);
    useAxios.get('/reservation/' + data?.ID).then(({ data }) => {
      setIsLoading(false);
      if (!data?.result || !data?.data) return setUserList([]);
      setUserList(data?.data);
    });
  };

  const onMouseEnter = () => {
    clearTimeout(timeout.current);
  };

  const onMouseLeave = () => {
    setIsTooltip((prev) => ({ ...prev, bool: false, info: null }));
  };

  const scheduleModify = () => {};

  const scheduleDelete = () => {
    let ask = confirm('해당 스케줄을 삭제하시겠습니까?');
    if (!ask) return;
    // useAxios.delete('/' + data?.ID);
  };

  useEffect(() => {
    if (!data || !isOn) return;
    getUser();
    return () => getUser;
  }, [data, isOn]);

  return (
    <Container po={positionStyle}>
      <TooltipWrap
        bg={bgColor}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ModifyBtnContainer
          bg={bgColor}
          style={{ width: userList?.length > 0 ? '100%' : 'auto' }}
        >
          {userList?.length > 0 ? (
            <NoticeMsg>예약자가 존재하여 수정이 불가합니다.</NoticeMsg>
          ) : (
            <>
              <ModifyBtn onClick={scheduleModify}>수정</ModifyBtn>
              <DeleteBtn onClick={scheduleDelete}>삭제</DeleteBtn>
            </>
          )}
        </ModifyBtnContainer>
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
  position: fixed;
  z-index: 9999;
  font-size: 13px;
  left: ${(x) => x?.po?.left};
  top: ${(x) => x?.po?.top};
  transform: translate(${(x) => x?.po?.translate});
`;
const TooltipWrap = Styled.div`
  box-shadow: 1px 3px 5px #00000050;
  border: 1px solid #fff;
  display: flex;
  flex-direction: column;
  align-items: flex-start !important;
  background-color: ${(x) => x?.bg ?? '#555'};
  border-radius: 5px;
  width: 100%;
  height: 100%;
  position: relative;
  min-width: 250px;
  max-width: 400px;
  min-height: 300px;
  max-height: 500px;
  color: #fff;
  padding: 6px 9px 9px;
  cursor: default;
  &::before {
    content: '';
    display: block;
    position: absolute;
    bottom: 100%;
    left: 0;
    width: 100%;
    height: 45px;
  }
`;
const ModifyBtnContainer = Styled.div`
  justify-content: flex-end;
  position: absolute;
  right: 0;
  bottom: calc(100% + 5px);
  width: auto;
  height: 40px;
  border-radius: 5px;
  padding: 0 5px;
  background-color: ${(x) => x?.bg ?? '#555'};
`;
const ModifyBtn = Styled.button`
  height: 30px;
  margin-left: 5px;
  border: none;
`;
const DeleteBtn = Styled.button`
  height: 30px;
  margin-left: 5px;
  background-color: #fe5a5a;
  border: none;
  &:hover {
    background-color: #f74a4a !important;
  }
  &:focus {
    box-shadow: 0 0 0 4px #fe5a5a40 !important;
  }
  &:active {
    background-color: #ec3b3b !important;
  }
`;
const NoticeMsg = Styled.span`
  width: 100%;
  text-align: center;
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
