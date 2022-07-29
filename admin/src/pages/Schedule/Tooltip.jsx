import React, { useContext, useEffect, useMemo, useState } from 'react';
import Styled from 'styled-components';
import Loading from '@/pages/Common/Loading';
import ReservationUserItem from './ReservationUserItem';
import useAxios from '%/useAxios';
import useStore from '%/useStore';
import useAlert from '%/useAlert';
import { Store } from './Scheduler';
import { BsChevronRight } from 'react-icons/bs';

export default function 툴팁({ getSchedule, setIsReservationModal }) {
  const dispatch = useStore((x) => x?.setState);
  const SCHEDULE_COLOR_TYPE = useStore((x) => x?.setting?.SCHEDULE_COLOR_TYPE);
  const {
    teacherList,
    roomList,
    colorList,
    isTooltip,
    setIsTooltip,
    timeout,
    setWriteInfo,
  } = useContext(Store);
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
    clearTimeout(timeout.current);

    if (!isTooltip?.bool) return;
    timeout.current = setTimeout(() => {
      setIsTooltip((prev) => ({ ...prev, bool: false, info: null }));
    }, 300);
  };

  const scheduleModify = () => {
    setWriteInfo({
      ...data,
      START_DATE: data?.START?.split(' ')[0],
      START_TIME: data?.START?.split(' ')[1],
      END_DATE: data?.END?.split(' ')[0],
      END_TIME: data?.END?.split(' ')[1],
    });
  };

  // 해당 스케줄만 삭제
  const thisScheduleDelete = () => ({
    mainTitle: '해당 스케줄만 삭제하시겠습니까?',
    subTitle: '※ 삭제 시 예약된 회원은 모두 예약이 취소됩니다.',
  });
  // 해당 스케줄 이후 모든 반복 스케줄 삭제
  const nextScheduleAllDelete = () => ({
    mainTitle: '해당 스케줄을 포함하여 이후 반복 스케줄을 삭제하시겠습니까?',
    subTitle: '※ 삭제 시 예약된 회원은 모두 예약이 취소됩니다.',
  });
  // 스케줄 삭제
  const scheduleAllDelete = () => ({
    mainTitle: '해당 스케줄을 포함하여 반복된 모든 스케줄을 삭제하시겠습니까?',
    subTitle: '※ 삭제 시 예약된 회원은 모두 예약이 취소됩니다.',
  });

  // 스케줄 삭제 타입 분할 로직
  const scheduleDelete = (type) => {
    if (type !== 'this' && type !== 'next' && type !== 'all') {
      return console.log('this || next || all');
    }

    let confirmInfo = null;
    if (type === 'this') {
      confirmInfo = thisScheduleDelete();
    } else if (type === 'next') {
      confirmInfo = nextScheduleAllDelete();
    } else if (type === 'all') {
      confirmInfo = scheduleAllDelete();
    }

    dispatch('confirmInfo', {
      mainTitle: confirmInfo?.mainTitle,
      subTitle: confirmInfo?.subTitle,
      yesFn: () => {
        let query = `id=${data?.ID}&groupId=${data?.SCHEDULE_GROUP_ID}&start=${data?.START}`;
        useAxios.delete(`/schedule/${type}?${query}`).then(({ data }) => {
          if (!data?.result) {
            useAlert.error('알림', data?.msg);
            return;
          }
          useAlert.success('알림', '삭제되었습니다.');
          getSchedule();
        });
      },
    });
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
        <ModifyBtnContainer bg={bg}>
          <NoticeMsg>
            {data?.CALENDAR_NAME}{' '}
            {data?.ROOM_NAME ? ' / ' + data?.ROOM_NAME : ''}
          </NoticeMsg>
          <ModifyBtn onClick={scheduleModify}>수정</ModifyBtn>
          <DeleteBtn>
            삭제 <RightArrowIcon />
            <DeleteOptionBtnContainer>
              <DeleteOptionBtn onClick={() => scheduleDelete('this')}>
                해당 스케줄만 삭제
              </DeleteOptionBtn>
              <DeleteOptionBtn onClick={() => scheduleDelete('next')}>
                이후 반복된 스케줄 전체삭제
              </DeleteOptionBtn>
              <DeleteOptionBtn onClick={() => scheduleDelete('all')}>
                반복된 스케줄 전체삭제
              </DeleteOptionBtn>
            </DeleteOptionBtnContainer>
          </DeleteBtn>
        </ModifyBtnContainer>
        {data?.CALENDAR_TYPE === 1 && (
          <ReservationBtn bg={bg} onClick={() => setIsReservationModal(data)}>
            예 약
          </ReservationBtn>
        )}
        <Info calendarType={data?.CALENDAR_TYPE}>
          {/* <Row>
            <Left>{data?.CALENDAR_NAME}</Left>
            <Right>{data?.ROOM_NAME}</Right>
          </Row> */}
          <Title>{data?.TITLE}</Title>
          <Row>
            날짜: {DATE[0]}년 {DATE[1]}월 {DATE[2]}일 {START_TIME} ~ {END_TIME}
          </Row>
          {data?.CALENDAR_TYPE === 1 && (
            <>
              <Row>
                정원: {data?.COUNT}명 / 대기: {data?.WAIT_COUNT}명
              </Row>
              <Row>강사: {data?.TEACHER_NAME}</Row>
              {data?.MEMO && (
                <Row
                  style={{
                    marginTop: 5,
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {data?.MEMO}
                </Row>
              )}
            </>
          )}
          {data?.IS_REPEAT > 1 && (
            <Row
              style={{
                marginTop: 5,
                fontSize: 12,
                textDecoration: 'underline',
              }}
            >
              ※ 해당 스케줄은 반복 생성된 스케줄입니다.
            </Row>
          )}
        </Info>
        {data?.CALENDAR_TYPE === 1 && (
          <>
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
                    scheduleData={data}
                    getUser={getUser}
                  />
                ))
              )}
            </List>
          </>
        )}
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
  min-height: 100px;
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
  &::after {
    content: '';
    display: block;
    position: absolute;
    bottom: calc(100% + 40px);
    right: 0;
    width: 70px;
    height: 50px;
  }
