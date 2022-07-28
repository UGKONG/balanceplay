import React, { useCallback, useRef, useContext } from 'react';
import Styled from 'styled-components';
import YearBox from './YearBox';
import { Store } from './Scheduler';
import useDate from '%/useDate';
import useAlert from '%/useAlert';

export default function 년({}) {
  const yearList = useRef(new Array(12).fill(null));
  const { list: data, active, setWriteInfo, calendarList } = useContext(Store);

  const list = useCallback(
    (num) => {
      let i = num + 1;
      return data?.filter((x) => Number(x?.START?.split('-')[1]) === i);
    },
    [data],
  );

  const createSchedule = (month) => {
    if (!month) return;
    if (active?.calendar === 0) {
      return useAlert.info('알림', '캘린더를 선택해주세요.');
    }

    let today = new Date();
    today?.setHours(today?.getHours() + 1);
    today?.setMinutes(0);
    today?.setSeconds(0);
    today?.setMilliseconds(0);
    let START_TIME = useDate(today, 'time');
    today?.setHours(today?.getHours() + 1);
    let END_TIME = useDate(today, 'time');

    let findCalendar = calendarList?.find((x) => x?.ID === active?.calendar);
    let CALENDAR_TYPE = findCalendar ? findCalendar?.TYPE : 0;

    let [Y, M, D] = active?.start?.split('-');
    let START_DATE =
      Y + '-' + (Number(month) < 10 ? '0' + month : month) + '-' + D;
    let END_DATE =
      Y + '-' + (Number(month) < 10 ? '0' + month : month) + '-' + D;

    setWriteInfo({
      CALENDAR_TYPE,
      START_DATE,
      END_DATE,
      START_TIME,
      END_TIME,
    });
  };

  return (
    <Container>
      {yearList?.current?.map((d, i) => (
        <YearContainer key={i} onClick={() => createSchedule(i + 1)}>
          <YearTitle count={list(i)?.length}>{i + 1}월</YearTitle>
          <ScheduleList>
            {list(i)?.map((item) => (
              <YearBox key={item?.ID} data={item} />
            ))}
          </ScheduleList>
        </YearContainer>
      ))}
    </Container>
  );
}

const Container = Styled.section`
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  flex-wrap: wrap;
`;
const YearContainer = Styled.div`
  min-width: calc(100% / 6);
  height: 50%;
  flex: 1;
  border-bottom: 1px solid #b9e1dc99;
  display: block !important;
  cursor: pointer;
  &:nth-of-type(6) ~ & {
    border-bottom: none;
  }
  &:nth-of-type(6), &:nth-of-type(12) {
     & > p, & > ul {
       border-right: none;
     }
  }
  &:hover > p {
    text-decoration: underline;
  }
`;
const YearTitle = Styled.p`
  height: 30px;
  text-align: center;
  font-size: 14px;
  font-weight: 500;
  color: #555;
  background-color: #b9e1dc99;
  display: flex;
  align-items: center;
  justify-content: center;
  border-right: 1px solid #fff;
  position: relative;
  
  &::after {
    content: '${(x) => x?.count ?? 0}개';
    display: ${(x) => (x?.count === 0 ? 'none' : 'block')};
    position: absolute;
    bottom: 2px;
    right: 4px;
    font-size: 10px;
    color: #666;
    text-decoration: none !important;
  }
`;
const ScheduleList = Styled.ul`
  border-right: 1px solid #b9e1dc99;
  height: calc(100% - 30px);
  padding: 6px;
  overflow: auto;
  &::-webkit-scrollbar {
    width: 0;
  }
`;
