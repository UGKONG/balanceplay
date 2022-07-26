import React, { useContext, useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import Loading from '@/pages/Common/Loading';
import ReservationUserItem from './ReservationUserItem';
import useAxios from '%/useAxios';
import useStore from '%/useStore';
import useAlert from '%/useAlert';
import { Store } from './Scheduler';

export default function 툴팁({ getSchedule }) {
  const dispatch = useStore((x) => x?.setState);
  const { roomList, colorList, isTooltip, setIsTooltip, timeout } =
    useContext(Store);
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

  const bg = useMemo(() => {
    let idx = roomList?.findIndex((x) => x?.ID === Number(data?.ROOM_ID));
    return colorList[idx];
  }, [colorList, data]);

  const positionStyle = useMemo(() => {
    let { left, top, translate } = isTooltip;
    return { left, top, translate };
  }, [isTooltip?.left, isTooltip?.top, isTooltip?.translate]);

  const memberCount = useMemo(
    () => ({
      total: userList?.length,
      reserv: userList?.filter((x) => x?.STATUS === 1)?.length,
      yes: userList?.filter((x) => x?.STATUS === 2)?.length,
      no: userList?.filter((x) => x?.STATUS === 3)?.length,
    }),
    [userList],
  );

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
    const mainTitle = (data?.TITLE ?? '해당 ') + ' 수업을 삭제하시겠습니까?';
    const subTitle = '수업에 대한 정보가 삭제됩니다.';
    const yesFn = () => {
      useAxios.delete('/schedule/' + data?.ID).then(({ data }) => {
        if (!data?.result) {
          useAlert.error('알림', data?.msg);
          return;
        }
        useAlert.success('알림', '수업이 삭제되었습니다.');
        getSchedule();
      });
    };

    dispatch('confirmInfo', { mainTitle, subTitle, yesFn });
  };

  useEffect(() => {
    if (!data || !isOn) return;
    getUser();
    return () => getUser();
  }, [data, isOn]);

  return (
    <Container po={positionStyle}>
      <TooltipWrap
        bg={bg}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      >
        <ModifyBtnContainer
          bg={bg}
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
            날짜: {DATE[0]}년 {DATE[1]}월 {DATE[2]}일 {START_TIME} ~ {END_TIME}
          </Row>
          <Row>
            정원: {data?.COUNT}명 / 대기: {data?.WAIT_COUNT}명
          </Row>
          <Row>강사: {data?.TEACHER_NAME}</Row>
          <Row style={{ marginTop: 5 }}>{data?.CONTENTS ?? '-'}</Row>
        </Info>
        <ListTitle>
          <TotalCount>총: {memberCount?.total}명</TotalCount>
          <StatusCount>
            <span>예약: {memberCount?.reserv}명</span>
            <span>출석: {memberCount?.yes}명</span>
            <span>결석: {memberCount?.no}명</span>
          </StatusCount>
        </ListTitle>
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
  border: 1px solid #fff;
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
  font-size: 12px;
  margin-bottom: 6px;
  position: relative;
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
`;
const TotalCount = Styled.span`
  font-size: 13px;
  font-weight: 500;
`;
const StatusCount = Styled.span`
  & > span:not(& > span:last-of-type)::after {
    content: ' / ';
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