`;
const ModifyBtnContainer = Styled.div`
  border: 1px solid #fff;
  justify-content: flex-end;
  position: absolute;
  right: 0;
  bottom: calc(100% + 5px);
  width: 100%;
  height: 40px;
  border-radius: 5px;
  padding: 0 5px;
  background-color: ${(x) => x?.bg ?? '#555'};
`;
const ReservationBtn = Styled.div`
  cursor: pointer;
  border: 1px solid #fff;
  justify-content: flex-end;
  position: absolute;
  right: 0;
  bottom: calc(100% + 49px);
  height: 40px;
  border-radius: 5px;
  padding: 0 14px;
  letter-spacing: 1px;
  background-color: ${(x) => x?.bg ?? '#555'};
  z-index: 2;
  &:hover {
    filter: brightness(1.1);
  }
`;
const ModifyBtn = Styled.button`
  height: 30px;
  border: none;
  white-space: nowrap;
  padding: 0 8px !important;
  background-color: transparent !important;
  /* background-color: #666666 !important; */
  &:hover {
    color: #eeeeee !important;
    /* background-color: #5c5c5c !important; */
  }
  &:focus {
    box-shadow: none !important;
  }
  /* &:active {
    background-color: #505050 !important;
  } */
`;
const DeleteBtn = Styled.section`
  font-size: 13px;
  font-weight: 400;
  color: #fff;
  border-radius: 3px;
  white-space: nowrap;
  padding: 0 8px !important;
  line-height: 30px;
  cursor: pointer;
  position: relative;
  height: 30px;
  /* margin-left: 5px; */
  /* background-color: #fe5a5a; */
  background-color: transparent !important;
  border: none;
  &:hover > section {
    display: block;
  }
  &::before {
    content: '';
    display: block;
    position: absolute;
    left: 0;
    top: 0;
    width: calc(100% + 20px);
    height: 100%;
    background-color: transparent;
  }

`;
const RightArrowIcon = Styled(BsChevronRight)`
  margin-left: 2px;
  width: 10px;
  height: 10px;
`;
const DeleteOptionBtnContainer = Styled.section`
  position: absolute;
  left: calc(100% + 10px);
  top: -4px;
  display: none;
`;
const DeleteOptionBtn = Styled(DeleteBtn)`
  white-space: nowrap;
  margin-bottom: 5px;
  padding: 0 14px 0 12px !important;
  background-color: #fe5a5a !important;
  line-height: 34px;
  height: 34px;
  border: 1px solid #fff;
  &:last-of-type {
    margin-bottom: 0;
  }
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
  padding: 0 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;
const Info = Styled.section`
  width: 100%;
  border-bottom: ${(x) => (x?.calendarType === 1 ? 1 : 0)}px solid #ffffff30;
  padding-bottom: ${(x) => (x?.calendarType === 1 ? 10 : 0)}px;
  margin-bottom: ${(x) => (x?.calendarType === 1 ? 6 : 0)}px;
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
